const AppErrors = require('../utils/errors/app-errors');
const {UserRepository} = require('../repositories');
const { default: mongoose } = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const {Auth}= require('../utils/common');
const ServerConfig = require('../config/server-config');
const redisClient = require('../config/redis-client-config');
const userRepo = new UserRepository();



async function createUser(data){
    try {
        const user = await userRepo.create(data);
            return user;
    } catch (error) {
        let explaination = [];
    
       if(error instanceof mongoose.Error.ValidationError){
        Object.values(error.errors).map(err => {
            const result = {
                field: err.path,
                message:err.message
            };
            return explaination.push(result);
        })

        throw new AppErrors(explaination, StatusCodes.BAD_REQUEST);
      
       }

       // Duplicate Value
       if(error.name == 'MongoServerError' && error.errorResponse.code == 11000){ 
       throw new AppErrors('Duplicate email found. Please enter unique email', StatusCodes.CONFLICT);
       }
      
       
        throw new AppErrors("Something went wrong in the User-service: createUser", StatusCodes.INTERNAL_SERVER_ERROR);
        
    }
}


async function signIn(data){
    try {
        const userResponse = await userRepo.getUserByEmail(data.email);
        if(!userResponse){
            throw new AppErrors("user is not found for given email", StatusCodes.BAD_REQUEST)
        }
       
        const userPassword = data.password;
        const encryptPassword = userResponse.password;
        const isPasswordMatch = Auth.checkPassword(userPassword,encryptPassword);
       
        if(!isPasswordMatch){
            throw new AppErrors("Password is mismatched or incorrect!", StatusCodes.BAD_REQUEST);
        }

        const jwtToken = Auth.createToken({id:userResponse.id}, ServerConfig.SECRET_KEY, {expiresIn: ServerConfig.EXPIRE_IN});
       const decoded = Auth.verifyToken(jwtToken, ServerConfig.SECRET_KEY);
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        await redisClient.setEx(`auth:${jwtToken}`, ttl, JSON.stringify(decoded));
        return jwtToken;
    } catch (error) {
        console.log(error);
        throw error;
        
    }
}


async function isAuthenicated(token){
    try {
        if (!token) {
            throw new AppErrors('JWT token is missing', StatusCodes.UNAUTHORIZED);
        }
        const cachedToken = await redisClient.get(`auth:${token}`);
        console.log(cachedToken)
       const response = JSON.parse(cachedToken);
        if (!response) {
            throw new AppErrors('JWT token is expired or invalid', StatusCodes.UNAUTHORIZED);
        }
        const user = await userRepo.get(response.id.id);
        if (!user) {
            throw new AppErrors("user is not found", StatusCodes.BAD_REQUEST);
        }
        return response;

    } catch (error) {
        console.log(error);
        if (error.name === 'JsonWebTokenError') {
            throw new AppErrors('Invalid JWT Token', StatusCodes.BAD_REQUEST);
        }
        if (error.name === 'TokenExpiredError') {
            throw new AppErrors('JWT token Expired', StatusCodes.UNAUTHORIZED);
        }
        throw error;
    }
}

async function logOut(token){
    try {
        if (!token) {
            throw new AppErrors('JWT token is missing', StatusCodes.UNAUTHORIZED);
        }
        const cachedToken = await redisClient.get(`auth:${token}`);
        if (!cachedToken) {
            throw new AppErrors('JWT token is expired or invalid', StatusCodes.UNAUTHORIZED);
        }
        await redisClient.del(`auth:${token}`);
        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports={
    createUser,
    signIn,
    isAuthenicated,  
    logOut 
}