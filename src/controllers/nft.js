import NFTService from "../services/nft.js";
import UserService from "../services/user.js";

export const getNFTList = async function (req, res) {
  const user = await UserService.getUser({ userId: req.userId });
  const NFTList = await NFTService.getNFTList({
    walletAddress: user.walletAddress,
  });

  return res.send(NFTList);
};
