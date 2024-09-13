import { model, Schema } from "mongoose";

const CounterDataSchema = new Schema(
    {
        counter_id: { type: String },
        read_time: { type: Date, required: true },
        cn_value: { type: Number, required: true },
        read_time_unix: { type: Date },
        created_at: { type: Date },
        updated_at: { type: Date },
        gn_value: { type: Number },
        rc_value: { type: Number },
        rco_value: { type: Number },
        ri_value: { type: Number },
        rio_value: { type: Number },
    },
    {
        autoCreate: true,
        autoIndex: true,
        versionKey: false,
        collection: "counterData",
    }
);

const CounterData = model("CounterData", CounterDataSchema);

export default CounterData;
