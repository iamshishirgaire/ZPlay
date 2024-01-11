import jwt from "jsonwebtoken";
import config from "../configuration.js";
const { sign, verify } = jwt;

export const generateSessionId = (userId) => {
  try {
    return sign(
      {
        _id: userId,
      },
      config.sessionToken
    );
  } catch (error) {
    return null;
  }
};

export const verifySessionId = (token) => {
  try {
    let decoded = verify(token, config.sessionToken);
    return decoded._id;
  } catch (error) {
    return null;
  }
};
