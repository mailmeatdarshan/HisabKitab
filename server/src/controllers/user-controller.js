const {UserService} = require('../services');
const {StatusCodes} = require('http-status-codes')
const {SuccessResponse,ErrorResponse} = require('../utils/common');



async function signUp(req,res){
    try {
        const response = await UserService.createUser({
            username:req.body.username,
            email: req.body.email,
            password:req.body.password
        })
        SuccessResponse.data = response;
        return res.status(StatusCodes.CREATED).json(SuccessResponse); 
    } catch (error) {
        console.log(error);
       ErrorResponse.error=error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

async function signin(req,res){
    try {
        const response = await UserService.signIn({
            email:req.body.email,
            password:req.body.password
        });
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse); 
    } catch (error) {
        console.log(error);
       ErrorResponse.error=error;
       
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

async function signOut(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
   const response = await UserService.logOut(token);
    SuccessResponse.data = response;
    res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.log(error)
    ErrorResponse.error = error;
    ErrorResponse.message = "Logout failed";
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}




module.exports={
    signUp,
    signin,
    signOut
}