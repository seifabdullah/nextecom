import mongoose from 'mongoose';

const dbConnect = async () => {
  // Check if the connection is already established
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    // Establish a new connection
    await mongoose.connect(process.env.DB_URI, {
      // The following options are no longer needed
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Optional: Increase timeout for better error handling
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    // Log any connection errors
    console.error('Error connecting to MongoDB:', error.message);
  }
};

export default dbConnect;
