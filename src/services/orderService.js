import Order from '../models/orderModel.js';
import createHttpError from 'http-errors';
import BlankChecklist from "../models/blankChecklistModel.js"
import User from '../models/userModel.js';
import mongoose from "mongoose";
const {Types} = mongoose


export const createNewOrder = async (input, payload) => {
try{
    if(payload.role === 'client' || payload.role === 'inspection manager'){
        throw createHttpError.Forbidden(`${payload.role} is not allowed to create order`)
    }

    const userByClientId = await User.findById(input.clientId)

    if(!userByClientId){
        throw createHttpError.NotFound(`User ${input.clientId} does not exist`);
    }
    if(userByClientId.role !== "client")  {

     throw createHttpError.NotAcceptable(`${input.clientId} is a not a clientId`);     
     }

     input.createdBy = payload.userId

     const newOrder = await Order.create(input)
     return newOrder

} catch (err) {
throw err
}
}


export const linkChecklistToOrder = async (orderId, blankChecklistId, payload) => {
    try{
        if(payload.role === 'client' || payload.role === 'inspection manager'){
            throw createHttpError.Forbidden(`${payload.role} is not allowed to create order`)
        }

        if(!Types.ObjectId.isValid(orderId)){
            throw new createHttpError.BadRequest("Please provide a valid order id")
        }

        if(!Types.ObjectId.isValid(blankChecklistId)){
            throw new createHttpError.BadRequest("Please provide a valid blank checklist id")
        }

        const order = await Order.findById(orderId);

        if(!order) {
            throw createHttpError.NotFound(`Order not found by ${orderId} id`)
        }

        const blankChecklist = await BlankChecklist.findById(blankChecklistId);

        if(!blankChecklist) {
            throw createHttpError.NotFound(`Blank checklist not found by ${blankChecklistId} id`)
        }

        if(order.clientId.toString() !== blankChecklist.clientId.toString()) {
            throw new createHttpError.NotAcceptable(`This checklist can not be linked as clint is not matching`)
        }

        const updateOrder = await Order.findByIdAndUpdate({_id: orderId}, {$set: {blankChecklistId: blankChecklistId}}, {new: true})
        return updateOrder

    }catch(err){
        throw err
    }
}