import { Router } from "express";
import { getVideos, postVideo } from "../controllers/videos.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/postVideo").post(upload.fields([]), postVideo);
router.route("/getAllVideos").get(verifyUser, getVideos);
export default router;
