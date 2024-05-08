import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}`
    );
  } catch (error) {
    console.log("MongoDB connection failed : ", error);
    process.exit(1);
  }
};

export { connectDB };
