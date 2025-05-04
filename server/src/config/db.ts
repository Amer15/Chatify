import env from "@/env";
import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(env.DB_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
