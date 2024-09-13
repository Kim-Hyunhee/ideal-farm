import InvitationService from "../../services/invitation.js";
import MembershipService from "../../services/membership.js";

export const postMembership = async (req, res) => {
  const { title, content, sameYear, term, startDate, endDate } = req.body;

  const membership = await MembershipService.createMembership({
    title,
    content,
    sameYear,
    term,
    startDate,
    endDate,
  });
  await InvitationService.createInvitation({
    membershipId: membership.insertId,
  });

  return res.send(true);
};
