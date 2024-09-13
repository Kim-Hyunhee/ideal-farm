import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import { swaggerUi, specs } from "./swagger/index.js";
import usersRouter from "./routes/users.js";
import productsRouter from "./routes/products.js";
import coinsRouter from "./routes/coins.js";
import investsRouter from "./routes/invests.js";
import walletsRouter from "./routes/wallets.js";
import adminRouter from "./routes/admin.js";
import noticeRouter from "./routes/notice.js";
// import { clubInvestRouter } from "./routes/club/invest.js";
import { clubMeetingRouter } from "./routes/club/meeting.js";
import { clubNFTRouter } from "./routes/club/membershipGrade.js";
import { clubMembershipRouter } from "./routes/club/membership.js";
import { clubInvitationRouter } from "./routes/club/invitation.js";
import { clubCommunityRouter } from "./routes/club/community.js";
// import { clubUserRouter } from "./routes/club/user.js";

var app = express();

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

// view engine setup
const __dirname = path.resolve();
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello~~~~~~~~");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/coins", coinsRouter);
app.use("/invests", investsRouter);
app.use("/wallets", walletsRouter);
app.use("/admin", adminRouter);
app.use("/notices", noticeRouter);
// app.use("/club/invests", clubInvestRouter);
app.use("/club/meeting", clubMeetingRouter);
app.use("/club/nft", clubNFTRouter);
app.use("/club/membership", clubMembershipRouter);
app.use("/club/invitations", clubInvitationRouter);
app.use("/club/communities", clubCommunityRouter);
// app.use("/club/user", clubUserRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
