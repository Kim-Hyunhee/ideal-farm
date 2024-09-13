import conn from "../db/index.js";
import config from "../datas/testnet.js";
import InvestService from "../services/invest.js";
import NFTRequestService from "../services/nftRequest.js";
// import config from "../datas/mainnet.js";

//추천인 인증하기
export const postRecommend = async (req, res) => {
  const { recommend_code } = req.body;
  const query = `SELECT * FROM user WHERE user.recommend_code = '${recommend_code}';`;
  const query2 = `SELECT * FROM user WHERE user.recommend_code = '${recommend_code}' AND user.id = '${req.userId}';`;
  const [rows] = await conn.query(query);
  const [rows2] = await conn.query(query2);
  if (rows.length === 0) {
    return res
      .status(400)
      .send({ success: false, message: "일치하는 사용자가 없습니다." });
  } else if (rows.length && rows2.length === 0) {
    return res.status(200).send({ success: true });
  } else if (rows2) {
    return res.status(400).send({
      success: false,
      message: "본인 추천인 코드는 사용할 수 없습니다.",
    });
  }
};

// 상품 주문하기
export const postInvests = async (req, res) => {
  const {
    product_id,
    amount,
    wallet_address,
    recommend_code,
    bank,
    account_holder,
    account_number,
  } = req.body;
  const query2 = `SELECT id, min_amount, amount_restrict, fund_end_at, apy, recommend_bonus_apy FROM product WHERE product.id = '${product_id}';`;
  const [rows] = await conn.query(query2);
  const min = rows[0]["min_amount"];
  const restrict = rows[0]["amount_restrict"];
  // let startdate_KST = new Date(new Date(rows[0]["fund_end_at"]).getTime());
  // let today = new Date();
  const query = `SELECT is_need_bank FROM product WHERE product.id = '${product_id}';`;
  const [rows2] = await conn.query(query);

  // if (startdate_KST < today) {
  //   return res
  //     .status(400)
  //     .send({ success: false, message: "마감일이 지났습니다." });
  // }

  if (amount < min) {
    return res
      .status(400)
      .send({ success: false, message: "최소 수량 이상으로 신청해주세요." });
  }

  if (parseInt(amount % restrict) !== 0) {
    return res.status(400).send({
      success: false,
      message: restrict + "원 단위로 입력해주세요.",
    });
  }

  if (rows2[0]["is_need_bank"]) {
    if (
      !req.body["bank"] ||
      !req.body["account_holder"] ||
      !req.body["account_number"]
    ) {
      return res
        .status(400)
        .send({ success: false, message: "계좌 정보가 없습니다." });
    }
    const apy = recommend_code
      ? rows[0]["apy"] + rows[0]["recommend_bonus_apy"]
      : rows[0]["apy"];
    const query = `INSERT INTO invest(user_id, product_id, amount, bank, account_number, account_holder, recommend_code, apy) 
    VALUES ('${req.userId}','${product_id}','${amount}','${bank}','${account_number}',
    '${account_holder}','${recommend_code}', '${apy}');
    `;
    await conn.query(query);
    return res.send({
      success: true,
      owner_account: "우리 100212312345678 (아이디얼팜)",
    });
  }

  if (!req.body["wallet_address"]) {
    return res
      .status(400)
      .send({ success: false, message: "지갑 주소가 없습니다." });
  }
  const apy = recommend_code
    ? rows[0]["apy"] + rows[0]["recommend_bonus_apy"]
    : rows[0]["apy"];

  const query3 = `INSERT INTO invest(user_id, product_id, amount, wallet_address, recommend_code, apy) 
    VALUES ('${req.userId}','${product_id}','${amount}','${wallet_address}','${recommend_code}', '${apy}' );
    `;
  await conn.query(query3);
  return res.send({
    success: true,
    owner_account: "3FDxAxoPSFwoS7Ns84KJCTPWYPPWPfjgLM",
  });
};

// 투자 상품 조회 (홈화면)
export const getInvests = async function (req, res, next) {
  const query3 = `SELECT GROUP_CONCAT(invest.amount) 
  FROM invest WHERE invest.typed_wallet = "인증완료" AND invest.product_id = product.id
  GROUP BY product_id`;

  const query = `SELECT user.name, coin.name_kr, coin.name_en, coin.unit, coin.hex_color,
  (${query3}) AS coin_amount
  FROM product LEFT JOIN invest ON product.id = invest.product_id
  JOIN user ON user.id = invest.user_id
  JOIN coin ON product.coin_id = coin.id
  WHERE user_id = '${req.userId}' AND invest.typed_wallet = "인증완료"
  GROUP BY coin.id;`;

  const [graph] = await conn.query(query);
  graph.forEach((e) => {
    e.coin_amount = e.coin_amount?.split(",").reduce((a, b) => a + +b, 0) || 0;
  });
  const query2 = `SELECT invest.id, coin.name_kr, coin.name_en, invest.typed_wallet, product.code, product.duration_month, 
  product.deposit_end_at,  product.deposit_start_at, product.name, invest.amount, coin.active_logo, invest.created_at,
  invest.mintingDate, invest.isNFTPossible, product.status
  FROM product LEFT JOIN invest ON product.id = invest.product_id
  JOIN user ON user.id = invest.user_id
  JOIN coin ON product.coin_id = coin.id
  WHERE user_id = '${req.userId}';`;
  const [invest_list] = await conn.query(query2);

  res.send({ graph, invest_list });
};

