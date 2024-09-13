import express from "express";
import {
  postInvests,
  getInvests,
  getInvestDetail,
  postDeposit,
  postDepositImage,
  postRecommend,
  getReceipt,
  deleteInvest,
} from "../controllers/invests.js";
import { verifyToken } from "../helpers/users.js";
import { upload } from "../db/aws.js";
var router = express.Router();

router.post("/recommendCode", verifyToken, postRecommend);
router.post("/", verifyToken, postInvests);
router.get("/", verifyToken, getInvests);
router.get("/:id", verifyToken, getInvestDetail);
router.post("/deposit", verifyToken, postDeposit);
router.post(
  "/deposit/image",
  verifyToken,
  upload.single("file"),
  postDepositImage
);
router.get("/:id/receipt", getReceipt);
router.delete("/", verifyToken, deleteInvest);

export default router;
