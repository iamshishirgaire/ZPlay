import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_HOST_URL,
});
redisClient.on("connect", () => {
  console.log("Connected to redis database successfully.");
});
redisClient.on("error", (error) => {
  console.log(`Error while connecting to redis database:${error}`);
  process.exit(1);
});
redisClient.on("end", () => {
  console.log("Disconnected from redis database successfully.");
});
redisClient.on("SIGINT", () => {
  console.log("Redis client disconnected");
  redisClient.quit();
});

export { redisClient };
