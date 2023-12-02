import jwt from "jsonwebtoken";
const { verify } = jwt;

export function verifyUser(req, res, next) {
  let token = req.headers?.authorization?.split(" ")[1];
  try {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded) {
      next();
    }
  } catch (error) {
    res.json({ message: "Invalid token" });
  }
}
