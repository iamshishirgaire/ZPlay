import config from "../configuration.js";
import mongoose from "mongoose";

const { db } = config;
const connectMongoDb = async () => {
  try {
    await mongoose.connect(`${db.uri}`);
    console.log("Connected to mongodb database successfully.");
  } catch (error) {
    console.error(` Error while connecting to mongodb database:${error}`);
    process.exit(1);
  }
};

export { connectMongoDb };
