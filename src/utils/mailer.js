import { createTransport } from "nodemailer";
import { redisClient } from "./init_redis.js";
import config from "../configuration.js";

const GOOGLE_SENDER_EMAIL = config.google.senderEmail;
const GOOGLE_APP_PASSWORD = config.google.appPassword;

const sendEmail = async ({ email }) => {
  try {
    const transport = createTransport({
      service: "gmail",
      auth: {
        user: GOOGLE_SENDER_EMAIL,
        pass: GOOGLE_APP_PASSWORD,
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
