import { Router } from "express";
import { getVideos } from "../controllers/videos.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/getAllVideos").get(verifyUser, getVideos);
export default router;
