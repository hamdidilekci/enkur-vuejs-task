import EpisData from "../models/episData.model.js";

export default class EpisDataService {
    static async get(page, limit) {
        const episData = await EpisData.find()
            .skip((page - 1) * limit)
            .limit(limit);

        return episData;
    }
}
