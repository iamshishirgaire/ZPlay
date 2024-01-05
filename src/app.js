import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(
  express.urlencoded({
    limit: "16kb",
    extended: true,
  })
);
app.use(express.static("public"));
app.use(cookieParser());
app.on("error", (error) => {
  console.log(error);
});

app.get("/api/v1/checkStatus", (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, "Server is up and running"));
});
//routes import
import userRoute from "./routes/user.routes.js";
import videoRoute from "./routes/video.routes.js";
import authRoute from "./routes/auth.routes.js";
import { ApiResponse } from "./utils/apiResponse.js";
//routes declaration
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/videos", videoRoute);
export { app };
