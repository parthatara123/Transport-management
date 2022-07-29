import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

export const authentication = async (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(400).send({status:false, message:"Token not found, Please login first"})
    }
    const token = req.headers.authorization.split(" ")[1];
    
    try{
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    
        if(Date.now() > decodedToken.exp * 1000) {
            throw createHttpError.RequestTimeout("Token expired")
        }
        
        req.decodedToken = decodedToken
        next()

    }catch(err){  
        err.status = 401
        next(err)
 }
}