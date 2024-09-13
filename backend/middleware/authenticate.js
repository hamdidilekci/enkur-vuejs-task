import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import sendResponse from "../common/sendResponse.js";
import { ACCESS_SECRET_KEY } from "../config/default.js";

const authenticate = async (req, res, next) => {
    try {
        console.log("Authenticate.js");

        const authHeader = req.headers["authorization"];
        const token = authHeader ? authHeader.replace("Bearer ", "") : null;

        if (token) {
            const decoded = jwt.verify(token, ACCESS_SECRET_KEY);

            if (!decoded || !decoded._id) {
                throw new Error("Invalid token");
            }

            const user = await User.findOne({
                _id: decoded._id,
            });

            if (!user) {
                throw new Error("Authentication failed. User not found.");
            }

            req.user = user;
        }
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            sendResponse(res, 401, {}, error.message);
            return;
        }

        console.log("Authenticate.js error: ", error);
    }
    next();
};

export default authenticate;
