import {createUser, loginUser, userUpdate, inspectionManager} from '../../services/userService.js'


export const registerUser = async (req, res, next) => {
    try{
        const creatorRole = req.decodedToken.role
        const creatorId = req.decodedToken.userId
        
        const user = await createUser(req.body, creatorRole, creatorId)
        return res.status(201).json({success: true, message: 'Successfully registered', user})

    }catch(err){
        return next(err)
    }
}

export const login = async (req, res, next) => {
try{
    const userLogin = await loginUser(req.body)

    res.header('Authorization', 'Bearer' + userLogin.token)

    return res.status(200).json({success: true, message: 'Successfully logged in', userLogin})

}catch(err) { 
    return next(err) 
} 
}


export const updateUser = async (req, res, next) => {
    try{
        const creatorRole = req.decodedToken.role
        console.log(creatorRole)
        const update = await userUpdate(req.body, creatorRole)
        res.status(200).send({status: true, message: 'User updated successfully'})
    } catch(err) {
        
       return next(err);
    }
}

//get details of inspection manager
export const getInspectionManager = async (req, res, next) => {
    try {
        const payload = req.decodedToken

        const insManager = await inspectionManager(payload)

        res.status(200).send({status: true, message: 'Inspection Manager are: ', data: insManager})
    } catch (err) {
        
        return next(err);
    }
}