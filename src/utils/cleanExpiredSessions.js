import { redisClient } from "./init_redis.js";

export const cleanupExpiredSessions = async (userId) => {
  const listKey = `sessions:${userId}`;
  const sortedSetKey = `${listKey}:expiration`;
  const currentTime = Date.now();

  // Get and remove expired sessions from the Sorted Set
  const expiredSessions = await redisClient.zRangeByScore(
    sortedSetKey,
    "-inf",
    currentTime
  );
  await redisClient.zRemRangeByScore(sortedSetKey, "-inf", currentTime);

  // Remove the expired sessions from the list
  if (expiredSessions.length > 0) {
    await redisClient.lRem(listKey, 0, ...expiredSessions);
  }
};
