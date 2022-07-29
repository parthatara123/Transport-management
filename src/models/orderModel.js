import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema({
    clientId: {type : ObjectId, ref : "User"},
    createdBy : {type : ObjectId, ref : "User"},
    status : {type : String},
    blankChecklistId : {type : ObjectId, ref : "BlankChecklist"},
    filledChecklistId : {type : ObjectId, ref : "FilledChecklist"},
    isVerified: {type : Boolean},
    items : {type : Number},
    itemType : {type : String},
    itemDetails : {type : String},
    coolerRequired : {type : Boolean},
    paddingRequired : {type : Boolean},
    waterProtectionRequired : {type : Boolean},
    palletsRequired : {type : Boolean},
    sharingAllowed : {type : Boolean},
    deliveryTo : {type : String},
    pickUpFrom : {type : String},
}, {timestamps : true})

const Order = mongoose.model ("Order", orderSchema)

export default Order