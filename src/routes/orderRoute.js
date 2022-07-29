import express from 'express'
import { authentication } from '../middleware/auth.js'
import { createOrder, linkChecklist } from '../controllers/Api/orderController.js'
import { createOrderSchema } from '../middleware/joiValidator.js'

const router = express.Router()

//test API routes
router.get('/test',  (req, res) =>{
    console.log("test")
    res.send('Test API order route')
})

router.post('/createOrder', createOrderSchema, authentication , createOrder)
router.put('/linkChecklist/:orderId/:blankChecklistId', authentication , linkChecklist)


export default router