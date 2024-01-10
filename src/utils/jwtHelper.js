import jwt from "jsonwebtoken";
import { redisClient } from "./init_redis.js";
import config from "../configuration.js";
const { sign, verify } = jwt;

export const generateSessionId = (userId) => {
  try {
    return jwt.sign(
      {
        _id: userId,
      },
      config.accessTokenSecret
    );
  } catch (error) {
    return null;
  }
};

export const verifySessionId = (token) => {
  try {
    let decoded = verify(token, config.accessTokenSecret);
    return decoded._id;
  } catch (error) {
    return null;
  }
};
