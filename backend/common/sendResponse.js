const sendResponse = (res, code, data, message, tokens) => {
    // send refresh token through cookie
    if (tokens) {
        tokens.refreshToken &&
            res.cookie("enkur-refresh-token", tokens.refreshToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 604800000, // 7 days
            });
        if (tokens.accessToken) {
            res.header("enkur-access-token", tokens.accessToken);
            res.cookie("enkur-access-token", tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 604800000, // 7 days
            });
        }
    }

    return res.status(code).json({
        status: code >= 200 && code < 300 ? "success" : "error",
        data: data,
        message:
            message.length === 0
                ? code >= 200 && code < 300
                    ? "success"
                    : "something_went_wrong"
                : message,
    });
};

export default sendResponse;
