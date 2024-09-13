import express from "express";
import { postCommunity } from "../../controllers/community.js";
import { verifyToken } from "../../helpers/users.js";

const router = express.Router();

router.post("/", verifyToken, postCommunity);

export const clubCommunityRouter = router;
