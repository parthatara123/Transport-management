import User from '../models/userModel.js';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'


/*
* @author Parth Atara
* @description : checking whether logged in user can create a new user
*/
const canCreateUser = (inputRole, creatorRole) => {
    if (creatorRole === 'admin') {
        return true;
    }

    if (creatorRole === 'client' || creatorRole === 'inspection manager') {
        return false
    }

    if (creatorRole === 'procurement manager') {
        if (inputRole === 'client' || inputRole === 'inspection manager') {
            return true
        }
        return false
    }
}

/*
* @author Parth Atara
* @description : Service for creating new users
*/

export const createUser = async (input, creatorRole, creatorId) => {
try {

        if (! canCreateUser(input.role, creatorRole)) {
            throw createHttpError.Forbidden(`${creatorRole} is not allowed to create ${input.role}`)
        }

        // verify email and phone number are unique
        const isEmailExist = await User.findOne({email: input.email});

        if (isEmailExist) {
            throw createHttpError.NotAcceptable('Email already exists');
        }
        const isPhoneNumberExist = await User.findOne({phone: input.phone});

        if (isPhoneNumberExist) {
            throw createHttpError.NotAcceptable('Phone number already exists');
        }
       
        input.createdBy = creatorId

        if (input.workingUnder) {
          const user = await User.findById(input.workingUnder);

          if (!user) {
              throw createHttpError.NotFound(`No user exits with ${input.workingUnder} ID`);
          }

          if (user.role !== "procurement manager") {
              throw createHttpError.NotAcceptable(`${input.role} can not be assigned to ${user.role}`);
          }
        }

        if ((creatorRole === 'admin' || creatorRole === 'procurement manager') && input.role === 'inspection manager') {
            if (input.workingUnder === undefined) {
                input.workingUnder = creatorId
            }
        }
      
        const newUser = await User.create(input)

        // masking password
        newUser.password = undefined;
        return newUser

    } catch (err) {
        throw err
    }
}




/*
* @author Parth Atara
* @description : Service for login
*/
export const loginUser = async (input) => {
    try { // will check in database by using role
        const condition = {}

        // checking role while login
        if (input.role === 'inspection manager') {
            if (input.phone === undefined) {
                throw createHttpError.BadRequest('inspection manager login requires phone number');
            }
            condition.phone = input.phone
        } else {
            if (input.email === undefined) {
                throw createHttpError.BadRequest(`${
                    input.role
                } login requires email address`)
            }
            condition.email = input.email
        }

        // checking existing user by condition
        const user = await User.findOne(condition);

        if (! user) {
            throw new createHttpError.NotFound(`${
                Object.keys(condition)[0]
            } does not exist`);
        }

        // Comparing the hashed password
        const result = await bcrypt.compare(input.password, user.password);

        if (! result) 
            throw createHttpError.Forbidden("Invalid password");
        

        const payload = {
            userId: user._id.toString(),
            role: user.role
        }

        const secret = process.env.JWT_SECRET
        const expiry = {
            expiresIn: process.env.JWT_EXPIRY
        }

        const token = jwt.sign(payload, secret, expiry)

        // masking user password and role
        user.password = undefined;

        let obj = {
            token: token,
            user: user
        }
        return obj

    } catch (err) {
        throw err
    }
}



/*
* @author Parth Atara
* @description : Service to update inspection manager's workingUnder property 
*/
export const userUpdate = async (userId, workingUnder) => {
    try {

        //checking if user exists by input id or not
        const user = await User.findById(userId)
        console.log(user)
        if (! user) {
            throw createHttpError.NotFound(`No user exits with ${userId} ID`);
        }

        //Checking if the user role and input roles are matching
        if (user.role !== "inspection manager") {
            throw createHttpError.NotAcceptable(`Can not update ${user.role}'s working under property`)
        }

        const userByWorkingUnder = await User.findById(workingUnder);

        if (! userByWorkingUnder) 
            throw createHttpError.NotFound(`No user exits with ${workingUnder} ID`);
        
        if (userByWorkingUnder.role !== "procurement manager" && userByWorkingUnder.role !== "admin") 
            throw createHttpError.NotAcceptable(`${user.role} can not be assigned to ${userByWorkingUnder.role}`);
        
        if (user.workingUnder.toString() === userByWorkingUnder._id.toString()) {
            throw createHttpError.NotAcceptable(`user is already working under same manager`)
        }

        const updateUser = await User.findOneAndUpdate({
            _id: userId}, {$set: {workingUnder: workingUnder}}, {new: true})

        return updateUser
    } catch (err) {
        throw(err)
    }
};


/*
* @author Parth Atara
* @description : Service for get inspection manager information
*/
export const inspectionManager = async (payload) => {
    try {

        if (payload.role === 'inspection manager' || payload.role === 'client') {
            throw createError.Forbidden(`${payload.role} is not authorized to get Inspection Manager list`)
        } else if (payload.role === 'admin') {
            const inspManger = await User.find({role: 'inspection manager'})
            if (! inspManger) {
                throw createError.NotFound('No Inspection Manager exits')
            }
            return inspManger
        } else {
            const managerIns = await User.find({role: 'inspection manager', workingUnder: payload.userId})
            if (! managerIns) {
                throw createError.NotFound(`No Inspection Manager is assigned to this ${payload.role}`)
            }
            return managerIns
        }
    } catch (err) {
        throw(err)
    }
}


/*
* @author Parth Atara
* @description : Service for get all users by role
*/
export const getUserByRole = async (input) =>{
  try {

      if(!["admin", "client", "procurement manager", "inspection manager"].includes(input)){
          throw new createHttpError.BadRequest("Invalid role")
      }

      const users = await User.find({role : input});

      if(users.length === 0){
          throw new createHttpError.NotFound(`No users found of ${input} role`)
      }

      return users;
  } catch (err) {
    throw err
  }
}