import { Router } from "express";
import {
  registerUser,
  loginUser,
  generateNewRefreshToken,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { limiter } from "../middlewares/rateLimiter.middleware.js";

import {
  registerSchema,
  logInSchema,
  refreshTokenSchema,
} from "../dtos/auth.dto.js";
import { validateSchema } from "../middlewares/schemaValidator.middleware.js";

const router = Router();

router.route("/register").post(
  limiter,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validateSchema(registerSchema),
  registerUser
);

router
  .route("/login")
  .post(limiter, upload.fields([]), validateSchema(logInSchema), loginUser);

router
  .route("/refreshToken")
  .get(limiter, validateSchema(refreshTokenSchema), generateNewRefreshToken);
export default router;
