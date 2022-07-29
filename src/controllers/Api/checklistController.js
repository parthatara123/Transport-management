import { checklist , getChecklist} from "../../services/checklistService.js"
import createHttpError from 'http-errors'
import mongoose from "mongoose";
const {Types} = mongoose

export const createBlankChecklist = async (req, res, next) => {
try{
    const input = req.body
    const payload = req.decodedToken

    const data = await checklist(input, payload)

    res.status(201).send({status: true, data: data})
    
} catch (err) {
    next(err)
}
}

export const getChecklistByClientId = async (req, res, next) => {
    try {
        const payload = req.decodedToken;
        const clientId = req.params.clientId;

        if(!Types.ObjectId.isValid(clientId)){
            throw new createHttpError.BadRequest("Please provide a valid clientId")
        }

        const data = await getChecklist(clientId, payload);

        return res.status(200).send({status: true, numbers : data.length, data: data});
        
    } catch (error) {
        next(error);
    }
}











// export const fillChecklist = async (req, res, next) => {    
// try{
//     const input = req.body
//     const payload = req.decodedToken

//     const data = await saveFilledChecklist(input, payload)

//     res.status(200).send({status: true, data: data})
    
// } catch (err) {
//     next(err)
// }
// }