import conn from "../db/index.js";

// 코인 목록 조회
export const getCoins = async function (req, res, next) {
  const query = `SELECT * FROM coin;`;

  const [coin_list] = await conn.query(query);

  res.send(coin_list);
};
