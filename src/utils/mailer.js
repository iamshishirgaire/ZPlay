import { createTransport } from "nodemailer";
import { redisClient } from "./init_redis.js";
import config from "../configuration.js";

const GOOGLE_SENDER_EMAIL = config.google.senderEmail;
const GOOGLE_CLIENT_ID = config.google.clientId;
const GOOGLE_CLIENT_SECRET = config.google.clientSecret;
const GOOGLE_REFRESH_TOKEN = config.google.refreshToken;
const GOOGLE_ACCESS_TOKEN = config.google.accessToken;

const sendEmail = async ({ email }) => {
  try {
    const transport = createTransport({
      host: "smtp.gmail.com",
      auth: {
        type: "OAuth2",
        user: GOOGLE_SENDER_EMAIL,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken: GOOGLE_ACCESS_TOKEN,
        expires: 3600,
      },
    });
    //generate random 6 digits otp
    const otp = Math.floor(100000 + Math.random() * 900000);
    //mail options
    const mailOptions = {
      from: GOOGLE_SENDER_EMAIL,
      to: email,
      subject: "Otp Verification",
      text: "Please verify the otp from the login page.",
      html:
        "<html><body><p>Please verify the otp from the login page.</p><h1>" +
        otp +
        "</h1></body></html>",
    };
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        redisClient.set(`otp:${email}`, otp.toString(), {
          EX: 24 * 60 * 60,
        });
      }
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { sendEmail };
