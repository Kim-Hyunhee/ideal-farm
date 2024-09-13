import express from "express";
import {
  postAdminToken,
  getUsersInvest,
  postCoin,
  getUsersInfo,
  getUserInfo,
  getUsers,
  getUsersWeek,
  getAmountKRW,
  getAmountBTC,
  getMonthKRW,
  getMonthBTC,
  getUsersInvestDetail,
  getUsersInvestApplication,
  patchInvestConfirm,
  patchUserWalletAddress,
} from "../controllers/admin.js";
import { postMeeting } from "../controllers/admin/meeting.js";
import { patchAttendConfirm } from "../controllers/admin/attendee.js";
import {
  patchInvestNFTPossible,
  postInvestNFT,
} from "../controllers/admin/nft.js";
import {
  postMeetingImageUpload,
  postMembershipGradeImage,
} from "../controllers/admin/upload.js";
import { postMembership } from "../controllers/admin/membership.js";
import { getMembershipGrades } from "../controllers/admin/membershipGrade.js";
import { uploadMeeting, uploadNFTImage } from "../db/aws.js";

import {
  postProduct,
  patchProductIsShow,
  patchProductStatus,
} from "../controllers/admin/product.js";

import { verifyAdminToken } from "../helpers/users.js";
var router = express.Router();

router.post("/logIn", postAdminToken);
router.get("/users/invest", verifyAdminToken, getUsersInvest);
router.get("/users/invest/:id", verifyAdminToken, getUsersInvestDetail);

router.patch("/users/invests", verifyAdminToken, patchInvestConfirm);
router.post("/registration", verifyAdminToken, postCoin);
router.get(
  "/users/invests/application",
  verifyAdminToken,
  getUsersInvestApplication
);

router.get("/users/info", verifyAdminToken, getUsersInfo);
router.get("/users/:id/info", verifyAdminToken, getUserInfo);
router.patch("/users/walletAddress", verifyAdminToken, patchUserWalletAddress);

router.get("/users", verifyAdminToken, getUsers);
router.get("/users/week", verifyAdminToken, getUsersWeek);
router.get("/amount/KRW", verifyAdminToken, getAmountKRW);
router.get("/amount/BTC", verifyAdminToken, getAmountBTC);
router.get("/amount/monthKRW", verifyAdminToken, getMonthKRW);
router.get("/amount/monthBTC", verifyAdminToken, getMonthBTC);

router.post("/meeting", verifyAdminToken, postMeeting);

router.patch(
  "/invests/:id/isNFTPossible",
  verifyAdminToken,
  patchInvestNFTPossible
);
router.post("/nft", verifyAdminToken, postInvestNFT);

router.post(
  "/upload/meeting",
  verifyAdminToken,
  uploadMeeting.single("file"),
  postMeetingImageUpload
);
router.post(
  "/upload/membershipGrade",
  verifyAdminToken,
  uploadNFTImage.single("file"),
  postMembershipGradeImage
);

router.patch("/attendee/:id", verifyAdminToken, patchAttendConfirm);

router.post("/membership", verifyAdminToken, postMembership);
router.get("/membershipGrades", verifyAdminToken, getMembershipGrades);

router.post("/products", verifyAdminToken, postProduct);
router.patch("/products/:id/is_show", verifyAdminToken, patchProductIsShow);
router.patch("/products/:id/status", verifyAdminToken, patchProductStatus);

export default router;
