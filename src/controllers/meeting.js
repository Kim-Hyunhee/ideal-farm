import AttendeeService from "../services/attendee.js";
import MeetingService from "../services/meeting.js";

export const getMeetingList = async (req, res) => {
  const { type, attend } = req.query;
  const meetingList = await MeetingService.getMeetingList({
    type,
    userId: req.userId,
    attend,
    isAttend: 1,
  });

  return res.send(meetingList);
};

export const getMeeting = async (req, res) => {
  const { id } = req.params;
  const meeting = await MeetingService.getMeeting({ id });

  if (!meeting) {
    return res.status(400).send(false);
  }

  const attendeeList = await AttendeeService.getAttendeeList({
    meetingId: id,
    isFix: true,
  });
  const totalAttendee = attendeeList.length;

  const userAttend = await AttendeeService.getAttend({
    meetingId: id,
    userId: req.userId,
  });

  const isResponse = !!userAttend;
  const isAttend = userAttend?.isAttend;

  return res.send({ meeting, totalAttendee, isResponse, isAttend });
};
