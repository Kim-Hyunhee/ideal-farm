import express from "express";
import { getMeetingList, getMeeting } from "../../controllers/meeting.js";
import { deleteAttendee, postAttendee } from "../../controllers/attendee.js";
import { verifyToken } from "../../helpers/users.js";

const router = express.Router();

router.get("/", verifyToken, getMeetingList);
router.get("/:id", verifyToken, getMeeting);
router.post("/:id/attendance", verifyToken, postAttendee);
router.delete("/:id/attendance", verifyToken, deleteAttendee);

export const clubMeetingRouter = router;
