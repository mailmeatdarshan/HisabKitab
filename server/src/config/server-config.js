const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  PORT: process.env.PORT || 3000,
  EXPIRE_IN: process.env.EXPIRE_IN || "1h",
  SECRET_KEY: process.env.SECRET_KEY || "default_secret_change_me",
  MQ_URL: process.env.RABBITMQ_URL,
  MONGO_URI: process.env.MONGO_URI,
  EMAIL: process.env.EMAIL_USER,
  GMAIL_PASS: process.env.EMAIL_PASS,
  REDIS_URL: process.env.REDIS_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
};