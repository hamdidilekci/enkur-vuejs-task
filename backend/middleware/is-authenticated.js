import catchFunction from "../common/catchFunction.js";

const isAuthenticated = catchFunction(async (req, res, next) => {
    if (!req.user?.phoneVerification.isVerified) {
        throw new Error("User not authenticated");
    }

    console.log("authenticated");
    return next();
});

export default isAuthenticated;
