// import AWS from "aws-sdk";
// import moment from "moment";
// import PDFDocument from "pdfkit";
// import { pdfToPng } from "pdf-to-png-converter";
// import conn from "../db/index.js";
// import path from "path";

// const accessKeyId = "";
// const secretAccessKey = """;
// const s3 = new AWS.S3({ accessKeyId, secretAccessKey });
// const bucket = "idealfarm-assets";

// const PDFService = {
//   createPDF: async (doc, id) => {
//     //pdf 파일 만들기
//     const query = `SELECT * FROM invest JOIN user ON invest.user_id = user.id WHERE invest.id = ${id};`;
//     const [rows] = await conn.query(query);

//     const query3 = `SELECT *, DATE_FORMAT(DATE_ADD(invest.created_at,INTERVAL 9 HOUR),
//     '%Y.%m.%d (%H:%i)') as date FROM invest JOIN product ON invest.product_id = product.id
//     WHERE invest.id = ${id};`;
//     const [rows3] = await conn.query(query3);

//     const now = moment();

//     doc.page.margins = { top: 50, bottom: 50, left: 57, right: 57 };

//     let yPos = doc.page.margins.top;

//     doc.lineGap(3);

//     doc.fontSize(35);
//     doc.text("PROMISSORY NOTE", doc.page.margins.top, yPos, {
//       align: "center",
//     });

//     yPos = doc.page.margins.top + 80;

//     doc.fontSize(13);
//     doc.text("SELLER", doc.page.margins.left, yPos, { align: "left" });

//     doc.text(rows[0].name, doc.page.margins.left + 170, yPos, {
//       align: "left",
//     });

//     yPos = yPos + 28;

//     doc.fontSize(13);
//     doc.text("PRODUCT NAME", doc.page.margins.left, yPos, { align: "left" });

//     doc.text(rows3[0].name, doc.page.margins.left + 170, yPos, {
//       align: "left",
//     });

//     yPos = yPos + 28;

//     doc.fontSize(13);
//     doc.text("OWNERSHIP DATE", doc.page.margins.left, yPos, { align: "left" });
//     doc.text(rows3[0].date, doc.page.margins.left + 170, yPos, {
//       align: "left",
//     });

//     yPos = yPos + 28;

//     doc.fontSize(13);
//     doc.text("BUYER", doc.page.margins.left, yPos, { align: "left" });

//     yPos = yPos + 28;

//     doc.fontSize(13);
//     doc.text("AMOUNT", doc.page.margins.left, yPos, { align: "left" });

//     doc.text(rows3[0].amount + "원", doc.page.margins.left + 170, yPos, {
//       align: "left",
//     });

//     yPos = yPos + 28;

//     doc.fontSize(13);
//     doc.text("SALES DATE", doc.page.margins.left, yPos, { align: "left" });

//     doc.text(now.format("YYYY-MM-DD"), doc.page.margins.left + 170, yPos, {
//       align: "left",
//     });

//     doc.end();

//     return doc;
//   },

//   createPNGAnduploadFile: async (id) => {
//     //pdf -> png / 둘 다 s3에 업로드
//     const query = `SELECT * FROM invest WHERE id = ${id};`;
//     const [rows] = await conn.query(query);

//     const __dirname = path.resolve();

//     const [pdfFile, pdfBuffer] = await new Promise((resolve) => {
//       const buffers = [];
//       let doc = new PDFDocument({
//         size: "A4",
//         font: __dirname + "/fonts/NanumMyeongjo-Regular.ttf",
//       });
//       doc.on("data", buffers.push.bind(buffers));
//       doc.on("end", () => {
//         let pdfData = Buffer.concat(buffers);
//         resolve([doc, pdfData]);
//       });

//       PDFService.createPDF(doc, id);
//     });

//     const params = {
//       Bucket: bucket,
//       Key: `${rows[0].id}.pdf`,
//       ACL: "public-read-write",
//       Body: pdfBuffer,
//     };

//     await new Promise((resolve, reject) => {
//       s3.upload(params, (err, data) =>
//         err === null ? resolve(data) : reject(err)
//       );
//     });

//     const [pngPages] = await pdfToPng(pdfBuffer);

//     const params2 = {
//       Bucket: bucket,
//       Key: `${rows[0].id}.png`,
//       ACL: "public-read-write",
//       Body: pngPages.content,
//     };

//     const result1 = await new Promise((resolve, reject) => {
//       s3.upload(params, (err, data) =>
//         err === null ? resolve(data) : reject(err)
//       );
//     });

//     const result2 = await new Promise((resolve, reject) => {
//       s3.upload(params2, (err, data) =>
//         err === null ? resolve(data) : reject(err)
//       );
//     });
//     const pngLocation = result2.Location;
//     const pdfLocation = result1.Location;

//     return { pngLocation, pdfLocation };
//   },
// };
// export default PDFService;
