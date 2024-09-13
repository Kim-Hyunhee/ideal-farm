import conn from "../db/index.js";
import moment from "moment";

const InvestService = {
  getInvest: async ({ id, userId, isNFTPossible }) => {
    let invest = `SELECT * FROM invest WHERE id = ${id}`;
    if (userId) {
      invest += ` AND user_id = ${userId}`;
    }
    if (isNFTPossible) {
      invest += ` AND isNFTPossible = '1'`;
    }

    const [[rows]] = await conn.query(invest);

    return rows;
  },

  patchInvestIsPossible: async ({ id }) => {
    const isPossible = `UPDATE invest SET invest.isNFTPossible = '1' WHERE invest.id = ${id}`;
    await conn.query(isPossible);

    return true;
  },

  // patchInvestMintingDate: async ({ investId }) => {
  //   const query = `UPDATE invest SET invest.mintingDate = DATE_FORMAT(now(), '%Y-%m-%d %H:%i:%s') WHERE invest.id = ${investId};`;
  //   await conn.query(query);

  //   return true;
  // },

  // patchInvestmintingDateIsNull: async ({ investId }) => {
  //   const query = `UPDATE invest SET invest.mintingDate = NULL WHERE invest.id = ${investId};`;
  //   await conn.query(query);

  //   return true;
  // },

  getInvestsByMembership: async ({ userId }) => {
    const now = moment().format("YYYY-MM-DD");
    const query = `SELECT *, DATE_FORMAT(membership.startDate,'%Y-%m-%d') AS startDate, DATE_FORMAT(membership.endDate,'%Y-%m-%d') AS endDate,
    membership.id AS membershipId, invest.id AS investId
    FROM invest JOIN membership ON membership.id = invest.membershipId WHERE invest.user_id = '${userId}'
    AND startDate <= '${now}' AND '${now}' <= endDate
    ORDER BY invest.amount DESC;`;
    const [rows] = await conn.query(query);

    return rows;
  },
};
export default InvestService;
