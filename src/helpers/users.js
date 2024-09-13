import jwt from "jsonwebtoken";
import conn from "../db/index.js";

export const JWT_SECRET_KEY = "";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { userId } = jwt.verify(token, JWT_SECRET_KEY);
    req.userId = userId;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).send({ success: false });
  }
};

// 추천인 코드 생성 & 중복 검사

export const generateRandomString = (num) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const verifyAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { isAdmin } = jwt.verify(token, JWT_SECRET_KEY);
    req.isAdmin = isAdmin;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).send({ success: false });
  }
};

export const checkToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error();
    }
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.token = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(419).send({ message: "토큰이 만료되었습니다." });
    } else {
      return res.status(401).send({ message: "토큰이 유효하지 않습니다." });
    }
  }
};

export const checkIsAdmin = async (req, res, next) => {
  const token = req.token;
  if (token.isAdmin) {
    next();
  } else {
    return res.status(403).send({ message: "권한이 없습니다." });
  }
};

// user테이블 walletAddress 비교

export const checkWalletAddress = async (req, res, next) => {
  const { walletAddress } = req.body;
  const userId = req.userId;

  const query = `SELECT * FROM user WHERE id = ${userId}`;
  const [[rows]] = await conn.query(query);

  if (rows.walletAddress !== walletAddress) {
    return res.status(401).send({ message: "지갑 주소가 일치하지 않습니다." });
  } else {
    next();
  }
};
