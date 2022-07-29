import {registerUserSchema, loginUserSchema, updateUserSchema} from '../schemas/joiUserSchema.js'
// import {checklistSchema} from '../schemas/joiFilledChecklistSchema.js'
import {blankChecklistSchema} from '../schemas/joiBlankCheckListSchema.js'
import { orderSchema } from '../schemas/joiOrderSchema.js';

const requestValidator = ((req, next, schema) => {

const { error, value } = schema.validate(req.body);

if (error) {
    error.status = 422; // joi error status
   return next(error);
} else {
    req.body = value;
   return next();
}
})

export const createUserSchema = (req, res, next ) => {
  const schema = registerUserSchema
  requestValidator(req, next, schema);
}

export const loginSchema = (req, res, next) => {
  const schema = loginUserSchema
  requestValidator(req, next, schema);
}

export const updateSchema = (req, res, next) => {
  const schema = updateUserSchema
  requestValidator(req, next, schema);
}

export const createOrderSchema = (req, res, next ) => {
  const schema = orderSchema
  requestValidator(req, next, schema);
}


export const createBlankChecklistSchema = (req, res, next ) => {  
  const schema = blankChecklistSchema
  requestValidator(req, next, schema);

}