import { createTransport } from "nodemailer";
import { google } from "googleapis";
import { redisClient } from "./init_redis.js";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const GOOGLE_SENDER_EMAIL = process.env.GOOGLE_SENDER_EMAIL;

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: GMAIL_REFRESH_TOKEN,
});
const sendEmail = async ({ email }) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: GOOGLE_SENDER_EMAIL,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
        accessToken,
      },
      tls: {
        rejectUnauthorized: false,
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
