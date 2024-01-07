import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";

const connectMongoDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`);
    console.log("Connected to mongodb database successfully.");
  } catch (error) {
    console.log(` Error while connecting to mongodb database:${error}`);
    process.exit(1);
  }
};

export { connectMongoDb };
