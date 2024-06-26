import { redisClient } from "./init_redis.js";
import { getReqDetails } from "./reqDetails.js";

export const addSession = async (req, userId, sessionId) => {
  const deviceDetails = getReqDetails(req);
  const session = {
    sessionId,
    deviceDetails,
  };
  const key = `sessions:${userId}`;
  const sessionString = JSON.stringify(session);
  const expirationTime = Date.now() + 30000; // 3 days in milliseconds
  redisClient.zAdd(`${key}:expiration`, {
    score: expirationTime,
    value: sessionString,
  });
  redisClient.lPush(key, sessionString);
};
export const getSessions = async (userId) => {
  const sessions = await redisClient.lRange(`sessions:${userId}`, 0, -1);
  const parsedSession = sessions.map((session) => JSON.parse(session));
  return parsedSession;
};

export const getSingleSession = async (userId, sessionId) => {
  const sessions = await redisClient.lRange(`sessions:${userId}`, 0, -1);
  const parsedSession = sessions.map((session) => JSON.parse(session));
  const sessionIndex = parsedSession.findIndex(
    (session) => session.sessionId === sessionId
  );
  if (sessionIndex !== -1) {
    sessionId;
    return parsedSession[sessionIndex];
  } else {
    return null;
  }
};
export const delSession = async (userId, sessionId) => {
  try {
    const parsedSession = await getSessions(userId);
    const sessionIndex = parsedSession.findIndex(
      (session) => session.sessionId === sessionId
    );
    if (sessionIndex !== -1) {
      await redisClient.lRem(
        `sessions:${userId}`,
        1,
        JSON.stringify(parsedSession[sessionIndex])
      );
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const updateSession = async (req, userId, sessionId, csrfToken) => {
  try {
    const parsedSession = await getSingleSession(userId, sessionId);
    if (parsedSession.sessionId === sessionId) {
      await delSession(userId, sessionId);
      await addSession(req, userId, csrfToken, sessionId);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
