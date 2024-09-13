import InvitationService from "../services/invitation.js";

export const getInvitations = async function (req, res) {
  const invitations = await InvitationService.getInvitations();

  res.send(invitations);
};
