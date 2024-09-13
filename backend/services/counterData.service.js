import CounterData from "../models/counterData.model.js";

export default class CounterDataService {
    static async get(page, limit) {
        const counterData = await CounterData.find()
            .skip((page - 1) * limit)
            .limit(limit);

        return counterData;
    }
}
