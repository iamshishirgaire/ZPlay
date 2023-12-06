import jwt from "jsonwebtoken";
import { redisClient } from "./init_redis.js";
const { sign, verify } = jwt;

export const generateRefreshToken = async (userId) => {
  try {
    let signedToken = sign(
      {
        _id: userId,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );

    await redisClient.set(userId.toString(), signedToken.toString(), {
      EX: 24 * 60 * 60,
    });
    return signedToken;
  } catch (error) {
    console.log(`redisError : ${error}`);
    return null;
  }
};

export const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      _id: userId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const verifyRefreshToken = async (token) => {
  try {
    let decoded = verify(token, process.env.REFRESH_TOKEN_SECRET);
    const redisToken = await redisClient.get(decoded._id);
    if (token === redisToken) {
      return decoded._id;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const verifyAccessToken = (token) => {
  try {
    let decoded = verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded._id;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return "TokenExpiredError";
    } else {
      return "Unauthorized";
    }
  }
};
