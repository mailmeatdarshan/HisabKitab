const dotenv = require("dotenv");

dotenv.config();
module.exports = {
  PORT: process.env.PORT,
  EXPIRE_IN: process.env.EXPIRE_IN,
  SECRET_KEY: process.env.SECRET_KEY,
  MQ_URL: process.env.MQ_URL,
  MONGO_URI: process.env.MONGO_URI,
  EMAIL: process.env.EMAIL,
  GMAIL_PASS: process.env.GMAIL_PASS,
  REDIS_URL: process.env.REDIS_URL,
};
