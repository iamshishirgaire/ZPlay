import { Router } from "express";
import {
  registerUser,
  loginUser,
  generateNewAccessToken,
  sendOtp,
  logout,
  verifyOtp,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";
import {
  registerSchema,
  logInSchema,
  verifyOtpSchema,
  sendOtpSchema,
} from "../dtos/auth.dto.js";
import { validateSchema } from "../middlewares/schemaValidator.middleware.js";

const router = Router();

router.route("/register").post(
  rateLimiter(5),
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validateSchema(registerSchema),
  registerUser
);

router
  .route("/login")
  .post(
    rateLimiter(5),
    upload.fields([]),
    validateSchema(logInSchema),
    loginUser
  );

router.route("/refreshToken").get(rateLimiter(15), generateNewAccessToken);

router.route("/logout").post(logout);
router
  .route("/verifyOtp")
  .post(validateSchema(verifyOtpSchema), rateLimiter(10), verifyOtp);
router
  .route("/sendOtp")
  .post(validateSchema(sendOtpSchema), rateLimiter(10), sendOtp);

export default router;
