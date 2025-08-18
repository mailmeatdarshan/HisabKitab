const amqp = require('amqplib');
const { ServerConfig } = require('../../config');

async function publishEmailJob(data) {
  const connection = await amqp.connect(ServerConfig.MQ_URL);
  const channel = await connection.createChannel();

  const QUEUE = "expanseQueue";
  await channel.assertQueue(QUEUE);
  channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(data)));
  await channel.close();
  await connection.close();
}

module.exports = publishEmailJob;