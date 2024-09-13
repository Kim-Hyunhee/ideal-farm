import conn from "../db/index.js";

const ProductService = {
  createProduct: async ({
    coin_id,
    name,
    duration_month,
    deposit_start_at,
    deposit_end_at,
    max_amount,
    min_amount,
    amount_restrict,
    code,
    apy,
    is_show,
    is_need_bank,
    fund_start_at,
    fund_end_at,
    recommend_bonus_apy,
    status,
    explanation,
    is_notification,
  }) => {
    const query2 = `SELECT * FROM coin WHERE id = ${coin_id}`;
    const [[coin]] = await conn.query(query2);
    if (!coin) {
      return false;
    }
    const query = `INSERT INTO product(coin_id, name, duration_month, deposit_start_at,
        deposit_end_at, max_amount, min_amount, amount_restrict, code, apy, is_show, is_need_bank,
        fund_start_at, fund_end_at, recommend_bonus_apy, status, explanation, is_notification)
        VALUES ('${coin_id}','${name}','${duration_month}','${deposit_start_at}','${deposit_end_at}','${max_amount}','${min_amount}'
    ,'${amount_restrict}','${code}','${apy}','${is_show}','${is_need_bank}','${fund_start_at}'
    ,'${fund_end_at}','${recommend_bonus_apy}','${status}','${explanation}','${is_notification}')`;

    await conn.query(query);

    return true;
  },

  patchProductIsShow: async ({ productId, is_show }) => {
    const query2 = `SELECT * FROM product WHERE id = ${productId}`;
    const [[product]] = await conn.query(query2);
    if (!product) {
      return false;
    }

    const query = `UPDATE product SET product.is_show = '${is_show}' WHERE product.id = '${productId}'`;
    await conn.query(query);

    return true;
  },

  patchProductStatus: async ({ productId, status }) => {
    const query2 = `SELECT * FROM product WHERE id = ${productId}`;
    const [[product]] = await conn.query(query2);
    if (!product) {
      return false;
    }
    const query = `UPDATE product SET product.status = '${status}' WHERE product.id = '${productId}'`;
    await conn.query(query);

    return true;
  },
};
export default ProductService;
