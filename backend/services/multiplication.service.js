import EpisData from "../models/episData.model.js";
import CounterData from "../models/counterData.model.js";

export default class MultiplicationService {
    static async calculateTotals(startDate, endDate) {
        const episData = await EpisData.find({
            read_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });

        const counterData = await CounterData.find({
            read_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });

        let dailyTotals = {};
        let monthlyTotals = {};

        episData.forEach((epis) => {
            const matchingCounter = counterData.find(
                (counter) =>
                    counter.read_time.getTime() === epis.read_time.getTime()
            );

            if (matchingCounter) {
                const total = epis.mcp_value * matchingCounter.cn_value;
                const dateKey = epis.read_time.toISOString().split("T")[0];

                // Daily totals
                dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + total;

                // Monthly totals
                const monthKey = epis.read_time
                    .toISOString()
                    .split("T")[0]
                    .slice(0, 7); // YYYY-MM
                monthlyTotals[monthKey] =
                    (monthlyTotals[monthKey] || 0) + total;
            }
        });

        return { dailyTotals, monthlyTotals };
    }
}
