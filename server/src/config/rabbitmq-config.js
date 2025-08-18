const { EmailService } = require('../services');
const {MQ_URL} = require('./server-config');
const amqp = require('amqplib');

const rabbitmqConnect = async () => {
    try {
        const connection = await amqp.connect(MQ_URL);
       const channels = await connection.createChannel(); 
       await channels.assertQueue("expanseQueue");

       await channels.consume("expanseQueue", async (data) => {
         if (!data) return;
      const payload = JSON.parse(data.content.toString());
      const {to,subject,text} = payload;
       await EmailService.sendEmail("poro3679@gmail.com",to,subject,text);
       channels.ack(data);
       })
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        throw error;
    }
}

module.exports = {rabbitmqConnect};