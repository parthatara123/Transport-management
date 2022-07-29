import Joi from "joi"

export const orderSchema = Joi.object({
    clientId: Joi.string().hex().length(24).required(),
    createdBy : Joi.string().hex().length(24),
    status : Joi.string().default("pending"),
    blankChecklistId : Joi.string().hex().length(24),
    filledChecklistId : Joi.string().hex().length(24),
    isVerified: Joi.boolean().default(false),
    items : Joi.number().min(1).required(),
    itemType : Joi.string().valid("food", "medical", "houseHolds", "electronics", "other").required(),
    itemDetails : Joi.string().required(),
    coolerRequired : Joi.boolean().default(false),
    paddingRequired : Joi.boolean().default(false),
    waterProtectionRequired : Joi.boolean().default(false),
    palletsRequired : Joi.boolean().default(false),
    sharingAllowed : Joi.boolean().default(false),
    deliveryTo : Joi.string().required().min(3),
    pickUpFrom : Joi.string().required().min(3)
})
