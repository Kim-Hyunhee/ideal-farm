import InvitationService from "../../services/invitation.js";
import MeetingService from "../../services/meeting.js";

export const postMeeting = async (req, res) => {
  const {
    title,
    additionalInfo,
    image,
    location,
    detailLocation,
    selfPayment,
    inquiry,
    startDate,
    endDate,
    latitude,
    longitude,
    description,
  } = req.body;

  const meeting = await MeetingService.createMeeting({
    title,
    additionalInfo,
    image,
    location,
    detailLocation,
    selfPayment,
    inquiry,
    startDate,
    endDate,
    latitude,
    longitude,
    description,
  });

  await InvitationService.createInvitation({ meetingId: meeting.insertId });

  return res.send(true);
};
