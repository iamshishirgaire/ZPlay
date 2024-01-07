import { redisClient } from "./init_redis.js";

export const saveRefTokenToRedis = async (id, data) => {
  try {
    await redisClient.set(`session:${id}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getRefTokenFromRedis = async (id) => {
  try {
    const data = await redisClient.get(`session:${id}`);
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

export const deleteRefTokenFromRedis = async (id) => {
  try {
    await redisClient.del(`session:${id}`);
    return true;
  } catch (error) {
    return false;
  }
};
