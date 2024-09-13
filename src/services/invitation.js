import moment from "moment";
import conn from "../db/index.js";

const InvitationService = {
  getInvitations: async () => {
    const today = moment().utc().format("YYYY-MM-DD hh:mm:ss");
    const query = `SELECT * FROM invitation JOIN meeting ON meeting.id = invitation.meetingId WHERE DATE_ADD(invitation.createdAt, INTERVAL 1 DAY) > '${today}'`;
    const [meetings] = await conn.query(query);
    const query2 = `SELECT * FROM invitation JOIN membership ON membership.id = invitation.membershipId ORDER BY membership.startDate DESC LIMIT 1`;
    const [[membership]] = await conn.query(query2);

    return { meetings, membership };
  },

  createInvitation: async ({ meetingId, membershipId }) => {
    if (meetingId) {
      const query = `INSERT INTO invitation(meetingId) VALUES(${meetingId})`;
      await conn.query(query);
    } else if (membershipId) {
      const query2 = `INSERT INTO invitation(membershipId) VALUES(${membershipId})`;
      await conn.query(query2);
    }

    return true;
  },
};
export default InvitationService;
