import CommunityService from "../services/community.js";

export const postCommunity = async (req, res) => {
  const { content, images } = req.body;

  await CommunityService.createCommunity({
    content,
    images: JSON.stringify(images),
    userId: req.userId,
  });

  return res.send(true);
};
