import { Router } from "express";

import { verifyUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getVideos,
  postVideo,
} from "../controllers/Video/videos.controller.js";

const router = Router();

router.route("/postVideo").post(upload.fields([]), postVideo);
router.route("/getAllVideos").get(verifyUser, getVideos);
export default router;
