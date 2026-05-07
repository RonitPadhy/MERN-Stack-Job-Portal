import mongoose from "mongoose";

const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGODB connected Successfully");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
