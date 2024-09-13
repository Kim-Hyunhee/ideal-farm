import AttendeeService from "../services/attendee.js";

export const postAttendee = async (req, res) => {
  const { id } = req.params;
  const { isAttend } = req.body;

  await AttendeeService.deleteAttendee({ id, userId: req.userId });
  await AttendeeService.createAttendee({
    id,
    userId: req.userId,
    isAttend,
  });

  return res.send(true);
};

export const deleteAttendee = async (req, res) => {
  const { id } = req.params;

  await AttendeeService.deleteAttendee({ id, userId: req.userId });

  return res.send(true);
};
