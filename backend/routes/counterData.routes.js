import { Router } from "express";

import { checkParams } from "../common/index.js";
import { MissingParameterError } from "../common/errors.js";
import catchFunction from "../common/catchFunction.js";
import sendResponse from "../common/sendResponse.js";

import isAuthenticated from "../middleware/is-authenticated.js";

import CounterDataService from "../services/counterData.service.js";

const router = Router();

router.get(
    "/",
    isAuthenticated,
    catchFunction(async (req, res) => {
        const { page = "1", limit = "10", startDate, endDate } = req.query;

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        const { counterData, totalRecords } = await CounterDataService.get(
            pageNum,
            limitNum,
            startDate,
            endDate
        );

        return sendResponse(
            res,
            200,
            { counterData, totalRecords },
            "Counter data fetched successfully!"
        );
    })
);

export default router;
