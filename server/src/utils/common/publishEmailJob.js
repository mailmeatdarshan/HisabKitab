const amqp = require("amqplib");
const { ServerConfig } = require("../../config");

let connection = null;
let channel = null;

async function getChannel() {
  if (channel) return channel;

  if (!ServerConfig.MQ_URL) {
    console.warn("⚠️  RABBITMQ_URL not set — cannot publish email jobs");
    return null;
  }

  try {
    connection = await amqp.connect(ServerConfig.MQ_URL);
    channel = await connection.createChannel();
    const QUEUE = "expanseQueue";
    await channel.assertQueue(QUEUE);

    connection.on("close", () => {
      channel = null;
      connection = null;
    });

    return channel;
  } catch (error) {
    console.error("Failed to connect to RabbitMQ for publishing:", error.message);
    channel = null;
    connection = null;
    return null;
  }
}

async function publishEmailJob(data) {
  const ch = await getChannel();
  if (!ch) {
    console.warn("⚠️  Skipping email job — RabbitMQ unavailable");
    return;
  }

  const QUEUE = "expanseQueue";
  ch.sendToQueue(QUEUE, Buffer.from(JSON.stringify(data)));
}

module.exports = publishEmailJob;