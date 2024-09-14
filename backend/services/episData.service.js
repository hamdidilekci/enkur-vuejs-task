import EpisData from "../models/episData.model.js";
import moment from "moment";

export default class EpisDataService {
    static async get(page, limit, startDate, endDate) {
        const query = {};

        // If startDate and endDate are provided, add a date filter to the query
        if (startDate && endDate) {
            const startDateUTC = moment(startDate).startOf("day").toISOString();
            const endDateUTC = moment(endDate).endOf("day").toISOString();

            query.read_time = {
                $gte: startDateUTC,
                $lte: endDateUTC,
            };
        }

        // Get the total number of records
        const totalRecords = await EpisData.countDocuments(query);

        // Get the paginated data
        const episData = await EpisData.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        return { episData, totalRecords };
    }
}
