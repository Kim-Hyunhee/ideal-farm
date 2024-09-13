import express from "express";
import { getNotices, getNotice, postNotice } from "../controllers/notice.js";
import { checkToken, checkIsAdmin } from "../helpers/users.js";

var router = express.Router();

router.get("/", getNotices);
router.get("/:id", getNotice);

router.post("/", checkToken, checkIsAdmin, postNotice);
export default router;
