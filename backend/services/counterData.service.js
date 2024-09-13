import CounterData from "../models/counterData.model.js";

export default class CounterDataService {
    static async get(page, limit, startDate, endDate) {
        const query = {};

        if (startDate && endDate) {
            query.read_time = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const counterData = await CounterData.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        return counterData;
    }
}
