import AttendeeService from "../../services/attendee.js";

export const patchAttendConfirm = async (req, res) => {
  const { id } = req.params;

  await AttendeeService.patchAttendConfirm({ id });
  return res.send(true);
};
