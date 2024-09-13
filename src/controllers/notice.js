import conn from "../db/index.js";

// 공지사항 전체보기
export const getNotices = async (req, res) => {
  const query = `SELECT * FROM notice;`;
  const [notices] = await conn.query(query);
  res.send(notices);
};

export const getNotice = async (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM notice WHERE id = ${id};`;
  const [notice] = await conn.query(query);
  res.send(...notice);
};

// 공지 사항 올리기
export const postNotice = async function (req, res) {
  const { title, contents } = req.body;

  const query = `INSERT INTO notice (title, contents) VALUES('${title}','${contents}');`;
  await conn.query(query);
  res.send(true);
};
