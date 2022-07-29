import BlankChecklist from "../models/blankChecklistModel.js"
import User from '../models/userModel.js';
import createHttpError from 'http-errors';


export const checklist = async (input, payload) => {
try{
    if(payload.role === 'client' || payload.role === 'inspection manager'){
        throw createHttpError.Forbidden(`${payload.role} is not allowed to create check list`)
    }

    const userByClientId = await User.findById(input.clientId)

    if(!userByClientId){
        throw createHttpError.NotFound(`User ${input.clientId} does not exist`);
    }
    if(userByClientId.role !== "client")  {

     throw createHttpError.NotAcceptable(`${input.clientId} is a not a clientId`);     
     }

     input.createdBy = payload.userId

     const newChecklist = await BlankChecklist.create(input)
     return newChecklist

} catch (err) {
throw err
}
}


export const getChecklist = async(input, payload ) => {

    try {
        if(payload.role === 'client' || payload.role === 'inspection manager') {
            throw new createHttpError.Forbidden(`${payload.role} is not allowed to create checklist`)
        }

            // does client exist
            const client = await User.findById(input);
            if(!client ) {
                throw new createHttpError.NotFound(`${input} does not exist`)
            }
            
            // does client role is valid
            if(client.role !== 'client') {
                throw new createHttpError.NotAcceptable(`${input} is ${client.role}`)
            }

            const checklists = await BlankChecklist.find({clientId : input});

            if(checklists.length === 0) {
                throw new createHttpError.NotFound(`Checklist not found for ${input}`)
            }

            return checklists

    } catch (error) {
        throw error
    }
}




// export const saveFilledChecklist = async (input, payload) => {
// try{
//     if(payload.role !== 'inspection manager'){
//         throw createHttpError.Forbidden(`${payload.role} is not allowed to fill the check list`)
//     }
//     input.filledBy = payload.userId
    
//     const newFilledChecklist = await Checklist.create(input)
//     return newFilledChecklist

// }catch (err) { 
//     throw err
// }
// }