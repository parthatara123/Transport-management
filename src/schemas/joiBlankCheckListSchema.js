import Joi from "joi"

export const blankChecklistSchema = Joi.object({

    clientId: Joi.string().hex().length(24).required(),
    requirements : {
        cooler : Joi.valid(true, false, null),
        padding : Joi.valid(true, false, null),
        compartment : Joi.valid(true, false, null),
        pallets : Joi.valid(true, false, null),
        waterProtection : Joi.valid(true, false, null)
        },
    category: Joi.string().valid("food", "medical", "houseHolds", "electronics", "other").default(null),
    driverDetails:  Joi.object().default({
        licensePresent : null,
        rc : null,
        phone : null,
        airPressureGood : null,
    }), 
    summary : Joi.string().default(null)
})
