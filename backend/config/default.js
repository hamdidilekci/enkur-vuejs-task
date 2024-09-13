import buildConnectionURI from "../common/buildConnectionURI.js";
import dotenv from "dotenv";

dotenv.config();

export const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
export const DATABASE_HOST = process.env.DATABASE_HOST;
export const DATABASE_PORT = process.env.DATABASE_PORT
    ? Number(process.env.DATABASE_PORT)
    : 27017;
export const DATABASE_NAME = process.env.DATABASE_NAME;
export const DATABASE_PROTOCOL = process.env.DATABASE_PROTOCOL;
export const DATABASE_OPTIONS = process.env.DATABASE_OPTIONS
    ? JSON.parse(process.env.DATABASE_OPTIONS)
    : {};

export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
export const SERVER_PORT = process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 3001;

export const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
export const ACCESS_EXPIRES_IN = process.env.ACCESS_EXPIRES_IN || "2m";
export const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
export const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || "1d";
export const BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS
    ? Number(process.env.BCRYPT_ROUNDS)
    : 8;

export const TOTP_SECRET_KEY = process.env.TOTP_SECRET_KEY;

export const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const FROM_EMAIL = process.env.FROM_EMAIL;

export const mongo = {
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_NAME,
    DATABASE_CONNECTION_STRING: buildConnectionURI({
        protocol: DATABASE_PROTOCOL,
        host: DATABASE_HOST,
        port: DATABASE_PORT,
        user: DATABASE_USERNAME,
        pass: DATABASE_PASSWORD,
        name: DATABASE_NAME,
        options: DATABASE_OPTIONS,
    }),
};

export const server = {
    HOSTNAME: SERVER_HOSTNAME,
    PORT: SERVER_PORT,
};

export const JWT = {
    ACCESS_SECRET_KEY,
    ACCESS_EXPIRES_IN,
    REFRESH_SECRET_KEY,
    REFRESH_EXPIRES_IN,
    BCRYPT_ROUNDS,
};

export const mail = {
    EMAIL_SERVICE,
    EMAIL_HOST,
    EMAIL_USERNAME,
    EMAIL_PASSWORD,
    FROM_EMAIL,
};
