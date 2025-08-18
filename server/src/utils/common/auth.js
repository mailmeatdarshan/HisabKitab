const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');

function checkPassword(plain,hash){
    return bcrypt.compareSync(plain,hash);
}

function createToken(id,serectKey,expiry){
    return jwt.sign({id:id},serectKey,expiry);
}

function verifyToken(token,sercetKey){
    return jwt.verify(token,sercetKey);
      // jwt.verify gives the three things:
      // id: user id that user is login
      // iat :  kitna time hogya
      // expr : kitna time bacha h
}

module.exports={
    checkPassword,
    createToken,
    verifyToken
}