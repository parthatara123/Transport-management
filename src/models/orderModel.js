import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;


/*
* @author Parth Atara
* @description : Order schema and model objects
*/


//Order schema
const orderSchema = new mongoose.Schema({
    clientId: {type : ObjectId, ref : "User"},
    createdBy : {type : ObjectId, ref : "User"},
    status : {type : String},
    blankChecklistId : {type : ObjectId, ref : "blankChecklist"},
    filledChecklistId : {type : ObjectId, ref : "filledChecklist"},
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


//Creating model
const Order = mongoose.model ("Order", orderSchema)

export default Order