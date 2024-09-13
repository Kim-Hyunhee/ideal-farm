import conn from "../db/index.js";

const AttendeeService = {
  createAttendee: async ({ id, userId, isAttend }) => {
    const query = `INSERT INTO attendee(meetingId,userId,isAttend) VALUES ('${id}','${userId}','${isAttend}')`;
    await conn.query(query);

    return true;
  },

  deleteAttendee: async ({ id, userId }) => {
    const query = `DELETE FROM attendee WHERE meetingId = '${id}' AND userId = '${userId}';`;
    await conn.query(query);
  },

  getAttendeeList: async ({ meetingId, isFix }) => {
    let query = `SELECT * FROM attendee  WHERE meetingId = '${meetingId}'`;
    if (isFix) {
      query += ` AND isAttend = '1' AND adminConfirm = '1'`;
    }
    const [attendee] = await conn.query(query);

    return attendee;
  },

  patchAttendConfirm: async ({ id }) => {
    const query = `UPDATE attendee SET attendee.adminConfirm = "1" WHERE attendee.id = ${id};`;
    await conn.query(query);

    return true;
  },

  getAttend: async ({ meetingId, userId }) => {
    const query = `SELECT * FROM attendee WHERE meetingId = '${meetingId}' AND userId = ${userId};`;
    const [[rows]] = await conn.query(query);

    return rows;
  },
};
export default AttendeeService;
