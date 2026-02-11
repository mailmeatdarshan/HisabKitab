const { StatusCodes } = require('http-status-codes');
const { getMailSender } = require('../config/email-config');
const AppErrors = require('../utils/errors/app-errors');
const { UserRepository } = require('./../repositories')
const crudRepo = new UserRepository();
async function sendEmail(mailFrom, mailTo, mailSubject, mailText) {

    try {
        const mailer = getMailSender();
        if (!mailer) {
            throw new AppErrors(
                "Email service is not configured",
                StatusCodes.SERVICE_UNAVAILABLE
            );
        }
        const response = await mailer.sendMail({
            from: mailFrom,
            to: mailTo,
            subject: mailSubject,
            text: mailText
        })

        return response;
    } catch (error) {
        console.log(error);
        throw new AppErrors(
            "Something went wrong in the sendingEmail service",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function getEmailbyId(Id) {
    try {
        const response = await crudRepo.get(Id);
        return response;
    } catch (error) {
        console.log(error);
        throw new AppErrors(
            "Something went wrong fetching user email",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}
module.exports = {
    sendEmail,
    getEmailbyId
}