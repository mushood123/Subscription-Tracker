import mongoose from 'mongoose';
import { MONGODB_URI, NODE_ENV } from '../config/env.js';


const connectToDatabase = async (successCB, errorCB) => {
  try {

    await mongoose.connect(MONGODB_URI);
    successCB(`Connected to database in ${NODE_ENV.toUpperCase()} MODE`);

  } catch (error) {

    errorCB('Error connecting to database: ', error);
    process.exit(1);

  }
};

export default connectToDatabase;