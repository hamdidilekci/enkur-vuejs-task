import express from "express";
import cors from "cors";
import "dotenv/config";

import mongoose from "mongoose";
mongoose.set("debug", true);

import authenticate from "./middleware/authenticate.js";
import routes from "./routes/index.js";
import connectDatabase from "./common/connectDatabase.js";

// allow empty strings
mongoose.Schema.Types.String.checkRequired((v) => typeof v === "string");

await connectDatabase();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(authenticate);
app.use("/", routes);

app.listen(PORT, () => {
    console.log(`app listening on http://localhost:${PORT}`);
});
