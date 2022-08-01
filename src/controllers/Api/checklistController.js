import { checklist , getChecklist} from "../../services/blankChecklistService.js"
import {fillChecklist} from "../../services/filledChecklistService.js"
import logger from "../../logger/logger.js";



/*
* @author Parth Atara
* @description : Create blank checklist
* @route POST checklist/create/blank
*/
export const createBlankChecklistHandler = async (req, res, next) => {
try{
    const input = req.body
    const payload = req.decodedToken

    const data = await checklist(input, payload)
    return res.status(201).send({status: true, data: data})
    
} catch (err) {
    logger.info(err.message);
    next(err)
}
}



/*
* @author Parth Atara
* @description : Get checklist by client id
* @route GET checklist/get/blank/:clientId
*/
export const getChecklistByClientIdHandler = async (req, res, next) => {
    try {
        const clientId = req.params.clientId;

        const data = await getChecklist(clientId);

        return res.status(200).send({status: true, numbers : data.length, data: data});
        
    } catch (err) {
        logger.info(err.message);
        next(err);
    }
}



/*
* @author Parth Atara
* @description : Create filled checklist
* @route POST checklist/register/fill/:orderId
*/
export const fillChecklistHandler = async (req, res, next) => {
    try {
        const input = req.body;
        const orderId = req.params.orderId;
        const payload = req.decodedToken;
        const image = req.files;

        const filledChecklist = await fillChecklist(input, payload, orderId, image);
        return res.status(201).send({ status: true, message: "checklist filled successfully", data: filledChecklist });
    
    } catch (err) {
        logger.info(err.message);
        next(err);
    }
}
