import express, { json } from "express";
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

//route import
import userRoute from "./routes/user.routes.js";

//route declaration

app.use("/api/v1/user", userRoute);

export { app };
