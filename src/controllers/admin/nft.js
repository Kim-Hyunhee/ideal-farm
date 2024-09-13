import InvestService from "../../services/invest.js";
import MembershipGradeService from "../../services/membershipGrade.js";
import NFTService from "../../services/nft.js";
import NFTRequestService from "../../services/nftRequest.js";
import UserService from "../../services/user.js";

export const patchInvestNFTPossible = async (req, res) => {
  const { id } = req.params;

  const invest = await InvestService.getInvest({ id });
  if (!invest) {
    return res.status(400).send({ message: "투자 상품을 다시 확인해주세요." });
  }

  await InvestService.patchInvestIsPossible({ id });

  return res.send(true);
};

export const postInvestNFT = async (req, res) => {
  const { membershipGradeId, userId, investId } = req.body;

  let membershipGrade = "";
  let walletAddress = "";
  let nftRequestId = "";
  if (investId) {
    const invest = await InvestService.getInvest({ id: investId });
    nftRequestId = await NFTRequestService.createNFTRequest({
      invest,
      userId: invest.user_id,
    });
    const user = await UserService.getUser({ userId: invest.user_id });
    membershipGrade = await MembershipGradeService.getMaxAmountMembershipGrade({
      membershipId: invest.membershipId,
      cost: invest.amount,
    });
    walletAddress = user.walletAddress;
  } else {
    const user = await UserService.getUser({ userId });
    membershipGrade = await NFTService.getMembershipGrade({
      membershipGradeId,
    });
    walletAddress = user.walletAddress;
    nftRequestId = await NFTRequestService.createNFTRequest({
      userId,
      membershipGradeId,
    });
  }
  const uri = await NFTService.uploadMetadata({}, membershipGrade);
  const mint = await NFTService.mintNFT({
    uri,
    nftRequestId,
    walletAddress,
  });

  // if (investId) {
  //   //토큰ID로 토큰uri 찾기(있으면 json 주소 O)
  //   const confirmMint = await NFTService.checkMinted({
  //     id: investId,
  //   });
  //   if (confirmMint) {
  //     return res.status(400).send({ message: "이미 발행 신청한 nft입니다" });
  //   }

  //   await InvestService.patchInvestMintingDate({
  //     investId,
  //   });
  //   await NFTRequestService.patchNFTRequest({
  //     membershipGradeId,
  //     nftRequestId,
  //   });
  // }

  if (mint) {
    await NFTRequestService.patchNFTRequestIsDone({ nftRequestId });
    return res.send(true);
  } else {
    return res.status(400).send(false);
  }
};
