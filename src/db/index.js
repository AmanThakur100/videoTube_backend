import mongoose from "mongoose";
import DB_NAME from "../constants.js";
import { error } from "console";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log("\n MONGODB CONNECTED !");
    console.log(connectionInstance.connection.host);
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
