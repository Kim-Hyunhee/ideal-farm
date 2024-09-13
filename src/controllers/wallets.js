import conn from "../db/index.js";

// 지갑 조회

export const getWallets = async (req, res) => {
  const query = `SELECT wallet.id, wallet.coin_id, wallet.address, coin.name_kr, coin.unit 
  FROM wallet JOIN coin ON wallet.coin_id = coin.id WHERE user_id = '${req.userId}' ;`;
  const [wallets] = await conn.query(query);
  res.send({ wallets });
};

// 지갑 추가

export const postWallets = async (req, res) => {
  const { coin_id, address } = req.body;

  const query = `INSERT INTO wallet(user_id, coin_id, address) 
  VALUES ('${req.userId}','${coin_id}','${address}');
  `;
  await conn.query(query);
  res.send({ success: true });
};
