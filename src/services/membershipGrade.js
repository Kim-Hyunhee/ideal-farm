import conn from "../db/index.js";

const MembershipGradeService = {
  getMaxAmountMembershipGrade: async ({ membershipId, cost }) => {
    const query = `SELECT *, membership.id AS membershipId, membershipGrade.id AS membershipGradeId 
    FROM membershipGrade 
    JOIN membership ON membership.id = membershipGrade.membershipId
    WHERE membershipId = ${membershipId} 
    AND cost <= ${cost} 
    ORDER BY cost DESC LIMIT 1;`;

    const [[membershipGrade]] = await conn.query(query);

    return membershipGrade;
  },

  getMembershipGradeImage: async ({ membershipGradeId }) => {
    const query = `SELECT * FROM membershipGrade 
    WHERE id = ${membershipGradeId};`;
    const [[membershipGrade]] = await conn.query(query);

    return membershipGrade.image;
  },

  getMembershipGrades: async () => {
    const query = `SELECT membership.title, membership.term, membership.sameYear, membershipGrade.grade, 
    membership.id AS membershipId, membershipGrade.id AS membershipGradeId
    FROM membershipGrade 
    JOIN membership ON membership.id = membershipGrade.membershipId`;

    const [membershipList] = await conn.query(query);

    return membershipList;
  },
};
export default MembershipGradeService;
