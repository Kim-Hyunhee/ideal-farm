import conn from "../db/index.js";

const UserService = {
  updateWalletAddress: async ({ walletAddress, userId }) => {
    const query = `UPDATE user SET user.walletAddress = '${walletAddress}' WHERE user.id = '${userId}'`;
    await conn.query(query);

    return true;
  },

  getUser: async ({ userId }) => {
    const query = `SELECT * FROM user WHERE user.id = ${userId}`;
    const [[user]] = await conn.query(query);

    return user;
  },

};
export default UserService;
