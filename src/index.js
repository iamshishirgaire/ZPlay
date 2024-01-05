import { connectMongoDb } from "./db/index.js";
import { redisClient } from "./utils/init_redis.js";
import { app } from "./app.js";
import https from "https";
import { readFileSync } from "fs";
import path from "path";
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
      .listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
      });
  });
});
