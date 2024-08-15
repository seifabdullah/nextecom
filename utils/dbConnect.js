import mongoose from "mongoose";

const dbConnect = async () => {
  // Check if the connection is already established
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    // Establish a new connection
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout for better error handling
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    // Log any connection errors
    console.error("Error connecting to MongoDB:", error.message);
    // Optionally re-throw the error or handle it according to your needs
    throw error;
  }
};

// Handle MongoDB connection events
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

export default dbConnect;
