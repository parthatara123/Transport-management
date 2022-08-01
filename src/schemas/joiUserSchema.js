import Joi from 'joi';


export const registerUserSchema = Joi.object({
    title : Joi.string().required().trim().valid("Mr", "Mrs", "Miss"),
    name : Joi.string().required().trim().min(3),
    role : Joi.string().required().trim().valid("admin", "client", "procurement manager", "inspection manager"),
    email : Joi.string().required().email().trim().lowercase(),
    password : Joi.string().required(),
    // .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)),
    phone : Joi.string().required().pattern(new RegExp(/^[6-9]\d{9}$/)),
    workingUnder: Joi.string().hex().length(24),
    createdBy: Joi.string().hex().length(24)
})

export const loginUserSchema = Joi.object({
    email : Joi.string().email().trim().lowercase(),
    password : Joi.string().required(),
    // .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)),
    phone : Joi.string().pattern(new RegExp(/^[6-9]\d{9}$/)),
    role : Joi.string().required().valid("admin", "client", "procurement manager", "inspection manager")
})



  