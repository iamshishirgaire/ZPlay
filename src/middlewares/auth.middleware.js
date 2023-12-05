import { verifyAccessToken } from "../utils/jwtHelper.js";
export function verifyUser(req, res, next) {
  try {
    let token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    }

    let userId = verifyAccessToken(token);
    if (userId === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
    } else if (userId === "Unauthorized") {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      next();
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  }
}
