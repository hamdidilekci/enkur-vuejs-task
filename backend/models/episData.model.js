import { model, Schema } from "mongoose";

const EpisDataSchema = new Schema(
    {
        read_time: { type: Date, required: true },
        mcp_value: { type: Number, required: true },
        read_time_unix: { type: Date, required: true },
        created_at: { type: Date, required: true },
        updated_at: { type: Date, required: true },
    },
    {
        autoCreate: true,
        autoIndex: true,
        versionKey: false,
        collection: "episData",
    }
);

const EpisData = model("EpisData", EpisDataSchema);

export default EpisData;
