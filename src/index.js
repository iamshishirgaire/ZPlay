import { connectMongoDb } from "./db/index.js";
import { redisClient } from "./utils/init_redis.js";
import { app } from "./app.js";
import https from "https";
import { readFileSync } from "fs";
import path from "path";
import config from "./config.js";
import { cleanupExpiredSessions } from "./utils/cleanExpiredSessions.js";
import { config } from "dotenv";
const __dirname = path.resolve();
connectMongoDb().then(() => {
  redisClient.connect().then(() => {
    https
      .createServer(
        {
          key: readFileSync(`${__dirname}/cert/key.pem`),
          cert: readFileSync(`${__dirname}/cert/cert.pem`),
        },
        app
      )
      .listen(config.port, () => {
        cleanupExpiredSessions("6595643fda475cdcad819beb");
        console.log(`Server listening on port ${process.env.PORT}`);
      });
  });
});
