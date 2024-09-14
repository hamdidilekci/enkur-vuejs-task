import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// two factor authentication
import { JWT } from "../config/default.js";

// commons
import {
    validatePassword,
    encryptPassword,
    checkPassword,
    generateOtp,
} from "../common/index.js";
// utils
import { sendSms, smsTypes } from "../common/sendSms.js";

// import sendMail from "../common/send-mail.js";

export default class AuthService {
    static async signUp({ password, email, ...data }) {
        // create user
        const user = new User({ email, ...data });

        if (!validatePassword(password)) {
            throw new Error(
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            );
        }

        // try to save user to database and catch any errors that occur
        await user.save();

        user.password = await encryptPassword(password);

        // after creating user, send verification code to user's phone number
        const otp = generateOtp(6);

        await sendSms(user.phone, otp, smsTypes.register);

        // expiration date is 120 seconds from now
        const expireDate = new Date(Date.now() + 120 * 1000);

        // initialize phoneVerification object
        user.phoneVerification = {
            code: otp,
            expireDate,
            isVerified: false,
        };

        return user.save();
    }

    // verify Phone
    static async verifyPhone({ phone, verificationCode }) {
        const user = await User.findOne({ phone });

        if (!user) {
            throw new Error("User not found");
        }

        // Check if OTP code has expired
        if (
            user.phoneVerification.expireDate &&
            user.phoneVerification.expireDate < new Date()
        ) {
            throw new Error("OTP code has expired");
        }

        // Check if OTP code is correct
        if (user.phoneVerification.code !== verificationCode) {
            throw new Error("Invalid verification code");
        }

        // Verify phone verification
        user.phoneVerification.isVerified = true;

        await user.save();

        // sign user in
        AuthService.loginDirect(user);

        return user;
    }

    // if user can't verify phone, send verification code again
    static async resendVerificationCode({ phone }) {
        const user = await User.findOne({ phone });

        if (!user) {
            throw new Error("User not found");
        }

        // Check if OTP code is expired
        if (
            user.phoneVerification.expireDate &&
            user.phoneVerification.expireDate >= new Date()
        ) {
            throw new Error(
                "You cannot request more than one code within 120 seconds."
            );
        }

        if (user.phoneVerification.isVerified) {
            throw new Error("Phone number already verified");
        }

        // Generate new OTP code
        const otp = generateOtp(6);

        // Send the new verification code to the user's phone number
        await sendSms(user.phone, otp, smsTypes.register);

        // Expiration date is 120 seconds from now
        const expireDate = new Date(Date.now() + 120 * 1000);

        // Update user's record with new OTP code and expiration date
        user.phoneVerification = {
            code: otp,
            expireDate,
            isVerified: false,
        };

        await user.save();

        return user;
    }

    // after verification log user in directly
    static async loginDirect(user) {
        const accessToken = jwt.sign({ _id: user._id }, JWT.ACCESS_SECRET_KEY, {
            expiresIn: JWT.ACCESS_EXPIRES_IN,
        });

        const refreshToken = jwt.sign(
            { _id: user._id },
            JWT.REFRESH_SECRET_KEY,
            {
                expiresIn: JWT.REFRESH_EXPIRES_IN,
            }
        );

        const tokens = {
            accessToken,
            refreshToken,
        };
        return { tokens, user };
    }

    // Login
    static async login({ phone, password }) {
        // check if user exists
        const user = await User.findOne({ phone }).lean();

        if (!user) {
            throw new Error("User with this phone number not found");
        }

        if (phone == null || password == null) {
            throw new Error("Invalid credentials");
        }

        // check if user is verified
        if (!user.phoneVerification.isVerified) {
            throw new Error("User must be verified to login");
        }

        // check if password is valid
        const validPassword = await checkPassword(password, user.password);

        if (!validPassword) {
            throw new Error("Invalid password");
        }

        return AuthService.loginDirect(user);
    }

    // refresh token
    static async refreshToken(refreshToken) {
        const decoded = jwt.verify(refreshToken, JWT.REFRESH_SECRET_KEY);

        if (!decoded || !decoded._id) {
            throw new Error("Invalid refresh token");
        }

        const user = await User.findById(decoded._id);

        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = jwt.sign(
            { _id: decoded._id },
            JWT.ACCESS_SECRET_KEY,
            {
                expiresIn: JWT.ACCESS_EXPIRES_IN,
            }
        );

        return accessToken;
    }

    // Forgot password
    static async forgotPassword({ phone }) {
        const user = await User.findOne({ phone });

        if (!user) {
            throw new Error("User not found");
        }

        // user must be verified to reset password
        if (!user.phoneVerification.isVerified) {
            throw new Error("User must be verified to reset password");
        }

        // create random reset token
        const otp = generateOtp(6);

        user.phoneVerification.code = otp;

        user.save();

        await sendSms(user.phone, otp, smsTypes.resetPassword);
    }

    // verify password reset otp code
    static async forgotPasswordVerifyOtp({ phone, otpCode }) {
        const user = await User.findOne({ phone });

        if (!user) {
            throw new Error("User not found");
        }

        if (user.phoneVerification.code !== otpCode) {
            throw new Error("Invalid OTP code");
        }

        var randomString = Math.random().toString(36).slice(-8);
        user.password = await encryptPassword(randomString);

        // send random password as sms
        await sendSms(user.phone, randomString, smsTypes.newPassword);

        await user.save();

        return user;
    }

    // check if user is authenticated
    static async checkAuth(token) {
        try {
            const decoded = jwt.verify(token, JWT.ACCESS_SECRET_KEY);

            if (!decoded || !decoded._id) {
                throw new Error("Invalid token");
            }

            const user = await User.findById(decoded._id);

            if (!user) {
                throw new Error("User not found");
            }

            return user;
        } catch (error) {
            throw new Error("Invalid token");
        }
    }
}
