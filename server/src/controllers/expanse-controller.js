const { StatusCodes } = require('http-status-codes');
const { ExpanseService } = require('../services');
const {ErrorResponse,SuccessResponse}= require('../utils/common');

async function createExpanses(req, res) {
    try {
        const userId = req.user.id;
        const expanse = await ExpanseService.addExpanse({
            amount: req.body.amount,
            category: req.body.category,
            Date: req.body.Date,
            note: req.body.note,
            userId
        });

        SuccessResponse.data = expanse
        return res.status(StatusCodes.CREATED).json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse)
    }
}

async function getExpanses(req, res) {
    try {
        const expanse = await ExpanseService.getExpanses();
        SuccessResponse.data = expanse
        return res.status(StatusCodes.OK).json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse)
    }
}

async function getSummaryByCategory(req, res) {
    try {
        const month = req.query.Date;
        const userId = req.user.id;
        const query = {month,userId};
        const total = await ExpanseService.getTotalExpanses(query);
        SuccessResponse.data = total ;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function filterExpansesByCategory(req, res) {
    try {
        const expanse = await ExpanseService.filterBy(req.query);
        SuccessResponse.data = expanse
        return res.status(StatusCodes.OK).json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse)
    }
}
module.exports = {  
    createExpanses,
    getExpanses,
filterExpansesByCategory,
getSummaryByCategory
}