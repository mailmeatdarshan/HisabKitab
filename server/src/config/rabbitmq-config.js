const { EmailService } = require("../services");
const { MQ_URL, EMAIL } = require("./server-config");
const amqp = require("amqplib");

const rabbitmqConnect = async () => {
    if (!MQ_URL) {
        console.warn("⚠️  RABBITMQ_URL not set — email queue will be unavailable");
        return;
    }

    try {
        const connection = await amqp.connect(MQ_URL);
        const channels = await connection.createChannel();
        await channels.assertQueue("expanseQueue");

        await channels.consume("expanseQueue", async (data) => {
            if (!data) return;
            try {
                const payload = JSON.parse(data.content.toString());
                const { to, subject, text } = payload;
                await EmailService.sendEmail(EMAIL, to, subject, text);
                channels.ack(data);
            } catch (err) {
                console.error("Failed to process email job:", err.message);
                channels.nack(data, false, false);
            }
        });

        console.log("Queue is up");
    } catch (error) {
        console.warn("⚠️  Failed to connect to RabbitMQ:", error.message);
        console.warn("⚠️  Server will continue without RabbitMQ — email features unavailable");
    }
};

module.exports = { rabbitmqConnect };