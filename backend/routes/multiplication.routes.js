import { Router } from "express";
import MultiplicationService from "../services/multiplication.service.js";
import catchFunction from "../common/catchFunction.js";
import sendResponse from "../common/sendResponse.js";
import isAuthenticated from "../middleware/is-authenticated.js";

const router = Router();

router.get(
    "/totals",
    isAuthenticated,
    catchFunction(async (req, res) => {
        const { page, limit, day, month } = req.query;

        const totals = await MultiplicationService.calculateTotals(
            page,
            limit,
            day,
            month
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
