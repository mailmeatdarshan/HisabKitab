const { StatusCodes } = require('http-status-codes');
const MAILER = require('../config/email-config');
const AppErrors = require('../utils/errors/app-errors');
const {UserRepository}= require('./../repositories')
const crudRepo = new UserRepository();
async function sendEmail(mailFrom,mailTo,mailSubject,mailText){
  
    try {
        const response = await MAILER.sendMail({
            from:mailFrom,
            to:mailTo,
            subject:mailSubject,
            text:mailText
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

async function getEmailbyId(Id){
    try {
        const response = await crudRepo.get(Id);
        return response;
    } catch (error) {
        
    }
}
module.exports={
    sendEmail,
    getEmailbyId
}