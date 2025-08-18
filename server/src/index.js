const express = require('express');
const cors = require("cors");
const { ServerConfig, ConnectDB } = require('./config');
const apiRoutes = require('./routes');

const app = express();

// Connect to the database
ConnectDB();

// Middleware
app.use(cors({ origin: ServerConfig.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Export the app for Vercel
module.exports = app;