import { sign } from "jsonwebtoken";
export function getJtoken(payload) {
  sign(payload, process.env.ACCESS_TOKEN_SECRET);
}
