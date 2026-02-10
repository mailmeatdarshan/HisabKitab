const { StatusCodes } = require("http-status-codes");
const { EmailService } = require("../services");
const publishEmailJob = require("../utils/common/publishEmailJob");
const { createSuccessResponse, createErrorResponse } = require("../utils/common");

async function sendEmail(req, res) {
    const userId = req.user.id;
    try {
        const usergetMail = await EmailService.getEmailbyId(userId);
        const mailTo = usergetMail.email;
        const mailSubject = req.body.subject;
        const mailText = req.body.text;
        const emailPayload = {
            to: mailTo,
            subject: mailSubject,
            text: mailText,
        };
        await publishEmailJob(emailPayload);
        const successResponse = createSuccessResponse();
        successResponse.message = "Email sent successfully";
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
        console.log(error);
        const errorResponse = createErrorResponse();
        errorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}

module.exports = {
    sendEmail,
};