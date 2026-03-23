import { connect } from "mongoose";

const connectDB = async () => {
  if (global.mongooseConnection) {
    return global.mongooseConnection;
  }

  try {
    const conn = await connect(process.env.MONGO_URI);
    global.mongooseConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
