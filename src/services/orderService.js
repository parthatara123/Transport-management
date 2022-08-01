import Order from '../models/orderModel.js';
import createHttpError from 'http-errors';
import BlankChecklist from "../models/blankChecklistModel.js"
import User from '../models/userModel.js';
import mongoose from "mongoose";
const {Types} = mongoose


/*
* @author Parth Atara
* @description : Service to create new order
*/
export const createNewOrder = async (input, payload) => {
    try {

        const userByClientId = await User.findById(input.clientId)

        if (! userByClientId) {
            throw createHttpError.NotFound(`User ${input.clientId} does not exist`);
        }
        
        if (userByClientId.role !== "client") {
            throw createHttpError.NotAcceptable(`${input.clientId} is a not a clientId`);
        }

        input.createdBy = payload.userId

        const newOrder = await Order.create(input)
        return newOrder

    } catch (err) {
        throw err
    }
}


/*
* @author Parth Atara
* @description : Service to link checklist to order
*/

export const linkChecklistToOrder = async (orderId, blankChecklistId) => {
    try {

        if (!Types.ObjectId.isValid(orderId)) {
            throw new createHttpError.BadRequest("Please provide a valid order id")
        }

        if (!Types.ObjectId.isValid(blankChecklistId)) {
            throw new createHttpError.BadRequest("Please provide a valid blank checklist id")
        }

        const order = await Order.findById(orderId);

        if (! order) {
            throw createHttpError.NotFound(`Order not found by ${orderId} id`)
        }

        const blankChecklist = await BlankChecklist.findById(blankChecklistId);

        if (! blankChecklist) {
            throw createHttpError.NotFound(`Blank checklist not found by ${blankChecklistId} id`)
        }

        if (order.clientId.toString() !== blankChecklist.clientId.toString()) {
            throw new createHttpError.NotAcceptable(`This checklist can not be linked as clint is not matching`)
        }

        const updateOrder = await Order.findByIdAndUpdate({
            _id: orderId
        }, {
            $set: {
                blankChecklistId: blankChecklistId
            }
        }, {new: true})
        return updateOrder

    } catch (err) {
        throw err
    }
}



/*
* @author Parth Atara
* @description : Service to get order status by applying filter condition
*/
export const getOrders = async (orderStatus, payload) => {
    try {
        if(orderStatus){
        if (!["pending", "confirmed", "completed", "dispatched"].includes(orderStatus)) {
            throw createHttpError.BadRequest(`Invalid order status`)
        }
    }
    let condition = {status: orderStatus}
    if(payload.role === "inspection manager"){
          
        const inspectionManager = await User.findById(payload.userId)
         condition.createdBy = inspectionManager.workingUnder
       }
        const orders = await Order.find(condition).populate('filledChecklistId')
        return orders

    } catch (err) {
        throw err
    }
}



/*
* @author Parth Atara
* @description : Order verification function after filling checklist by inspection manager
*/
export const verification = (order) => {
    const {
        itemType,
        coolerRequired,
        paddingRequired,
        waterProtectionRequired,
        palletsRequired,
        sharingAllowed,
        filledChecklistId
    } = order
    const {driverDetails, requirements, category} = filledChecklistId
    const {
        cooler,
        padding,
        compartment,
        pallets,
        waterProtection
    } = requirements;

    // category should be same as itemType
    if (itemType !== category) {
        return false;
    }

    // checking all driver details are ok
    for (let key in driverDetails) {
        if (driverDetails[key] === false) {
            return false;
        }
    }

    // matching all requirements
    if (coolerRequired !== cooler || paddingRequired !== padding || waterProtectionRequired !== waterProtection || sharingAllowed !== compartment || palletsRequired !== pallets) {
        return false;
    }

    return true;
}


/*
* @author Parth Atara
* @description : Service to verify order by procurement manager
*/
export const verifyOrder = async (orderId) => {
    try {

        if (!Types.ObjectId.isValid(orderId)) {
            throw createHttpError.BadRequest("Please provide a valid order id")
        }

        const order = await Order.findById(orderId).populate('filledChecklistId');

        if (! order) {
            throw createHttpError.NotFound(`Order not found by ${orderId} id`)
        }

        if (! verification(order)) {
            return 'Some fields does not match with order requirements'
        }

        const updateVerification = await Order.findByIdAndUpdate({
            _id: orderId
        }, {
            $set: {
                isVerified: true,
                status: "confirmed"
            }
        }, {new: true})
        return updateVerification

    } catch (err) {
        throw err
    }
}



/*
* @author Parth Atara
* @description : Service to update order status
*/
export const updateStatus = async (input, status) => {
    try {

        if (!Types.ObjectId.isValid(input)) {
            throw createHttpError.NotFound(`Please provide a valid order id`)
        }

        const order = await Order.findById(input)

        if (! order) {
            throw new createHttpError.NotFound(`${input} does not exist`)
        }

        if (order.status === "confirmed" && status === "completed") {
            throw createHttpError.NotAcceptable(`can not update status as completed as order has not been dispatched`)
        }

        if (order.status === "completed") {
            throw createHttpError.NotAcceptable(`can not update completed order`)
        }

        if (order.status === status) {
            throw createHttpError.NotAcceptable(`order status is already ${status}`)
        }

        const updatedOrder = await Order.findByIdAndUpdate({
            _id: input}, {$set: {status: status}}, {new: true});
        return updatedOrder

    } catch (err) {
        throw err;
    }
}



/*
* @author Parth Atara
* @description : Service to get order status by order id
*/
export const getOrderStatus = async (orderId) => {
    try {

        if (!Types.ObjectId.isValid(orderId)) {
            throw createHttpError.NotFound(`Please provide a valid orderId`);
        }

        const order = await Order.findById(orderId).select({status: 1, _id: 0})
        if (! order) {
            throw new createHttpError.NotFound(`No order found by order Id ${orderId}`)
        }
        return order
    } catch (err) {
        throw err
    }
}
