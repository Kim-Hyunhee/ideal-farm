import MembershipGradeService from "../../services/membershipGrade.js";

export const getMembershipGrades = async (req, res) => {
  const membership = await MembershipGradeService.getMembershipGrades();

  return res.send(membership);
};
