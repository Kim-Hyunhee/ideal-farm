import conn from "../db/index.js";

// 상품 목록 조회
export const getProducts = async function (req, res, next) {
  const query2 = `SELECT GROUP_CONCAT(invest.amount) 
  FROM invest WHERE invest.typed_wallet = "인증완료" AND product_id = product.id
  GROUP BY product_id`;
  // const [row] = await conn.query(query2);
  // const arr = [];
  // for (let i = 0; i < row.length; i++) {
  //   const sum = row[i]["sum_amount"].split([","]);
  //   arr.push(sum.reduce((a, b) => Number(a) + Number(b), 0));
  // }

  const query = `SELECT product.*, coin.*, product.id as id, product.apy as apy, 
  (${query2}) AS collected_amount
  FROM product JOIN coin ON coin.id = product.coin_id
  LEFT JOIN invest ON product.id = invest.product_id
  WHERE product.is_show = 1 AND product.status < 2
  GROUP BY product.id 
  ORDER BY product.status, product.fund_end_at ;`;

  const [product_list] = await conn.query(query);

  product_list.forEach((e) => {
    e.collected_amount =
      e.collected_amount?.split(",").reduce((a, b) => a + +b, 0) || 0;
  });
  // const newList = product_list.map((e) => {
  //   const sum_amount = e.sum_amount.split(",").reduce((a, b) => a + +b, 0);
  //   return { ...e, sum_amount };
  // });

  res.send(product_list);
};

// 상품 상세보기

export const getProductsDetail = async function (req, res, next) {
  var id = req.params.id;
  const query3 = `SELECT invest.amount FROM invest WHERE invest.product_id = '${id}' AND invest.typed_wallet='인증완료';`;
  const [rows] = await conn.query(query3);
  const arr = [];
  rows.forEach((item) => arr.push(item["amount"]));
  const sum = Number(arr.reduce((a, b) => a + b, 0));
  const query = `SELECT product.*, coin.*, product.id as id, product.apy as apy,
  ${sum} AS collected_amount, address.address
  FROM product LEFT JOIN invest ON product.id = invest.product_id 
  JOIN coin ON product.coin_id = coin.id
  JOIN address ON address.is_need_bank = product.is_need_bank
  WHERE product.id = '${id}'
  GROUP BY product.id;`;
  const [product_detail] = await conn.query(query);
  if (product_detail.length === 0) {
    return res
      .status(400)
      .send({ success: false, message: "없는 상품입니다." });
  }
  const isShow = product_detail[0]["is_show"];
  const fundEnd = product_detail[0]["fund_end_at"];
  const status = product_detail[0]["status"];
  let today = new Date();
  if (isShow === 0 || status === "마감") {
    return res
      .status(400)
      .send({ success: false, message: "마감일이 지났습니다." });
  }
  res.send({ data: product_detail[0] });
};

// 예정, 마감
export const getYetEndProducts = async function (req, res) {
  const query2 = `SELECT GROUP_CONCAT(invest.amount) 
  FROM invest WHERE invest.typed_wallet = "인증완료" AND product_id = product.id
  GROUP BY product_id`;

  const query = `SELECT product.*, coin.*, product.id as id, product.apy as apy, 
  (${query2}) AS collected_amount
  FROM product JOIN coin ON coin.id = product.coin_id
  LEFT JOIN invest ON product.id = invest.product_id
  WHERE product.is_show = 1 AND product.status >= 2
  GROUP BY product.id 
  ORDER BY product.status, product.fund_end_at ;`;

  const [row] = await conn.query(query);

  row.forEach((e) => {
    e.collected_amount =
      e.collected_amount?.split(",").reduce((a, b) => a + +b, 0) || 0;
  });

  res.send(row);
};
