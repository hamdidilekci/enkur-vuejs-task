import { mongo } from "../config/default.js";

import mongoose from "mongoose";

const connectDatabase = async () => {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(mongo.DATABASE_CONNECTION_STRING);
        return true;
    } catch (error) {
        console.log(`Database connection failed: ${error}`);
        return false;
    }
};

export default connectDatabase;