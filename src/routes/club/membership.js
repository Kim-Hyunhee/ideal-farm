import express from "express";
import { getMembership } from "../../controllers/membership.js";
import { verifyToken } from "../../helpers/users.js";

const router = express.Router();

router.get("/", verifyToken, getMembership);

export const clubMembershipRouter = router;
