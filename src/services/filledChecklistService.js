import FilledChecklist from "../models/filledChecklistModel.js"
import Order from '../models/orderModel.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
const {Types} = mongoose
import {uploadFile} from '../providers/aws.js'

/*
* @author Parth Atara
* @description : Service to fill checklist
*/
export const fillChecklist = async (input, payload, orderId, image) => {
    try {

        if (image.length === 0 || !image) {
            throw new createHttpError.BadRequest("image is required");
        }

        //Image format validation
        const regexForMimeTypes = /image\/png|image\/jpeg|image\/jpg/;

        const validImageType = image.filter((x) => regexForMimeTypes.test(x.mimetype) === false)

        if (validImageType.length > 0) {
            throw new createHttpError.BadRequest(`${
                validImageType[0].fieldname
            } is not a valid image type`);
        }

        if (!Types.ObjectId.isValid(orderId)) {
            throw new createHttpError.BadRequest(`${orderId} is not a valid order id`)
        }

        // validate orderId
        const order = await Order.findById(orderId);

        if (! order) {
            throw new createHttpError.NotFound(`Order ${orderId} not found`);
        }
        
        // upload image to aws
        if (image[0].fieldname === "halfLoadingImage") {
            const halfLoadingImageUrl = await uploadFile(image[0]);
            const fullLoadingImageUrl = await uploadFile(image[1]);
            input.halfLoadingImage = halfLoadingImageUrl;
            input.fullLoadingImage = fullLoadingImageUrl;
        } else {
            const halfLoadingImageUrl = await uploadFile(image[1]);
            const fullLoadingImageUrl = await uploadFile(image[0]);
            input.halfLoadingImage = halfLoadingImageUrl;
            input.fullLoadingImage = fullLoadingImageUrl;
        }

        // adding inspection manager id
        input.inspectedBy = payload.userId

        // adding image url
        const checklist = await FilledChecklist.create(input);

        // adding filled checklist to order
        const allFillChecklistToOrder = await Order.findByIdAndUpdate({
            _id: orderId
        }, {
            $set: {
                filledChecklistId: checklist._id
            }
        })

        return checklist;

    } catch (err) {
        throw err;
    }

}
