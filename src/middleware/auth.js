import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';


/*
* @author Parth Atara
* @description : Authentication function by using JWT
*/
export const authentication = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(400).send({status: false, message: "Token not found, Please login first"})
    }
    const token = req.headers.authorization.split(" ")[1];

    //Verifying token
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        if (Date.now() > decodedToken.exp * 1000) {
            throw createHttpError.RequestTimeout("Token expired")
        }

        req.decodedToken = decodedToken
        next()

    } catch (err) {
        err.status = 401
        next(err)
    }
}


/*
* @author Parth Atara
* @description : Function to be used in different APIs for authorization based on role
*/
export const allowedRoles = (role) => {
    return async (req, res, next) => {
        const inputRole = req.decodedToken.role;

        if (!role.includes(inputRole)) {
            return res.status(403).send({message: `${inputRole} is not authorized for this resource`});
        }

        return next()
    }

}
