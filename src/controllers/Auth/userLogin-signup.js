import {createUser, loginUser} from '../../services/userService.js'
import logger from "../../logger/logger.js";

/*
* @author Parth Atara
* @description : User registration 
* @route POST user/register
*/
export const registerUserHandler = async (req, res, next) => {
    try{
        
        const creatorRole = req.decodedToken.role
        const creatorId = req.decodedToken.userId
        
        const user = await createUser(req.body, creatorRole, creatorId)
        return res.status(201).json({success: true, message: 'Successfully registered', user})

    }catch(err){
        logger.info(err.message)
        return next(err)
    }
}


/*
* @author Parth Atara
* @description : User login
* @route POST user/login
*/
export const loginHandler = async (req, res, next) => {
try{
    const userLogin = await loginUser(req.body)

    res.header('Authorization', 'Bearer' + userLogin.token)

    // req.session.user = userLogin.user
    // req.session.save()

    return res.status(200).json({success: true, message: 'Successfully logged in', userLogin})

}catch(err) { 
    logger.info(err.message)
    return next(err) 
} 
}



/*
* @author Parth Atara
* @description User logout 
* @route GET  /user/logout
*/
export const logoutHandler =  async (req, res, next) => {
    req.session.destroy((err) => {
        if(err) {
            throw new Error(err.message);
        }
    });
   return res.clearCookie("connect.sid").end("logout success");
}