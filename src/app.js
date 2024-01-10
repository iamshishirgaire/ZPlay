import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: configuration.corsOrigin,
    credentials: true,
  })
);
app.set("trust proxy", true);

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
import configuration from "./configuration.js";
//routes declaration
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/videos", videoRoute);
export { app };
