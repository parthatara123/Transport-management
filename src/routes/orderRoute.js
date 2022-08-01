import express from 'express'
import {authentication, allowedRoles} from '../middleware/auth.js'
import {
    createOrderHandler,
    linkChecklistHandler,
    orderByStatusHandler,
    orderVerificationHandler,
    updateStatusHandler,
    orderStatusHandler
} from '../controllers/Api/orderController.js'
import {createOrderSchema, updateOrderStatusSchema} from '../middleware/joiValidator.js'

const router = express.Router()

//API to create order
router.post('/createOrder', createOrderSchema, authentication, allowedRoles(["admin", "procurement manager"]), createOrderHandler)

//API to link blank checklist in order
router.patch('/linkChecklist/:orderId/:blankChecklistId', authentication, allowedRoles(["admin", "procurement manager"]), linkChecklistHandler)

//API to get order by order status
router.get('/get/:orderStatus', authentication, allowedRoles(["admin", "procurement manager"]), orderByStatusHandler)

//API to update verify key in order
router.patch('/verify/:orderId', authentication, allowedRoles(["procurement manager"]), orderVerificationHandler)

//API to update order status
router.patch('/update/:orderId', updateOrderStatusSchema, authentication, allowedRoles(["admin", "procurement manager"]), updateStatusHandler)

// Get order status by orderId
router.get('/status/:orderId', authentication, orderStatusHandler)

//get orders for inspection manager

export default router