//투자 상품 상세조회 (나무)

export const getInvestDetail = async function (req, res, next) {
  var id = req.params.id;
  const query2 = `SELECT product.duration_month, invest.apy, invest.amount, invest.recommend_code
  FROM product JOIN invest ON product.id = invest.product_id WHERE invest.id = '${id}';`;
  const [rows] = await conn.query(query2);
  if (rows.length === 0) {
    return res.status(400).send({ success: false });
  }
  const apy = rows[0]["apy"];
  // const bonus = rows[0]["recommend_bonus_apy"];
  const month = rows[0]["duration_month"];
  const amount = rows[0]["amount"];
  const monthRate = (apy / 12) * month;
  // const bonusRate = (bonus / 12) * month;
  const recommend = rows[0]["recommend_code"];
  // const rate = recommend ? monthRate + bonusRate : monthRate;
  const minrate = amount * 0.01 * monthRate + amount;
  // : amount * 0.01 * monthRate + amount;
  const query = `SELECT invest.id, coin.name_kr, coin.name_en, coin.unit, coin.active_logo,  product.is_need_bank,
  product.name, product.code, product.duration_month, product.deposit_end_at, product.deposit_start_at, product.status,
  invest.wallet_address, invest.recommend_code, invest.typed_wallet, invest.verify_deposit, invest.amount, invest.verify_certificate,
  invest.bank, invest.account_number, invest.account_holder, invest.created_at, ${monthRate} AS rate, ${minrate} AS all_amount,
  invest.verify_certificate, address.address, invest.mintingDate as mintingDate, invest.isNFTPossible
  FROM product JOIN coin ON product.coin_id = coin.id
  JOIN invest ON invest.product_id = product.id
  JOIN address ON address.is_need_bank = product.is_need_bank
  WHERE invest.user_id = '${req.userId}' AND invest.id = '${id}';`;

  const [invest_detail] = await conn.query(query);
  const contractAddress = config.CONTRACT;
  if (invest_detail.length == 0) {
    return res
      .status(403)
      .send({ success: false, message: "본인 투자 상품만 볼 수 있습니다." });
  }
  res.send({ invest_detail, contractAddress });
};

// 입금 증명하기
export const postDeposit = async function (req, res, next) {
  const { id, verify_deposit } = req.body;

  const query = `UPDATE invest SET verify_deposit = '${verify_deposit}', typed_wallet = "확인중"
    WHERE invest.id = '${id}' AND invest.user_id = '${req.userId}';`;

  await conn.query(query);
  return res.send({ success: true });
};

// 입금 증명하기 이미지 첨부
export const postDepositImage = async function (req, res, next) {
  const { id } = req.body;
  const url = req.file.location;
  const query = `UPDATE invest SET verify_certificate= '${url}', typed_wallet = "확인중"
    WHERE invest.id = '${id}' AND invest.user_id = '${req.userId}';`;
  await conn.query(query);
  return res.send({ success: true, url });
};

// 입금 영수증
export const getReceipt = async function (req, res, next) {
  const { id } = req.params;
  const query2 = `SELECT product.duration_month, invest.apy, invest.amount, invest.recommend_code
  FROM product JOIN invest ON product.id = invest.product_id WHERE invest.id = '${id}';`;
  const [rows] = await conn.query(query2);
  const apy = rows[0]["apy"];
  // const bonus = rows[0]["recommend_bonus_apy"];
  const month = rows[0]["duration_month"];
  const amount = rows[0]["amount"];
  const monthRate = (apy / 12) * month;
  // const bonusRate = (bonus / 12) * month;
  // const recommend = rows[0]["recommend_code"];
  const minrate = amount * 0.01 * monthRate + amount;
  // : amount * 0.01 * monthRate + amount;
  const query = `SELECT deposit_day, ${minrate} AS deposit_amount, wallet_address, verify_deposit, 
  bank, account_number, account_holder, verify_certificate, product.is_need_bank, coin.unit
  FROM invest JOIN product ON invest.product_id = product.id
  JOIN coin ON product.coin_id = coin.id
  WHERE invest.id = '${id}';`;
  const [receipt] = await conn.query(query);

  res.status(200).send(receipt[0]);
};

// 투자 상품 삭제
export const deleteInvest = async function (req, res, next) {
  const { id } = req.body;
  const query = `SELECT * FROM invest WHERE invest.id = '${id}' AND invest.user_id = '${req.userId}';`;
  const [rows] = await conn.query(query);
  if (rows.length === 0) {
    return res
      .status(400)
      .send({ success: false, message: "본인의 투자 상품만 취소 가능합니다." });
  } else {
    const query = `DELETE FROM invest WHERE invest.id = '${id}' AND invest.user_id = '${req.userId}';`;
    await conn.query(query);
    res
      .status(200)
      .send({ success: true, message: "투자한 상품이 삭제 되었습니다." });
  }
};

// export const postInvestNFTApply = async (req, res) => {
//   const { id } = req.params;

//   const invest = await InvestService.getInvest({
//     id,
//     userId: req.userId,
//     isNFTPossible: true,
//   });
//   if (!invest) {
//     return res.status(400).send({ messge: "NFT를 신청할 수 없습니다." });
//   }

//   await NFTRequestService.createNFTRequest({
//     userId: req.userId,
//     invest,
//   });

//   return res.send(true);
// };
