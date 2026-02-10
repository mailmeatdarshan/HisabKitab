const { StatusCodes } = require("http-status-codes");
const { createErrorResponse } = require("../utils/common");
const AppErrors = require("../utils/errors/app-errors");
const { UserService } = require("../services");

async function validateUser(req, res, next) {
    if (!req.body.username) {
        const errorResponse = createErrorResponse();
        errorResponse.message =
            "Something went wrong while authenticating the user";
        errorResponse.error = new AppErrors(
            ["username is not found in the oncoming request in correct form!"],
            StatusCodes.NOT_FOUND
        );
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    if (!req.body.email) {
        const errorResponse = createErrorResponse();
        errorResponse.message =
            "Something went wrong while authenticating the user";
        errorResponse.error = new AppErrors(
            ["email is not found in the oncoming request in correct form!"],
            StatusCodes.NOT_FOUND
        );
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    if (!req.body.password) {
        const errorResponse = createErrorResponse();
        errorResponse.message =
            "Something went wrong while authenticating the user";
        errorResponse.error = new AppErrors(
            ["password is not found in the oncoming request in correct form!"],
            StatusCodes.NOT_FOUND
        );
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    next();
}

async function checkAuth(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const response = await UserService.isAuthenicated(token);
        if (response) {
            const userId = response.id;
            req.user = {
                id: userId,
                timeRemaining: response.iat,
                expiry: response.exp,
            };
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json(error);
    }
}

module.exports = {
    validateUser,
    checkAuth,
};