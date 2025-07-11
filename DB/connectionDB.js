import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log(`DB connected successfully ^_^`);
    })
    .catch((err) => {
      console.log(`DB connection fail`, err);
    });
};

export default connectDB;
