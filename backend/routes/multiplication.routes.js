import { Router } from "express";
import MultiplicationService from "../services/multiplication.service.js";
import catchFunction from "../common/catchFunction.js";
import sendResponse from "../common/sendResponse.js";
import isAuthenticated from "../middleware/is-authenticated.js";

const router = Router();
//! add page, limit and initial dates
router.get(
    "/totals",
    isAuthenticated,
    catchFunction(async (req, res) => {
        const { startDate, endDate } = req.query;

        const totals = await MultiplicationService.calculateTotals(
            startDate,
            endDate
        );

        return sendResponse(
            res,
            200,
            totals,
            "Totals calculated successfully!"
        );
    })
);

export default router;
