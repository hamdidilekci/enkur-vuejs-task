import fs from "fs";
import path from "path";
import moment from "moment";
import { Types } from "mongoose";

import "dotenv/config";
import CounterData from "../models/counterData.model.js";
import connectDatabase from "../common/connectDatabase.js";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to process the data
const processCounterData = async () => {
    try {
        console.log("---1-- Removing existing records -----");
        await CounterData.deleteMany({});
        console.log("---2-- Existing records removed successfully -----");

        // Read the JSON file
        console.log("---3-- Reading JSON file -----");
        const filePath = path.join(__dirname, "../config/counter_logs.json");
        const fileData = fs.readFileSync(filePath, "utf8");
        const counterData = JSON.parse(fileData);

        console.log("---4-- Formatting JSON file -----");
        // Format the fields properly
        const formattedCounterData = counterData.map((data) => ({
            ...data,
            _id: new Types.ObjectId(data._id.$oid),
            counter_id: new Types.ObjectId(data.counter_id.$oid),
            read_time: moment(data.read_time, "YYYYMMDDHHmmss").toDate(),
            read_time_unix: moment(data.read_time_unix.$date).toDate(),
            created_at: moment(data.created_at.$date).toDate(),
            updated_at: moment(data.updated_at.$date).toDate(),
        }));

        console.log("---5-- Formatting JSON file -----");
        // Insert formatted data into the database
        await CounterData.insertMany(formattedCounterData);
        console.log(
            "---****-- Data successfully saved to the database ---****--"
        );
        process.exit(0);
    } catch (error) {
        console.error(
            "---!!!!-- Error saving data to the database ---!!!!--",
            error
        );
        process.exit(1);
    }
};

// Main function to run the process
const runProcess = async () => {
    await connectDatabase();
    await processCounterData();
};

runProcess();
