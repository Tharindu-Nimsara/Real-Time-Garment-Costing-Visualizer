import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    // Make sure MONGO_URI is defined in your .env file
    const conn = await connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;