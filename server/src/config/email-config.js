const nodeMailer = require('nodemailer');
const {EMAIL,GMAIL_PASS} = require('./server-config')



const mailSender = nodeMailer.createTransport({
    service:'Gmail',
    auth:{
      user:EMAIL,
      pass:GMAIL_PASS
    }
})

module.exports=mailSender;