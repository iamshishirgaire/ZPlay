import { Router } from "express";
import { verifySession } from "../middlewares/auth.middleware.js";
import {
  amIloggedIn,
  getAllActiveSessions,
} from "../controllers/User/user.controller.js";

const router = Router();

router.route("/getsessions").get(verifySession, getAllActiveSessions);
router.route("/amIloggedIn").get(amIloggedIn);
export default router;
