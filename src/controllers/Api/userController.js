import {userUpdate, inspectionManager, getUserByRole} from '../../services/userService.js'
import logger from "../../logger/logger.js";



/*
* @author Parth Atara
* @description : Update user's workingUnder property
* @route PATCH user/update
*/
export const updateUserHandler = async (req, res, next) => {
    try{
        const userId = req.body.id
        const workingUnder = req.body.workingUnder
        const update = await userUpdate(userId, workingUnder)
        res.status(200).send({status: true, message: 'User updated successfully', data: update})

    } catch(err) {
        logger.info(err.message);
       return next(err);
    }
}



/*
* @author Parth Atara
* @description : Get details of inspection manager
* @route POST user/inspectionManager
*/

export const getInspectionManagerHandler = async (req, res, next) => {
    try {
        const payload = req.decodedToken

        const insManager = await inspectionManager(payload)
        res.status(200).send({status: true, message: 'Inspection Manager are: ', data: insManager})
   
    } catch (err) {
        logger.info(err.message);
        return next(err);
    }
}



/*
* @author Parth Atara
* @description get users by role
* @route GET /user/get
*/
export const getUserByRoleHandler = async (req, res, next) => {
    try {
        const role = req.query.role;

        const users = await getUserByRole(role);
        return res.status(200).send({status: 'true', numbers : users.length, data : users});
        
    } catch (err) {
        logger.info(err.message);
        next(err);
    }
}