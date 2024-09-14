import EpisData from "../models/episData.model.js";
import CounterData from "../models/counterData.model.js";
import moment from "moment";

export default class MultiplicationService {
    static async calculateTotals(page = 1, limit = 10, day, month) {
        // Define default day as 30 days ago and default month as 1 month ago
        const defaultDay = moment()
            .subtract(30, "days")
            .utc()
            .startOf("day")
            .toDate();
        const defaultMonthStartDate = moment()
            .subtract(1, "month")
            .utc()
            .startOf("month")
            .toDate();
        const defaultMonthEndDate = moment()
            .subtract(1, "month")
            .utc()
            .endOf("month")
            .toDate();

        // Format the day and month, or use defaults if not provided
        const formattedDayDate = day
            ? moment.utc(day, "YYYY-MM-DD").startOf("day").toDate()
            : defaultDay;

        const formattedMonthStartDate = month
            ? moment.utc(month, "YYYY-MM").startOf("month").toDate()
            : defaultMonthStartDate;

        const formattedMonthEndDate = month
            ? moment.utc(month, "YYYY-MM").endOf("month").toDate()
            : defaultMonthEndDate;

        const skip = (page - 1) * limit;

        // Fetch data for the specific day if the day is provided
        let dailyTotals = {};
        let monthlyTotals = {};

        if (formattedDayDate) {
            const episData = await EpisData.find({
                read_time: {
                    $gte: formattedDayDate,
                    $lte: moment(formattedDayDate).endOf("day").toDate(),
                },
            })
                .skip(skip)
                .limit(limit);

            const counterData = await CounterData.find({
                read_time: {
                    $gte: formattedDayDate,
                    $lte: moment(formattedDayDate).endOf("day").toDate(),
                },
            })
                .skip(skip)
                .limit(limit);

            episData.forEach((epis) => {
                const matchingCounter = counterData.find(
                    (counter) =>
                        counter.read_time.getTime() === epis.read_time.getTime()
                );

                if (matchingCounter) {
                    const total = epis.mcp_value * matchingCounter.cn_value;
                    const dateKey = epis.read_time.toISOString().split("T")[0];
                    dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + total;
                }
            });
        }

        // Fetch data for the specific month if the month is provided
        if (formattedMonthStartDate && formattedMonthEndDate) {
            const episData = await EpisData.find({
                read_time: {
                    $gte: formattedMonthStartDate,
                    $lte: formattedMonthEndDate,
                },
            })
                .skip(skip)
                .limit(limit);

            const counterData = await CounterData.find({
                read_time: {
                    $gte: formattedMonthStartDate,
                    $lte: formattedMonthEndDate,
                },
            })
                .skip(skip)
                .limit(limit);

            episData.forEach((epis) => {
                const matchingCounter = counterData.find(
                    (counter) =>
                        counter.read_time.getTime() === epis.read_time.getTime()
                );

                if (matchingCounter) {
                    const total = epis.mcp_value * matchingCounter.cn_value;
                    const monthKey = epis.read_time
                        .toISOString()
                        .split("T")[0]
                        .slice(0, 7); // YYYY-MM
                    monthlyTotals[monthKey] =
                        (monthlyTotals[monthKey] || 0) + total;
                }
            });
        }

        return { dailyTotals, monthlyTotals };
    }
}
