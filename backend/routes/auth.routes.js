import { Router } from "express";

import { checkParams } from "../common/index.js";
import { MissingParameterError } from "../common/errors.js";
import catchFunction from "../common/catchFunction.js";
import sendResponse from "../common/sendResponse.js";

import AuthService from "../services/auth.service.js";

const router = Router();

router.post(
    "/register",
    catchFunction(async (req, res) => {
        const missing = checkParams({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
        });

        if (missing.length > 0) {
            throw new MissingParameterError(missing.join(", "));
        }

        const user = await AuthService.signUp(req.body);

        return sendResponse(res, 200, user, "Registration successful!");
    })
);

router.post(
    "/register/verify-otp",
    catchFunction(async (req, res) => {
        const missing = checkParams({
            phone: req.body.phone,
            verificationCode: req.body.verificationCode,
        });

        if (missing.length > 0) {
            throw new MissingParameterError(missing.join(", "));
        }

        const user = await AuthService.verifyPhone(req.body);

        return sendResponse(res, 200, user, "Verification successful!");
    })
);

router.post(
    "/send-register-otp",
    catchFunction(async (req, res) => {
        const missing = checkParams({
            phone: req.body.phone,
        });

        if (missing.length > 0) {
            throw new MissingParameterError(missing.join(", "));
        }

        const user = await AuthService.resendVerificationCode(req.body);

        return sendResponse(res, 200, user, "Verification code resent!");
    })
);

router.post(
    "/login",
    catchFunction(async (req, res) => {
        const missing = checkParams({
            phone: req.body.phone,
            password: req.body.password,
        });

        if (missing.length > 0) {
            throw new MissingParameterError(missing.join(", "));
        }
        let { accessToken, user } = await AuthService.login(req.body);

        return sendResponse(
            res,
            200,
            { user, accessToken },
            "Logged in successfully!"
        );
    })
);

router.post(
    "/refresh-token",
    catchFunction(async (req, res) => {
        const refreshToken = req.cookies["refreshToken"];

        if (!refreshToken) {
            throw new MissingParameterError("refreshToken");
        }

        const token = await AuthService.refreshToken(refreshToken);

        return sendResponse(res, 200, {}, "Token refreshed successfully!", {
            accessToken: token,
        });
    })
);

router.post(
    "/forgot-password",
    catchFunction(async (req, res) => {
        const missing = checkParams({
            phone: req.body.phone,
        });

        if (missing.length > 0) {
            throw new MissingParameterError(missing.join(", "));
        }

        await AuthService.forgotPassword(req.body);

        return sendResponse(res, 200, null, "OTP sent successfully!");
    })
);

// verify otp and reset password, send new password to user
router.post(
    "/forgot-password/verify-otp",
    catchFunction(async (req, res) => {
        const phone = req.body.phone;
        const otpCode = req.body.otpCode;

        const missing = checkParams({
            phone,
            otpCode,
        });

        if (missing.length > 0) {
            throw new MissingParameterError(missing.join(", "));
        }

        const user = await AuthService.forgotPasswordVerifyOtp({
            phone,
            otpCode,
        });

        return sendResponse(
            res,
            200,
            user,
            "Verification reset otp code successful!"
        );
    })
);

// check authentication and return user info
router.get(
    "/check",
    catchFunction(async (req, res) => {
        // get token from request headers
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new Error("Access denied! Please login.");
        }

        const user = await AuthService.checkAuth(token);

        return sendResponse(res, 200, user, "User authenticated successfully!");
    })
);

export default router;
