import { verifyAccessToken } from "../utils/jwtHelper.js";
import { ApiError } from "../utils/apiError.js";
export function verifyUser(req, res, next) {
  try {
    let token =
      req.headers?.authorization?.split(" ")[1] ?? req.cookies?.accessToken;
    if (!token) {
      res.status(401).json(new ApiError(401, "Unauthorized"));
      return;
    }
    let userId = verifyAccessToken(token);
    if (userId === "TokenExpiredError") {
      res.status(403).json(new ApiError(403, "Token expired"));
      return;
    } else if (userId === "Unauthorized") {
      res.status(401).json(new ApiError(401, "Unauthorized"));
      return;
    } else {
      next();
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json(new ApiError(403, "Token expired"));
      return;
    } else {
      res.status(401).json(new ApiError(401, "Unauthorized"));
      return;
    }
  }
}
