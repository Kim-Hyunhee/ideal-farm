import express from "express";
import { getInvitations } from "../../controllers/invitation.js";
import { verifyToken } from "../../helpers/users.js";

const router = express.Router();

router.get("/", verifyToken, getInvitations);

export const clubInvitationRouter = router;
