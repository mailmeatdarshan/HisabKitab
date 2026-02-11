const { StatusCodes } = require("http-status-codes");
const { ExpanseService } = require("../services");
const { createErrorResponse, createSuccessResponse } = require("../utils/common");

async function createExpanses(req, res) {
    try {
        const userId = req.user.id;
        const expanse = await ExpanseService.addExpanse({
            amount: req.body.amount,
            category: req.body.category,
            Date: req.body.Date,
            note: req.body.note,
            userId,
        });

        const successResponse = createSuccessResponse();
        successResponse.data = expanse;
        return res.status(StatusCodes.CREATED).json(successResponse);
    } catch (error) {
        const errorResponse = createErrorResponse();
        errorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}

async function getExpanses(req, res) {
    try {
        const userId = req.user.id;
        const expanse = await ExpanseService.getExpanses(userId);
        const successResponse = createSuccessResponse();
        successResponse.data = expanse;
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
        const errorResponse = createErrorResponse();
        errorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}

async function getSummaryByCategory(req, res) {
    try {
        const month = req.query.Date;
        const userId = req.user.id;
        const query = { month, userId };
        const total = await ExpanseService.getTotalExpanses(query);
        const successResponse = createSuccessResponse();
        successResponse.data = total;
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
        const errorResponse = createErrorResponse();
        errorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}

async function filterExpansesByCategory(req, res) {
    try {
        const userId = req.user.id;
        const query = { ...req.query, userId };
        const expanse = await ExpanseService.filterBy(query);
        const successResponse = createSuccessResponse();
        successResponse.data = expanse;
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
        const errorResponse = createErrorResponse();
        errorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}

async function deleteExpanse(req, res) {
    try {
        const userId = req.user.id;
        const expenseId = req.params.id;
        const result = await ExpanseService.deleteExpanse(expenseId, userId);
        const successResponse = createSuccessResponse();
        successResponse.data = result;
        successResponse.message = "Expense deleted successfully";
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
        const errorResponse = createErrorResponse();
        errorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}

async function updateExpanse(req, res) {
    try {
        const userId = req.user.id;
        const expenseId = req.params.id;
        const result = await ExpanseService.updateExpanse(expenseId, userId, {
            amount: req.body.amount,
            category: req.body.category,
            Date: req.body.Date,
            note: req.body.note,
        });
        const successResponse = createSuccessResponse();
        successResponse.data = result;
        successResponse.message = "Expense updated successfully";
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
        const errorResponse = createErrorResponse();
        errorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}

module.exports = {
    createExpanses,
    getExpanses,
    filterExpansesByCategory,
    getSummaryByCategory,
    deleteExpanse,
    updateExpanse,
};