import { createNewOrder, linkChecklistToOrder, getOrders, verifyOrder, updateStatus, getOrderStatus } from "../../services/orderService.js"
import logger from "../../logger/logger.js";



/*
* @author Parth Atara
* @description : create order
* @route POST order/createOrder
*/
export const createOrderHandler = async (req, res, next) => {
try{
    const input = req.body
    const payload = req.decodedToken

    const data = await createNewOrder(input, payload)

    res.status(201).send({status: true, data: data})
    
} catch (err) {
    logger.info(err.message);
    next(err)
}
}



/*
* @author Parth Atara
* @description : Link blank checklist with order
* @route PATCH order/linkChecklist/:orderId/:blankChecklistId
*/
export const linkChecklistHandler = async (req, res, next) => {
    try{
        const { orderId, blankChecklistId } = req.params

        const updateOrder = await linkChecklistToOrder(orderId, blankChecklistId)
        return res.status(200).send(updateOrder)

    }catch(err){
        logger.info(err.message);
        next(err)
    }
}



/*
* @author Parth Atara
* @description : Get order details by order status
* @route GET order/get/:orderStatus
*/
export const orderByStatusHandler = async (req, res, next) => {
    try{
        const { orderStatus } = req.params

        const orders = await getOrders(orderStatus)
        return res.status(200).send(orders)

    }catch(err){
        logger.info(err.message);
        next(err)
    }
}




/*
* @author Parth Atara
* @description : update order after verification
* @route PATCH order/verify/:orderId
*/
export const orderVerificationHandler = async (req, res, next) => {
    try{
        const { orderId } = req.params

        const order = await verifyOrder(orderId)

        if(typeof order === 'string'){
            return res.status(200).send({ message: `${order}`})
        }

        return res.status(200).send({ message: 'Order verified', data: order })

    }catch(err){
        logger.info(err.message);
        next(err)
    }
}




/*
* @author Parth Atara
* @description : Update order status
* @route PATCH order/update/:orderId
*/
export const updateStatusHandler = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const status =  req.body.status;

        const update = await updateStatus(orderId, status);

        return res.status(200).send({status: true, message : "order status updated successfully", data : update});
        
    } catch (err) {
        logger.info(err.message);
        next(err);
    }
}



/*
* @author Parth Atara
* @description : Get order status by order id
* @route GET order/status/:orderId
*/
export const orderStatusHandler = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;

        const orderStatus = await getOrderStatus(orderId);
        return res.status(200).send({status: true, orderStatus: orderStatus})

    }catch(err) {
        logger.info(err.message);
        next(err)
    }
}