const express = require('express');
const {UserController} = require('../../controllers')
const {UserMiddleware} = require('../../middlewares')
const router = express.Router();


router.post('/signup', UserMiddleware.validateUser ,UserController.signUp);

router.post('/signin', UserController.signin);

router.post('/signout', UserMiddleware.checkAuth, UserController.signOut);
router.get('/validate',UserMiddleware.checkAuth, function ex(req,res){
    return res.send( {data : req.user});
})

module.exports = router;



