import express from "express";
import { getWallets, postWallets } from "../controllers/wallets.js";
import { verifyToken } from "../helpers/users.js";
var router = express.Router();

router.get("/", verifyToken, getWallets);
router.post("/", verifyToken, postWallets);
export default router;
