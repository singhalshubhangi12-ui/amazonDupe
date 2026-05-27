import mongoose from "mongoose";

export const connectMongoDB = async (connectionURL) => {
  await mongoose.connect(connectionURL);
};