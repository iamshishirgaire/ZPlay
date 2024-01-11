import dotenv from "dotenv";
dotenv.config();

const getConfig = () => {
  const env = process.env.NODE_ENV || "development";
  console.log(`Environment: ${env}`);

  return {
    port: process.env.PORT || 3000,
    env,
    db: {
      uri:
        env === "production"
          ? process.env.PROD_MONGODB_URI
          : process.env.DEV_MONGODB_URI,
    },
    corsOrigin:
      env === "production"
        ? process.env.PROD_CORS_ORIGIN
        : process.env.DEV_CORS_ORIGIN,
    cloudinary: {
      cloudName:
        env === "production"
          ? process.env.PROD_CLOUDINARY_CLOUD_NAME
          : process.env.DEV_CLOUDINARY_CLOUD_NAME,
      apiKey:
        env === "production"
          ? process.env.PROD_CLOUDINARY_API_KEY
          : process.env.DEV_CLOUDINARY_API_KEY,
      apiSecret:
        env === "production"
          ? process.env.PROD_CLOUDINARY_API_SECRET
          : process.env.DEV_CLOUDINARY_API_SECRET,
    },
    sessionToken:
      env === "production"
        ? process.env.PROD_SESSION_TOKEN_SECRET
        : process.env.DEV_SESSION_TOKEN_SECRET,

    sessionTokenExpiry:
      env === "production"
        ? process.env.PROD_SESSION_TOKEN_EXPIRY
        : process.env.DEV_SESSION_TOKEN_EXPIRY,
    redisHostUrl:
      env === "production"
        ? process.env.PROD_REDIS_HOST_URL
        : process.env.DEV_REDIS_HOST_URL,
    google: {
      senderEmail: process.env.GOOGLE_SENDER_EMAIL,
      appPassword: process.env.GOOGLE_APP_PASSWORD,
    },
  };
};

export default getConfig();
