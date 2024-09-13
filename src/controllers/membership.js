import MembershipService from "../services/membership.js";
import InvestService from "../services/invest.js";
import NFTRequestService from "../services/nftRequest.js";
import MembershipGradeService from "../services/membershipGrade.js";
import NFTService from "../services/nft.js";

export const getMembership = async (req, res) => {
  const membership = await MembershipService.getMembership();

  return res.send(membership);
};

// export const getUserMembership = async (req, res) => {
//   const userId = req.userId;
//   // invest -> membership: 오늘 날짜에 해당하는 membership인지 확인 후 결과 내려주기(배열)
//   const invests = await InvestService.getInvestsByMembership({
//     userId,
//   });
//   if (!invests.length) {
//     // membership의 startDate, endDate 사이에 오늘 날짜가 해당하지 않는 경우
//     return res.send({ message: "발급 불가" });
//   }
//   let amount = 0;
//   for (let i = 0; i < invests.length; i++) {
//     if (amount < invests[i].amount) amount = invests[i].amount;
//   }

//   // 오늘 날짜 해당인 membership의 investId로 nftRequest 확인
//   const investIds = invests.map((item) => {
//     return item.investId;
//   });
//   const nftRequest = await NFTRequestService.getNFTRequestByInvestIds({
//     investIds,
//   });
//   if (!nftRequest) {
//     // 오늘 날짜에 해당할 시 membershipGrade.image 가져오기: 신청 전/후 최고 금액 기준 이미지 내려주기
//     const membershipGradeImage =
//       await MembershipGradeService.getMaxAmountMembershipGrade({
//         membershipId: invests[0].membershipId,
//         cost: amount,
//       }).image;
//     return res.send({
//       message: "발급 가능한 상태",
//       membershipGradeImage,
//     });
//   }
//   if (nftRequest.isDone) {
//     //발급 완료 됐을 경우
//     const nft = await NFTService.getNFT({
//       tokenId: nftRequest.nftRequestId,
//     });
//     return res.send({ message: "NFT발급완료", nft });
//   } else {
//     //발급 신청만 했을 경우
//     const membershipGradeImage =
//       await MembershipGradeService.getMembershipGradeImage({
//         membershipGradeId: nftRequest.membershipGradeId,
//       });
//     return res.send({ message: "발급 신청 완료", membershipGradeImage });
//   }
// };
