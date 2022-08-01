import Joi from "joi"

//Joi validation for each fields of filled checklist
export const filledChecklistSchema = Joi.object({

    requirements : Joi.object({
        cooler : Joi.boolean().default(false),
        padding :Joi.boolean().default(false),
        compartment : Joi.boolean().default(false),
        pallets : Joi.boolean().default(false),
        waterProtection : Joi.boolean().default(false)
        }).required(),
    category: Joi.string().valid("food", "medical", "houseHolds", "electronics", "other").required(),
    driverDetails:  Joi.object({
        licensePresent : Joi.boolean().required(),
        rc : Joi.boolean().required(),
        phone : Joi.boolean().required(),
        airPressureGood : Joi.boolean().required(),
    }).required(), 
    halfLoadingImage : Joi.string(),
    fullLoadingImage : Joi.string(),
    summary : Joi.string()
})