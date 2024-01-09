import { verifySessionId } from "../utils/jwtHelper.js";
import { ApiError } from "../utils/apiError.js";
import { getSingleSession } from "../utils/sessionManager.js";

export const verifySession = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies ?? req.body;

    if (!sessionId) {
      res.status(401).json(new ApiError(401, "Unauthorized"));
      return;
    }
    const userId = await verifySessionId(sessionId);
    if (userId === null) {
      res.status(401).json(new ApiError(401, "Unauthorized"));
      return;
    }
    const session = await getSingleSession(userId, sessionId);
    if (!session) {
      res.status(401).json(new ApiError(401, "Unauthorized"));
      return;
    }
    req.userId = userId;
    req.sessionId = sessionId;
    next();
  } catch (error) {
    res.status(401).json(new ApiError(401, "Unauthorized"));
    return;
  }
};
