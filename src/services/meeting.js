import conn from "../db/index.js";
import moment from "moment";

const MeetingService = {
  createMeeting: async ({
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
  }) => {
    const query = `INSERT INTO meeting(title, additionalInfo, image, location, detailLocation, selfPayment, inquiry, latitude,
    longitude, description,  startDate, endDate) 
    VALUES('${title}','${additionalInfo}','${image}','${location}','${detailLocation}','${selfPayment}','${inquiry}',
    '${latitude}', '${longitude}', '${description}','${startDate}','${endDate}')`;

    const [rows] = await conn.query(query);

    return rows;
  },

  getMeetingList: async ({ type, userId, isAttend, attend }) => {
    const month = new Date().getUTCMonth() + 1;
    const now = moment().format("YYYY-MM-DD");

    let query = `SELECT *, meeting.id as meetingId FROM meeting LEFT JOIN attendee ON meeting.id = attendee.meetingId`;
    if (type === "upcoming") {
      query += ` WHERE MONTH(meeting.startDate) = ${month}`;
    } else if (type === "past") {
      query += ` WHERE meeting.startDate < '${now}'`;
    } else if (type === "yet") {
      query += ` WHERE meeting.startDate >= '${now}'`;
    }
    if (attend === "1") {
      query += ` AND attendee.isAttend = '${isAttend}' AND attendee.userId = '${userId}'`;
    }
    query += ` GROUP BY meeting.title ORDER BY meeting.startDate ASC`;

    const [meetingList] = await conn.query(query);

    return meetingList;
  },

  getMeeting: async ({ id }) => {
    const query = `SELECT * FROM meeting WHERE id = ${id}`;
    const [[meeting]] = await conn.query(query);

    return meeting;
  },
};
export default MeetingService;
