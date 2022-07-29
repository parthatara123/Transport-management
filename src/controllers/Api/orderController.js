import { createNewOrder, linkChecklistToOrder } from "../../services/orderService.js"

export const createOrder = async (req, res, next) => {
try{
    const input = req.body
    const payload = req.decodedToken

    const data = await createNewOrder(input, payload)

    res.status(201).send({status: true, data: data})
    
} catch (err) {
    next(err)
}
}



export const linkChecklist = async (req, res, next) => {
    try{
        const { orderId, blankChecklistId } = req.params
        const payload = req.decodedToken

        const updateOrder = await linkChecklistToOrder(orderId, blankChecklistId, payload)
        return res.status(200).send(updateOrder)

    }catch(err){
        next(err)
    }
}