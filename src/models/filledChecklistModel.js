import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;


/*
* @author Parth Atara
* @description : Filled checklist schema and model objects
*/

//Filled checklist schema
const filledChecklistSchema = new mongoose.Schema({
    orderId: {type : ObjectId, ref : "Order"},
    inspectedBy : {type : ObjectId, ref : "User"},
    requirements : {
    cooler : {type : Boolean},
    padding : {type : Boolean},
    compartment : {type : Boolean},
    pallets : {type : Boolean},
    waterProtection : {type : Boolean}
    },
    category : {type : String},
    driverDetails : {
        licensePresent : {type : Boolean},
        rc : {type : Boolean},
        phone : {type : Boolean},
        airPressureGood : {type : Boolean}    
    },
    halfLoadingImage : {type : String},
    fullLoadingImage : {type : String},
    summary : {type : String}
}, {timestamps : true})


//Creating model
 const FilledChecklist = mongoose.model ("filledChecklist", filledChecklistSchema)
 
 export default FilledChecklist
 