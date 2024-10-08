import { Router } from "express";

import catchFunction from "../common/catchFunction.js";
import sendResponse from "../common/sendResponse.js";

import isAuthenticated from "../middleware/is-authenticated.js";

import EpisDataService from "../services/episData.service.js";

const router = Router();

router.get(
    "/",
    isAuthenticated,
    catchFunction(async (req, res) => {
        const { page = "1", limit = "10", startDate, endDate } = req.query;

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        const { episData, totalRecords } = await EpisDataService.get(
            pageNum,
            limitNum,
            startDate,
            endDate
        );

        return sendResponse(
            res,
            200,
            { episData, totalRecords },
            "Epis data fetched successfully!"
        );
    })
);

export default router;
