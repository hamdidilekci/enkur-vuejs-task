import EpisData from "../models/episData.model.js";
import CounterData from "../models/counterData.model.js";
import moment from "moment";

export default class MultiplicationService {
    static async calculateTotals(day, month) {
        // Define default day as 30 days ago and default month as 1 month ago in UTC
        const defaultDay = moment()
            .subtract(30, 'days')
            .utc()
            .startOf('day')
            .toISOString(); // Ensures UTC

        const defaultMonthStartDate = moment()
            .subtract(1, 'month')
            .utc()
            .startOf('month')
            .toISOString();

        const defaultMonthEndDate = moment()
            .subtract(1, 'month')
            .utc()
            .endOf('month')
            .toISOString();

        // Format the day and month, or use defaults if not provided
        const formattedDayDate = day
            ? moment.utc(day, "YYYY-MM-DD").startOf('day').toISOString()
            : defaultDay;

        const formattedMonthStartDate = month
            ? moment.utc(month, "YYYY-MM").startOf('month').toISOString()
            : defaultMonthStartDate;

        const formattedMonthEndDate = month
            ? moment.utc(month, "YYYY-MM").endOf('month').toISOString()
            : defaultMonthEndDate;

        // Fetch data for the specific day if the day is provided
        let dailyTotal = -1;
        let monthlyTotal = -1;

        if (formattedDayDate) {
            const formattedDayEndDate = moment.utc(formattedDayDate).endOf("day").toISOString();

            const episData = await EpisData.find({
                read_time: {
                    $gte: formattedDayDate,
                    $lte: formattedDayEndDate,
                },
            });

            const counterData = await CounterData.find({
                read_time: {
                    $gte: formattedDayDate,
                    $lte: formattedDayEndDate,
                },
            });

            episData.forEach((epis) => {
                const matchingCounter = counterData.find(
                    (counter) =>
                        counter.read_time.getTime() === epis.read_time.getTime()
                );

                if (matchingCounter) {
                    const total = epis.mcp_value * matchingCounter.cn_value;
                    dailyTotal += total;
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
            });

            const counterData = await CounterData.find({
                read_time: {
                    $gte: formattedMonthStartDate,
                    $lte: formattedMonthEndDate,
                },
            });

            episData.forEach((epis) => {
                const matchingCounter = counterData.find(
                    (counter) =>
                        counter.read_time.getTime() === epis.read_time.getTime()
                );

                if (matchingCounter) {
                    const total = epis.mcp_value * matchingCounter.cn_value;
                    monthlyTotal += total;
                }
            });
        }

        return { dailyTotal, monthlyTotal };
    }
}
