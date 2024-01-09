const getConfig = () => {
  const env = process.env.NODE_ENV || "development";
  console.log(`Environment: ${env}`);

  return {
    port: process.env.PORT || 3000,
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
    accessTokenSecret:
      env === "production"
        ? process.env.PROD_ACCESS_TOKEN_SECRET
        : process.env.DEV_ACCESS_TOKEN_SECRET,
    accessTokenExpiry:
      env === "production"
        ? process.env.PROD_ACCESS_TOKEN_EXPIRY
        : process.env.DEV_ACCESS_TOKEN_EXPIRY,
    refreshTokenSecret:
      env === "production"
        ? process.env.PROD_REFRESH_TOKEN_SECRET
        : process.env.DEV_REFRESH_TOKEN_SECRET,
    refreshTokenExpiry:
      env === "production"
        ? process.env.PROD_REFRESH_TOKEN_EXPIRY
        : process.env.DEV_REFRESH_TOKEN_EXPIRY,
    redisHostUrl:
      env === "production"
        ? process.env.PROD_REDIS_HOST_URL
        : process.env.DEV_REDIS_HOST_URL,
    google: {
      clientId:
        env === "production"
          ? process.env.PROD_GOOGLE_CLIENT_ID
          : process.env.DEV_GOOGLE_CLIENT_ID,
      clientSecret:
        env === "production"
          ? process.env.PROD_GOOGLE_CLIENT_SECRET
          : process.env.DEV_GOOGLE_CLIENT_SECRET,
      redirectUri:
        env === "production"
          ? process.env.PROD_GOOGLE_REDIRECT_URI
          : process.env.DEV_GOOGLE_REDIRECT_URI,
      senderEmail:
        env === "production"
          ? process.env.PROD_GOOGLE_SENDER_EMAIL
          : process.env.DEV_GOOGLE_SENDER_EMAIL,
      refreshToken:
        env === "production"
          ? process.env.PROD_GOOGLE_REFRESH_TOKEN
          : process.env.DEV_GOOGLE_REFRESH_TOKEN,
      accessToken:
        env === "production"
          ? process.env.PROD_GOOGLE_ACCESS_TOKEN
          : process.env.DEV_GOOGLE_ACCESS_TOKEN,
      appPassword:
        env === "production"
          ? process.env.PROD_APP_PASSWORD
          : process.env.DEV_APP_PASSWORD,
    },
  };
};

export default getConfig();
