import { connectMongoDb } from "./db/index.js";
import { redisClient } from "./utils/init_redis.js";
import { app } from "./app.js";

connectMongoDb().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
  redisClient.connect();
});
