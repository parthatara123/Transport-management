import {registerUserSchema, loginUserSchema} from '../schemas/joiUserSchema.js'
import {filledChecklistSchema} from '../schemas/joiFilledCheckListSchema.js'
import {blankChecklistSchema} from '../schemas/joiBlankCheckListSchema.js'
import {orderSchema, updateStatusSchema} from '../schemas/joiOrderSchema.js';
import logger from "../logger/logger.js";

/*
* @author Parth Atara
* @description : Joi validation for incoming request
*/
const requestValidator = ((req, next, schema) => {

    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    const {error, value} = schema.validate(req.body, options);

    if (error) {
      logger.info(error)
        error.status = 422; // joi error status
        return next(error);
    } else {
        req.body = value;
        return next();
    }
})



/*
* @author Parth Atara
* @description : Joi validation for filled checklist form data validation
*/
const formDataValidator = (req, next, schema) => {

    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };


    let requestBody = {...req.body}

    //parsing the input fields from input
    if (requestBody.requirements) {
        requestBody.requirements = JSON.parse(requestBody.requirements);
    }

    if (requestBody.driverDetails) {
        requestBody.driverDetails = JSON.parse(requestBody.driverDetails);
    }


    const {error, value} = schema.validate(requestBody, options);
    if (error) { 
      logger.info(error)
        error.status = 422; // joi error status code
        return next(error);
    } else {
        req.body = value;
        return next();
    }
}


export const createUserSchema = (req, res, next) => {
    const schema = registerUserSchema
    requestValidator(req, next, schema);
}


export const loginSchema = (req, res, next) => {
    const schema = loginUserSchema
    requestValidator(req, next, schema);
}


export const createOrderSchema = (req, res, next) => {
    const schema = orderSchema
    requestValidator(req, next, schema);
}


export const createBlankChecklistSchema = (req, res, next) => {
    const schema = blankChecklistSchema
    requestValidator(req, next, schema);

}


export const createFilledChecklistSchema = (req, res, next) => {
    const schema = filledChecklistSchema
    formDataValidator(req, next, schema);
}


export const updateOrderStatusSchema = (req, res, next) => {
    const schema = updateStatusSchema
    requestValidator(req, next, schema);
}
