const express = require('express');
const { ExpanseController, EmailController } = require('../../controllers');
const { ExpanseMiddleware } = require('../../middlewares');
const {UserMiddleware} = require('../../middlewares');
const router = express.Router();

router.post('/', UserMiddleware.checkAuth,ExpanseMiddleware.validateExpanse, ExpanseController.createExpanses);

router.get('/', ExpanseController.getExpanses);

router.get('/filterBy', UserMiddleware.checkAuth,ExpanseController.filterExpansesByCategory);

 router.get('/summary', UserMiddleware.checkAuth,ExpanseController.getSummaryByCategory);

 router.post('/send-summary', UserMiddleware.checkAuth, EmailController.sendEmail);
module.exports = router;