import sendResponse from "./sendResponse.js";

const catchFunction = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            console.log(
                `Req url : ${req.originalUrl} method : ${req.method} -> On catch function : ${err.message}`
            );
            sendResponse(res, 400, {}, err.message);
        });
    };
};

export default catchFunction;
