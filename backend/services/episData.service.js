import EpisData from "../models/episData.model.js";

export default class EpisDataService {
    static async get(page, limit, startDate, endDate) {
        const query = {};

        // If startDate and endDate are provided, add a date filter to the query
        if (startDate && endDate) {
            query.read_time = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const episData = await EpisData.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        return episData;
    }
}
