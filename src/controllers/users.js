import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import conn from "../db/index.js";
import {
  JWT_SECRET_KEY as secretKey,
  generateRandomString,
} from "../helpers/users.js";
import UserService from "../services/user.js";
import { recoverSig } from "../utils/metamask.js";

// 회원가입
export const postUsers = async function (req, res, next) {
  const { email, password, name, birthday, phone_number } = req.body;
  const query = `SELECT id FROM user WHERE email='${email}';`;
  const query2 = `SELECT id FROM user WHERE phone_number = '${phone_number}';`;
  const [rows] = await conn.query(query);

  const checkEng = /[A-Z]/g;
  if (checkEng.test(email)) {
    return res.status(409).send({
      success: false,
      message: "이메일에 대문자는 사용할 수 없습니다.",
    });
  }

  if (rows.length) {
    return res.status(409).send({
      success: false,
      message: "중복되는 이메일이 존재합니다.",
    });
  }

  const [rows2] = await conn.query(query2);

  if (phone_number === "") {
    const salt = await bcrypt.genSalt();
    const hashedPW = await bcrypt.hash(password, salt);

    let flag = true;
    let randomStr = "";
    while (flag) {
      randomStr = generateRandomString(10);
      const query = `SELECT id FROM user WHERE recommend_code = '${randomStr}';`;
      const [row] = await conn.query(query);
      if (row.length === 0) {
        flag = false;
      }
    }
    const query3 = `
  INSERT INTO user(email, password, salt, name, birthday, phone_number, recommend_code)
  VALUES ('${email}','${hashedPW}','${salt}','${name}','${birthday}','${phone_number}','${randomStr}')
  `;

    const [rows3] = await conn.query(query3);
    return res.send({ success: true });
  }
  if (rows2.length) {
    return res.status(409).send({
      success: false,
      message: "본인 휴대폰만 인증가능합니다. ",
    });
  }

  const salt = await bcrypt.genSalt();
  const hashedPW = await bcrypt.hash(password, salt);

  let flag = true;
  let randomStr = "";
  while (flag) {
    randomStr = generateRandomString(10);
    const query = `SELECT id FROM user WHERE recommend_code = '${randomStr}';`;
    const [row] = await conn.query(query);
    if (row.length === 0) {
      flag = false;
    }
  }
  const query3 = `
  INSERT INTO user(email, password, salt, name, birthday, phone_number, recommend_code)
  VALUES ('${email}','${hashedPW}','${salt}','${name}','${birthday}','${phone_number}','${randomStr}')
  `;

  const [rows3] = await conn.query(query3);
  return res.send({ success: true });
};

// 로그인
export const postUsersToken = async (req, res) => {
  const { email, password } = req.body;

  const query = `
        SELECT id, salt, password FROM user WHERE email='${email}';
    `;
  const [rows] = await conn.query(query);

  const checkEng = /[A-Z]/g;
  if (checkEng.test(email)) {
    return res.status(409).send({
      success: false,
      message: "이메일에 대문자는 사용할 수 없습니다.",
    });
  }

  // email 체크
  if (rows.length === 0) {
    return res
      .status(401)
      .send({ success: false, message: "일치하는 사용자가 없습니다." });
  }

  // password 체크
  const user = rows[0];
  const { salt } = user;
  //비구조화할당

  const hashedPW = await bcrypt.hash(password, salt);
  if (user.password !== hashedPW) {
    return res
      .status(401)
      .send({ success: false, message: "비밀번호가 틀렸습니다." });
  }

  // 토큰 생성

  const payload = { userId: user.id };
  const option = { expiresIn: "1d" };
  const token = jwt.sign(payload, secretKey, option);
  res.send({ token });
};

export const patchUserWalletAddress = async (req, res) => {
  const { walletAddress, signature, data } = req.body;

  const correctWallet = recoverSig({ signature, data });
  if (walletAddress !== correctWallet) {
    return res.status(401).send({ message: "입력하신 지갑 주소랑 다릅니다." });
  }

  await UserService.updateWalletAddress({
    walletAddress,
    userId: req.userId,
  });

  return res.send(true);
};

// 토큰으로 누가 요청했는지 확인
// 토큰의 userId로 db에서 유저 정보 가져오기
// 유저 정보 응답해주기
export const getUsersMyInfo = async (req, res) => {
  const query = `SELECT id, name, phone_number, email, recommend_code, birthday, walletAddress, profileImage
  FROM user WHERE user.id = '${req.userId}';`;

  const query2 = `SELECT wallet.id, wallet.coin_id, wallet.address, coin.name_kr, coin.unit
  FROM wallet JOIN coin ON wallet.coin_id = coin.id 
  WHERE wallet.user_id = '${req.userId}';`;
  const [user_info] = await conn.query(query);
  const [wallets] = await conn.query(query2);

  res.status(200).send({ success: true, ...user_info[0], wallets });
};

// 비밀번호 변경
export const patchPassword = async (req, res) => {
  const { password } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const hashedPW = await bcrypt.hash(password, salt);
    const query = `UPDATE user SET password = '${hashedPW}', salt = '${salt}' WHERE id = '${req.userId}';`;
    await conn.query(query);
    return res.send(true);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ success: false });
  }
};

// 정보 변경
export const putMyInfo = async (req, res) => {
  const { name, birthday, phone_number } = req.body;

  const query = `UPDATE user SET name = '${name}', birthday = '${birthday}', phone_number = '${phone_number}'
  WHERE id = ${req.userId};`;
  await conn.query(query);
  res.send(true);
};

// 회원 탈퇴
export const deleteUser = async (req, res) => {
  const query = `DELETE FROM user WHERE id = ${req.userId};`;
  await conn.query(query);
  res.send(true);
};
