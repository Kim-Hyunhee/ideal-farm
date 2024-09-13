import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";

const accessKeyId = "";
const secretAccessKey = "";

const s3 = new AWS.S3({ accessKeyId, secretAccessKey });
const bucket = "";

const config = {
  s3,
  bucket,
  acl: "public-read",
  metaData: (req, file, cb) => {
    cb(null, { fieldName: file, fieldname });
  },
  key: (req, file, cb) => {
    cb(
      null,
      `images/verify_certificate/${Date.now().toString()}${file.originalname}`
    );
  },
};

export const upload = multer({ storage: multerS3(config) });

const createConfig = (destination) => {
  return multerS3({
    s3,
    bucket,
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      const fileName = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );
      cb(null, `${destination}/${Date.now().toString()}${fileName}`);
    },
  });
};

export const uploadMeeting = multer({
  storage: createConfig("meeting"),
});
export const uploadCommunity = multer({
  storage: createConfig("community"),
});
export const uploadNFTImage = multer({ storage: createConfig("nftImage") });
