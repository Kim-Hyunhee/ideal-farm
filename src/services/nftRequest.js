import conn from "../db/index.js";
import MembershipGradeService from "./membershipGrade.js";

const NFTRequestService = {
  createNFTRequest: async ({ userId, membershipGradeId, invest }) => {
    if (invest) {
      const membershipGrades =
        await MembershipGradeService.getMaxAmountMembershipGrade({
          membershipId: invest.membershipId,
          cost: invest.amount,
        });
      const query = `INSERT INTO nftRequest(investId, userId, membershipGradeId)
      VALUES('${invest.id}', '${userId}', '${membershipGrades.membershipGradeId}');`;
      const [rows] = await conn.query(query);
      return rows.insertId;
    }

    const query = `INSERT INTO nftRequest(userId, membershipGradeId) 
      VALUES('${userId}','${membershipGradeId}');`;

    const [rows] = await conn.query(query);
    return rows.insertId;
  },

  // getNFTRequest: async ({ nftRequestId }) => {
  //   const query = `SELECT * FROM nftRequest
  //   JOIN invest ON nftRequest.investId = invest.id
  //   JOIN user ON invest.user_id = user.id
  //   WHERE nftRequest.id = '${nftRequestId}'`;
  //   const [[nftRequest]] = await conn.query(query);

  //   return nftRequest;
  // },

  patchNFTRequest: async ({ membershipGradeId, nftRequestId }) => {
    const query = `UPDATE nftRequest SET membershipGradeId = ${membershipGradeId} WHERE id = ${nftRequestId}`;
    await conn.query(query);

    return true;
  },

  // getNFTRequestIsDone: async ({ userId, investId }) => {
  //   const query = `SELECT * FROM nftRequest WHERE userId = ${userId} AND investId IN(${investId})`;
  //   const [rows] = await conn.query(query);

  //   return rows;
  // },

  // getNFTRequestByInvestIds: async ({ investIds }) => {
  //   const ids = investIds.map((id) => "'" + id + "'").join();
  //   const query = `SELECT *, nftRequest.id AS nftRequestId, invest.id AS investID
  //   FROM nftRequest JOIN invest ON nftRequest.investId = invest.id
  //   JOIN user ON invest.user_id = user.id
  //   WHERE nftRequest.investId IN (${ids})`;
  //   const [[nftRequest]] = await conn.query(query);

  //   return nftRequest;
  // },

  patchNFTRequestIsDone: async ({ nftRequestId }) => {
    const query = `UPDATE nftRequest SET isDone = '1' WHERE id = ${nftRequestId}`;
    await conn.query(query);

    return true;
  },
};
export default NFTRequestService;
