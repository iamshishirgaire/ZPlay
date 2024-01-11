import { connectMongoDb } from "./db/index.js";
import { redisClient } from "./utils/init_redis.js";
import { app } from "./app.js";
import https from "https";
import { readFileSync } from "fs";
import path from "path";
import configuration from "./configuration.js";
import dotenv from "dotenv";
const __dirname = path.resolve();
dotenv.config();

connectMongoDb().then(() => {
  redisClient.connect().then(() => {
    if (configuration.env === "development") {
      https
        .createServer(
          {
            key: readFileSync(`${__dirname}/cert/key.pem`),
            cert: readFileSync(`${__dirname}/cert/cert.pem`),
          },
          app
        )
        .listen(configuration.port, () => {
          console.log(
            `Server listening on port with https ${configuration.port}`
          );
        });
    } else {
      app.listen(configuration.port, () => {
        console.log(
          `Server listening on port without https ${configuration.port}`
        );
      });
    }
  });
});
