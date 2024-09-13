import conn from "../db/index.js";

const CommunityService = {
  createCommunity: async ({ userId, content, images }) => {
    const query = `INSERT INTO community(userId, content, images)
    VALUES(${userId},'${content}','${images}')`;
    await conn.query(query);

    return true;
  },
};
export default CommunityService;
