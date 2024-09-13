import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";
import UserService from "../services/user.js";
import NFTService from "../services/nft.js";
import { isAddress } from "ethers";

import conn from "../db/index.js";
import { JWT_SECRET_KEY as secretKey } from "../helpers/users.js";

// 로그인
export const postAdminToken = async (req, res) => {
  const { email, password } = req.body;

  const query = `
          SELECT * FROM admin WHERE email='${email}';
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

  const payload = { isAdmin: user.admin };
  const option = { expiresIn: "1d" };
  const token = jwt.sign(payload, secretKey, option);
  res.send({ token });
};

// 투자 목록 조회
export const getUsersInvest = async function (req, res, next) {
  if (req.isAdmin) {
    const query2 = `SELECT GROUP_CONCAT(invest.amount) 
    FROM invest WHERE invest.typed_wallet = "인증완료" AND product_id = product.id
    GROUP BY product_id`;

    const query = `SELECT product.id,coin.name_en, product.name, product.code, product.deposit_start_at, product.deposit_end_at,
    product.apy, product.recommend_bonus_apy, product.fund_start_at, product.fund_end_at,
    product.max_amount,product.is_show,product.is_need_bank, product.status,
    (${query2}) AS collected_amount
    FROM product JOIN coin ON coin.id = product.coin_id
    LEFT JOIN invest ON product.id = invest.product_id
    GROUP BY product.id 
    ORDER BY product.fund_end_at ;`;

    const [invest] = await conn.query(query);

    invest.forEach((e) => {
      e.collected_amount =
        e.collected_amount?.split(",").reduce((a, b) => a + +b, 0) || 0;
    });

    res.send(invest);
  } else return res.status(401).send({ message: "권한이 없습니다" });
};

// 투자 목록 상세조회
export const getUsersInvestDetail = async function (req, res, next) {
  const id = req.params.id;
  if (req.isAdmin) {
    const query2 = `SELECT GROUP_CONCAT(invest.amount) 
    FROM invest WHERE invest.typed_wallet = "인증완료" AND invest.product_id = ${id}
    GROUP BY product_id`;

    const query = `SELECT product.id,coin.name_en, product.name, product.code, product.deposit_start_at, product.deposit_end_at,
    product.apy, product.recommend_bonus_apy, product.fund_start_at, product.fund_end_at,
    product.max_amount,min_amount, amount_restrict, product.is_show,product.is_need_bank, 
    (${query2}) AS collected_amount, product.explanation, product.status
    FROM product JOIN coin ON coin.id = product.coin_id
    LEFT JOIN invest ON product.id = invest.product_id
    WHERE product.id = ${id}
    GROUP BY product.id 
    ORDER BY product.fund_end_at ;`;

    const [invest] = await conn.query(query);

    invest.forEach((e) => {
      e.collected_amount =
        e.collected_amount?.split(",").reduce((a, b) => a + +b, 0) || 0;
    });

    const query3 = `SELECT user.name, invest.amount, invest.wallet_address, invest.bank, invest.apy,
    invest.account_number, invest.account_holder, invest.verify_deposit, invest.verify_certificate, invest.typed_wallet
    FROM user JOIN invest ON user.id = invest.user_id WHERE invest.product_id= ${id};`;
    const [investor] = await conn.query(query3);

    res.send({ ...invest[0], investor });
  } else return res.status(401).send({ message: "권한이 없습니다" });
};

// 사용자 정보
export const getUsersInfo = async function (req, res, next) {
  const { page } = req.query;
  const count = 20;

  if (+page <= 0) {
    return res.status(400).send({ message: "자연수로 입력해주세요." });
  }

  let offsetCount = count * (page - 1);
  if (!page) {
    offsetCount = 0;
  }

  if (req.isAdmin) {
    const query = `SELECT user.id, user.email,user.name,user.phone_number, DATE_FORMAT(user.birthday,"%Y-%m-%d")  birthday
        ,user.recommend_code,user.created_at, user.walletAddress FROM user ORDER BY created_at DESC LIMIT ${count} OFFSET ${offsetCount};`;
    const [users] = await conn.query(query);

    const query2 = `SELECT COUNT(user.id)as amount_users FROM user;`;
    const [[amount_users]] = await conn.query(query2);

    return res.send({ users, ...amount_users });
  } else return res.status(401).send({ message: "권한이 없습니다" });
};

// 사용자 상세 정보
export const getUserInfo = async function (req, res, next) {
  const { id } = req.params;
  if (isNaN(+id)) {
    return res.status(400).send({ message: "숫자만 사용 가능 합니다." });
  }

  if (req.isAdmin) {
    const query = `SELECT user.id, user.email,user.name,user.phone_number,user.birthday
  ,user.recommend_code,user.created_at, user.walletAddress FROM user WHERE user.id = ${id};`;
    const [[user]] = await conn.query(query);
    const query2 = `SELECT product.name, invest.amount, invest.recommend_code,
  invest.wallet_address, invest.bank, invest.account_number, invest.account_holder ,
  product.apy, product.recommend_bonus_apy
  FROM invest JOIN product ON invest.product_id = product.id WHERE invest.user_id = ${id};`;
    const [invest] = await conn.query(query2);

    const nft = await NFTService.getNFTList({
      walletAddress: user.walletAddress,
    });

    res.send({ ...user, invest, nft });
  } else return res.status(401).send({ message: "권한이 없습니다" });
};

// 인증변경 (인증완료, 입금완료)
export const getUsersInvestApplication = async function (req, res) {
  if (req.isAdmin) {
    const query = `SELECT coin.name_en,invest.id, product.name as product_name, user.name, invest.amount, invest.bank, invest.account_number, 
    invest.wallet_address, invest.account_holder, invest.verify_deposit, invest.verify_certificate,
    invest.typed_wallet
    FROM product JOIN invest ON product.id = invest.product_id
    JOIN user ON invest.user_id = user.id
    JOIN coin ON coin.id = product.coin_id 
    ORDER BY invest.created_at DESC;`;

    const [rows] = await conn.query(query);
    res.send(rows);
  } else return res.status(401).send({ message: "권한이 없습니다" });
};

export const patchInvestConfirm = async function (req, res, next) {
  const { invest_id, typed_wallet } = req.body;
  if (req.isAdmin) {
    const query = `UPDATE invest SET invest.typed_wallet = "${typed_wallet}" WHERE invest.id = ${invest_id};`;
    await conn.query(query);
    res.send(true);
  } else return res.status(401).send({ message: "권한이 없습니다" });
};

// 코인 등록
export const postCoin = async function (req, res, next) {
  if (req.isAdmin) {
    const {
      name_kr,
      name_en,
      unit,
      active_logo,
      inactive_logo,
      apy,
      hex_color,
    } = req.body;
    const query = `INSERT INTO coin(name_kr, name_en, unit, active_logo, inactive_logo, apy, hex_color) 
    VALUES ('${name_kr}','${name_en}','${unit}','${active_logo}','${inactive_logo}','${apy}','${hex_color}');`;

    await conn.query(query);
    res.send(true);
  } else return res.status(401).send({ message: "권한이 없습니다" });
};

// 총 회원 수 (대시보드 들어가는 애들 하나로 합치기)
export const getUsers = async function (req, res, next) {
  if (req.isAdmin) {
    const query = `SELECT COUNT(user.id)as amount_users FROM user;`;

    const [users] = await conn.query(query);
    res.send(...users);
  } else return res.status(401).send({ message: "권한이 없습니다" });
};

// 최근 2주일간 가입한 회원 수
export const getUsersWeek = async function (req, res, next) {
  if (req.isAdmin) {
    const query = `SELECT COUNT(user.id)as two_week_users FROM user 
    WHERE user.created_at > date_add(now(),interval -14 day);
    `;

    const [two_week_users] = await conn.query(query);
    res.send(...two_week_users);
  } else return res.status(401).send({ message: "권한이 없습니다" });
};

// KRW 누적 투자금액 (관리자 승인까지 난것)
export const getAmountKRW = async function (req, res, next) {
  if (req.isAdmin) {
    const query2 = `SELECT invest.amount FROM invest JOIN product 
  ON invest.product_id = product.id WHERE product.coin_id = 1 AND invest.typed_wallet='인증완료';`;
    const [rows] = await conn.query(query2);
    const arr = [];
    rows.forEach((item) => arr.push(item["amount"]));
    let amount_KRW = Number(arr.reduce((a, b) => a + b, 0));

    if (amount_KRW === 0) {
      return res.send({ amount_KRW });
    }
    const query = `SELECT ${amount_KRW} as amount_KRW FROM invest JOIN product ON invest.product_id = product.id
    WHERE product.coin_id = 1 AND invest.typed_wallet = '인증완료' GROUP BY product.coin_id;`;

    [amount_KRW] = await conn.query(query);
    res.send(...amount_KRW);
  } else return res.status(401).send({ message: "권한이 없습니다" });
};

// BTC 누적 투자 갯수 (관리자 승인까지 난것)
export const getAmountBTC = async function (req, res, next) {
  if (req.isAdmin) {
    const query2 = `SELECT invest.amount FROM invest JOIN product 
  ON invest.product_id = product.id WHERE product.coin_id = 2 AND invest.typed_wallet='인증완료';`;
    const [rows] = await conn.query(query2);
    const arr = [];
    rows.forEach((item) => arr.push(item["amount"]));
    let amount_BTC = Number(arr.reduce((a, b) => a + b, 0));

    if (amount_BTC === 0) {
      return res.send({ amount_BTC });
    }
    const query = `SELECT ${amount_BTC} as amount_BTC FROM invest JOIN product ON invest.product_id = product.id
     WHERE product.coin_id = 2 AND invest.typed_wallet = '인증완료' GROUP BY product.coin_id;`;

    [amount_BTC] = await conn.query(query);
    res.send(...amount_BTC);
  } else return res.status(401).send({ message: "권한이 없습니다" });
};

// KRW 월별 모금액
export const getMonthKRW = async function (req, res, next) {
  if (req.isAdmin) {
    const query2 = `SELECT GROUP_CONCAT(invest.amount) AS amount, DATE_FORMAT(invest.created_at,'%Y-%m') month
  FROM invest JOIN product ON invest.product_id = product.id WHERE product.coin_id = 1 AND invest.typed_wallet >=2 GROUP BY month;`;
    const [rows] = await conn.query(query2);
    rows.forEach((e) => {
      e.amount = e.amount?.split(",").reduce((a, b) => a + +b, 0) || 0;
    });

    // res.send(rows);
    const dateRange = [];
    let arrayIndex = 0;
    const modiData = [];
    // 이번 달부터 역순으로 12개월 만들기
    for (let i = 12; i >= 0; i--) {
      dateRange.push(moment().subtract(i, "month").format("YYYY-MM"));
    }

    for (let i = 0; i < dateRange.length; i++) {
      const tempM = moment(dateRange[0]).add(i, "month").format("YYYY-MM");

      if (rows[arrayIndex] != null && rows[arrayIndex]["month"] == tempM) {
        modiData.push(rows[arrayIndex]["amount"]);
        arrayIndex += 1;
      } else {
        modiData.push(0);
      }
    }
    const newArr = [];
    for (let i = 0; i < modiData.length; i++) {
      newArr.push({ month: dateRange[i], amount: modiData[i] });
    }
    res.send(newArr);
  } else return res.status(401).send({ message: "권한이 없습니다" });
};

// BTC 월별 모금액
export const getMonthBTC = async function (req, res, next) {
  if (req.isAdmin) {
    const query2 = `SELECT GROUP_CONCAT(invest.amount) AS amount, DATE_FORMAT(invest.created_at,'%Y-%m') month
  FROM invest JOIN product ON invest.product_id = product.id WHERE product.coin_id = 2 AND invest.typed_wallet >=2 GROUP BY month;`;
    const [rows] = await conn.query(query2);
    rows.forEach((e) => {
      e.amount = e.amount?.split(",").reduce((a, b) => a + +b, 0) || 0;
    });

    // res.send(rows);
    const dateRange = [];
    let arrayIndex = 0;
    const modiData = [];
    // 이번 달부터 역순으로 12개월 만들기
    for (let i = 12; i >= 0; i--) {
      dateRange.push(moment().subtract(i, "month").format("YYYY-MM"));
    }

    for (let i = 0; i < dateRange.length; i++) {
      const tempM = moment(dateRange[0]).add(i, "month").format("YYYY-MM");

      if (rows[arrayIndex] != null && rows[arrayIndex]["month"] == tempM) {
        modiData.push(rows[arrayIndex]["amount"]);
        arrayIndex += 1;
      } else {
        modiData.push(0);
      }
    }
    const newArr = [];
    for (let i = 0; i < modiData.length; i++) {
      newArr.push({ month: dateRange[i], amount: modiData[i] });
    }
    res.send(newArr);
  } else return res.status(401).send({ message: "권한이 없습니다" });
};

export const patchUserWalletAddress = async (req, res) => {
  const { walletAddress, userId } = req.body;

  if (isAddress(walletAddress) === false) {
    return res.status(400).send({ message: "지갑 주소가 잘못 되었습니다." });
  }

  const user = await UserService.getUser({ userId });
  if (!user) {
    return res.status(400).send({ message: "없는 회원입니다." });
  }

  await UserService.updateWalletAddress({ walletAddress, userId });

  return res.send(true);
};
