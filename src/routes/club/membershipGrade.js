import express from "express";
import { getNFTList } from "../../controllers/nft.js";
import { verifyToken } from "../../helpers/users.js";

const router = express.Router();

router.get("/", verifyToken, getNFTList);

export const clubNFTRouter = router;
