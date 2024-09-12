import bcrypt from "bcryptjs";
import { BCRYPT_ROUNDS, TOTP_SECRET_KEY } from "../config/default.js";

// two factor authentication
import { TOTP } from "totp-generator";

export const checkPassword = async (candidatePassword, userPassword) => {
    return bcrypt.compare(candidatePassword, userPassword);
};

export const encryptPassword = async (password) => {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
};

export const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/;
    return regex.test(password);
};

export const checkObject = (data) => {
    return data?.length > 0;
};

export const isValidJson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

export const checkParam = (data) => {
    return data === undefined || data === null || data === "";
};

export const checkParams = (params) => {
    const missing = [];
    for (const [key, value] of Object.entries(params)) {
        if (checkParam(value)) {
            missing.push(key);
        }
    }
    return missing;
};

export const generateOtp = (digits) => {
    const { otp } = TOTP.generate(TOTP_SECRET_KEY, {
        digits,
        algorithm: "SHA-512",
        period: 60,
    });

    return otp;
};
