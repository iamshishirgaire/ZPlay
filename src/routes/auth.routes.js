import { Router } from "express";
import {
  registerUser,
  loginUser,
  logout,
  verifyOtp,
  sendOtp,
  getNewCsrfToken,
} from "../controllers/User/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { limiter } from "../middlewares/rateLimiter.middleware.js";
import {
  registerSchema,
  logInSchema,
  verifyOtpSchema,
  sendOtpSchema,
} from "../dtos/Auth/auth.dto.js";
import { validateSchema } from "../middlewares/schemaValidator.middleware.js";
import { verifySession } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(
  limiter(5),
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validateSchema(registerSchema),
  registerUser
);

router
  .route("/login")
  .post(limiter(5), upload.fields([]), validateSchema(logInSchema), loginUser);

router.route("/logout").post(verifySession, logout);
router
  .route("/verifyOtp")
  .post(validateSchema(verifyOtpSchema), limiter(10), verifyOtp);
router
  .route("/sendOtp")
  .post(validateSchema(sendOtpSchema), limiter(10), sendOtp);

router.route("/getCsrfToken").get(limiter(20), getNewCsrfToken);
export default router;
