import ProductService from "../../services/product.js";

export const postProduct = async (req, res) => {
  const {
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
  } = req.body;

  const product = await ProductService.createProduct({
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
  });

  if (!product) {
    return res.status(400).send({ message: "코인 번호를 다시 확인해주세요." });
  }
  return res.send(true);
};

export const patchProductIsShow = async (req, res) => {
  const { id } = req.params;
  const { is_show } = req.body;

  if (isNaN(+id) || typeof is_show !== "number") {
    return res.status(400).send({ message: "숫자만 사용 가능 합니다." });
  }

  const product = await ProductService.patchProductIsShow({
    productId: id,
    is_show,
  });
  if (!product) {
    return res.status(400).send({ message: "상품 번호를 다시 입력해주세요." });
  }

  return res.send(true);
};

export const patchProductStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (isNaN(+id)) {
    return res.status(400).send({ message: "숫자만 사용 가능 합니다." });
  }

  const product = await ProductService.patchProductStatus({
    productId: id,
    status,
  });
  if (!product) {
    return res.status(400).send({ message: "상품 번호를 다시 입력해주세요." });
  }

  return res.send(true);
};
