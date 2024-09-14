import CounterData from "../models/counterData.model.js";
import moment from "moment";

export default class CounterDataService {
    static async get(page, limit, startDate, endDate) {
        const query = {};

        const formattedStardDate = moment(startDate, "YYYY-MM-DD").startOf('day').toISOString()
        const formattedEndDate = moment(endDate, "YYYY-MM-DD").endOf('day').toISOString()

        if (startDate && endDate) {
            query.read_time = {
                $gte: formattedStardDate, // UTC start of day
                $lte: formattedEndDate
            };
        }

        // Get the total number of records
        const totalRecords = await CounterData.countDocuments(query);

        const counterData = await CounterData.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return { counterData, totalRecords };
    }
}
