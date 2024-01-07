import { verifyAccessToken, verifyCSRFToken } from "../utils/jwtHelper.js";
import { ApiError } from "../utils/apiError.js";
import { getSessions, getSingleSession } from "../utils/sessionManager.js";

export const verifySession = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies ?? req.body;
    const { csrfToken } = req.body;
    if (!sessionId || !csrfToken) {
      res.status(401).json(new ApiError(401, "Unauthorized"));
      return;
    }
    const userId = await verifyCSRFToken(csrfToken);
    if (userId === null) {
      res.status(401).json(new ApiError(401, "Unauthorized"));
      return;
    }
    const session = await getSingleSession(userId, sessionId);
    if (!session) {
      res.status(401).json(new ApiError(401, "Unauthorized"));
      return;
    } else if (session.csrfToken !== csrfToken) {
      res.status(401).json(new ApiError(401, "Unauthorized"));
      return;
    }
    console.log(`session: ${JSON.stringify(session)}`);

    req.userId = userId;
    req.sessionId = sessionId;
    req.csrfToken = csrfToken;
    next();
  } catch (error) {
    res.status(401).json(new ApiError(401, "Unauthorized"));
    return;
  }
};
