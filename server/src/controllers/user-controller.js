const { UserService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { createSuccessResponse, createErrorResponse } = require("../utils/common");

async function signUp(req, res) {
    try {
        const response = await UserService.createUser({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        const successResponse = createSuccessResponse();
        successResponse.data = response;
        return res.status(StatusCodes.CREATED).json(successResponse);
    } catch (error) {
        console.log(error);
        const errorResponse = createErrorResponse();
        errorResponse.error = error;
        return res.status(error.statusCode || 500).json(errorResponse);
    }
}

async function signin(req, res) {
    try {
        const response = await UserService.signIn({
            email: req.body.email,
            password: req.body.password,
        });
        const successResponse = createSuccessResponse();
        successResponse.data = response;
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
        console.log(error);
        const errorResponse = createErrorResponse();
        errorResponse.error = error;
        return res.status(error.statusCode || 500).json(errorResponse);
    }
}

async function signOut(req, res) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const response = await UserService.logOut(token);
        const successResponse = createSuccessResponse();
        successResponse.data = response;
        res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
        console.log(error);
        const errorResponse = createErrorResponse();
        errorResponse.error = error;
        errorResponse.message = "Logout failed";
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}

module.exports = {
    signUp,
    signin,
    signOut,
};