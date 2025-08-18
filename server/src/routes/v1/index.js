const express = require('express');

// const { InfoController } = require('../../controllers');

const router = express.Router();
const expanseRoutes = require('./expanse-routes');
const userRoutes = require('./user-route');
// router.get('/info', InfoController.info);
router.use('/expanses', expanseRoutes);
router.use('/auth', userRoutes);



module.exports = router;
