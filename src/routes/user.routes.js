import { Router } from "express";
import { verifySession } from "../middlewares/auth.middleware.js";
import { getAllActiveSessions } from "../controllers/User/user.controller.js";

const router = Router();

// router.route("/refreshToken").get(limiter, generateNewRefreshToken);

router.route("/getsessions").get(verifySession, getAllActiveSessions);
export default router;
