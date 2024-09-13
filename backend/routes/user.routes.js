import { Router } from "express";

import { checkParams } from "../common/index.js";
import { MissingParameterError } from "../common/errors.js";
import catchFunction from "../common/catchFunction.js";
import sendResponse from "../common/sendResponse.js";

import isAuthenticated from "../middleware/is-authenticated.js";

import UserService from "../services/user.service.js";

const router = Router();

// user can change his password when logged in
router.post(
    "/change-password",
    isAuthenticated,
    catchFunction(async (req, res) => {
        const newPassword = req.body.newPassword;
        const oldPassword = req.body.oldPassword;

        const missing = checkParams({
            newPassword: req.body.newPassword,
            oldPassword: req.body.oldPassword,
        });

        if (missing.length > 0) {
            throw new MissingParameterError(missing.join(", "));
        }

        const user = await UserService.changePassword(req.user, {
            newPassword,
            oldPassword,
        });

        return sendResponse(res, 200, user, "Password updated successfully!");
    })
);

export default router;
