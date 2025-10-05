import mongoose from "mongoose";

let isConnected = false; // track the connection

const connectDB = async () => {
  if (isConnected) {
    // console.log("MongoDB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log("✅ Database Connected");
    }
  } catch (error) {
    console.error("❌ Database connection error:", error);
    throw new Error("Database connection failed");
  }
};

export default connectDB;
