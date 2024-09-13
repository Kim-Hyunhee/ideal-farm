import express from "express";
import {
  postUsers,
  postUsersToken,
  getUsersMyInfo,
  patchPassword,
  deleteUser,
  putMyInfo,
  patchUserWalletAddress,
} from "../controllers/users.js";
import { verifyToken } from "../helpers/users.js";
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signUp", postUsers);
router.post("/logIn", postUsersToken);
router.get("/info", verifyToken, getUsersMyInfo);
router.patch("/password", verifyToken, patchPassword);
router.delete("/", verifyToken, deleteUser);
router.put("/my-info", verifyToken, putMyInfo);
router.patch("/walletAddress", verifyToken, patchUserWalletAddress);
export default router;
