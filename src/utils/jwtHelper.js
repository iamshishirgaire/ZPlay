import jwt from "jsonwebtoken";
const { sign } = jwt;

export const generateRefreshToken = (userId) => {
  return sign(
    {
      _id: userId,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
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

export const verifyRefreshToken = (token) => {
  try {
    let decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return decoded._id;
  } catch (error) {
    return null;
  }
};

export const verifyAccessToken = (token) => {
  try {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded._id;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return "TokenExpiredError";
    } else {
      return "Unauthorized";
    }
  }
};
