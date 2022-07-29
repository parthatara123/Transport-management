import User from '../models/userModel.js';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

const canCreateUser = (inputRole, creatorRole) =>{
    if(creatorRole === 'admin'){
        return true;
}

if(creatorRole === 'client' || creatorRole === 'inspection manager'){
return false
}

if(creatorRole === 'procurement manager'){
    if(inputRole === 'client' || inputRole === 'inspection manager') return true
    return false
}
}

export const createUser = async (input, creatorRole, creatorId) => {
    try {
        
        if(!canCreateUser(input.role, creatorRole)){
            throw createHttpError.Forbidden(`${creatorRole} is not allowed to create ${input.role}`)
        }

        // verify email and phone number are unique
        const isEmailExist = await User.findOne({ email: input.email });

        if(isEmailExist){
          throw createHttpError.NotAcceptable('Email already exists');
        }
        const isPhoneNumberExist = await User.findOne({ phone: input.phone });

        if(isPhoneNumberExist){
            throw createHttpError.NotAcceptable('Phone number already exists');
        }
        // const user = new User(input)
        // input.password = user.generateHash(user.password) 
        input.createdBy = creatorId

        if(creatorRole === 'admin' && input.role === 'inspection manager'){
            if(input.workingUnder === undefined){
                input.workingUnder = creatorId
            }else{
                console.log(input.workingUnder)
                const user = await User.findById(input.workingUnder).select({role:1})

                if(!user){
                    throw createHttpError.NotFound(`No user is registered by this working under ${input.workingUnder} id`)
                }

                if(user.role !== "procurement manager"){
                    throw createHttpError.NotAcceptable(`${input.role} can not be assigned to ${user.role}`)
                }
            }
        }

        if (creatorRole === "procurement manager" && input.role === "inspection manager") {
            if (input.workingUnder) {
              const user = await User.findById(input.workingUnder).select({role: 1});
              
              if (!user) throw createHttpError.NotFound(`No user exits with ${input.workingUnder} ID`);
              
              if (user.role !== "procurement manager") throw createHttpError.NotAcceptable(`${input.role} can not be assigned to ${user.role}`);
            } else {
              input.workingUnder = creatorId;
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


export const loginUser = async (input)=> {
    try {
        //will check in database by using role
        const condition = {}

        // checking role while login
        if(input.role === 'inspection manager') {
            if(input.phone === undefined) {
                throw createHttpError.BadRequest('inspection manager login requires phone number');
            }
            condition.phone = input.phone
        }else{
            if(input.email === undefined) {
                throw createHttpError.BadRequest(`${input.role} login requires email address`)
            }
            condition.email = input.email
        }

        //checking existing user by condition
        const user = await User.findOne(condition);

        if(!user){
            throw new createHttpError.NotFound(`${Object.keys(condition)[0]} does not exist`);
        }

    // Comparing the hashed password
    const result = await bcrypt.compare(input.password, user.password);

    if(!result)  throw createHttpError.Forbidden("Invalid password");

            const payload = {
                userId : user._id.toString(),
                role : user.role
            }
    
            const secret = process.env.JWT_SECRET
            const expiry = {expiresIn : process.env.JWT_EXPIRY}
    
            const token = jwt.sign(payload, secret, expiry)
            
            // masking user password and role
            user.password = undefined;
    
             let obj =   {token: token, user : user}
             return obj


    } catch (err) {
        throw err
    }
}


export const userUpdate = async (input, creatorRole) => {
    try {
      if(creatorRole !== 'admin') throw createHttpError.Forbidden('Only admin can update the user')
  
      if(input.role !== 'inspection manager') throw createHttpError.Forbidden(`${input.role} profile can not be updated`)
  
      const user = await User.findById(input.id).select({role:1, workingUnder:1})
  
      if(!user) throw createHttpError.NotFound(`No user exits with ${input.id} ID`);
  
      if(user.role !== input.role) throw createHttpError.NotAcceptable(`${user.role} does not match with ${input.role}`)
  
    const userByWorkingUnder = await User.findById(input.workingUnder).select({role: 1});
          
    if (!userByWorkingUnder) throw createHttpError.NotFound(`No user exits with ${input.workingUnder} ID`);
          
    if (userByWorkingUnder.role !== "procurement manager" && userByWorkingUnder.role !== "admin") throw createHttpError.NotAcceptable(`${input.role} can not be assigned to ${userByWorkingUnder.role}`);
    
      if(user.workingUnder === input.workingUnder ) throw createHttpError.NotAcceptable(`user is already working under same manager`)
  
      const updateUser = await User.findOneAndUpdate({_id: input.id}, {$set: {workingUnder: input.workingUnder}}, {new: true})
      
      return updateUser
    } catch(err) {
      throw (err)
    }
  };

  //To get inspection manager information
  export const inspectionManager = async (payload) => {
    try {
  
      if(payload.role === 'inspection manager' || payload.role === 'client') {
        throw createError.Forbidden(`${payload.role} is not authorized to get Inspection Manager list`)
      }
      else if(payload.role === 'admin'){
        const inspManger = await User.find({role: 'inspection manager'})
        if(!inspManger) throw createError.NotFound('No Inspection Manager exits')
        return inspManger
      } else {
        console.log(payload.userId)
        const managerIns = await User.find({role: 'inspection manager', workingUnder: payload.userId})
        if(!managerIns) throw createError.NotFound(`No Inspection Manager is assigned to this ${payload.role}`)
        return managerIns
      }
    } catch (err) {
      logger.info(err.message);
      throw(err)
    }
  }