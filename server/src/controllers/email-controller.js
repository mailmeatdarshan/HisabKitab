const { StatusCodes } = require('http-status-codes');
const { EmailService } = require('../services');
const publishEmailJob = require('../utils/common/publishEmailJob');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

async function sendEmail(req,res){
    const userId = req.user.id;
    try{
        const usergetMail = await EmailService.getEmailbyId(userId);
        const mailTo = usergetMail.email;
        const mailSubject = req.body.subject;
        const mailText = req.body.text;
        const emailPayload = {
            to:mailTo,
            subject:mailSubject,
            text:mailText
        }
       await publishEmailJob(emailPayload);
        SuccessResponse.message = "Email sent successfully";
      return res.status(StatusCodes.OK).json(SuccessResponse);
    }catch(error){
        console.log(error);
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports ={
    sendEmail
}