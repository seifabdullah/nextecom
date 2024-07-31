import mongoose from 'mongoose';

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
      // Add additional options here if necessary
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    // Log any connection errors
    console.error('Error connecting to MongoDB:', error);
  }
};

export default dbConnect;
