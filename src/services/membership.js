import conn from "../db/index.js";

const MembershipService = {
  createMembership: async ({
    title,
    content,
    sameYear,
    term,
    startDate,
    endDate,
  }) => {
    const query = `INSERT INTO membership(title,content,sameYear,term,startDate,endDate) 
    VALUES ('${title}','${content}','${sameYear}','${term}','${startDate}','${endDate}');`;
    const [rows] = await conn.query(query);

    return rows;
  },

  getMembership: async () => {
    const query = `SELECT * FROM membership ORDER BY startDate DESC LIMIT 1`;
    const [[membership]] = await conn.query(query);
    const query2 = `SELECT * FROM membershipGrade 
    WHERE membershipGrade.membershipId = ${membership.id}
    AND isShow = 1`;
    const [membershipGrades] = await conn.query(query2);

    return { membership, membershipGrades };
  },

  getMembershipInvest: async ({ userId }) => {
    const query = `SELECT *, membership.id AS membershipId FROM membership JOIN invest ON membership.id = invest.membershipId WHERE invest.user_id = ${userId}`;
    const [[rows]] = await conn.query(query);

    return rows;
  },
};
export default MembershipService;
