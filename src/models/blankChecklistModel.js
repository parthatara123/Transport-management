import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;


/*
* @author Parth Atara
* @description : Filled checklist schema and model objects
*/

//Blank checklist schema
const blankChecklistSchema = new mongoose.Schema({
    clientId: {type : ObjectId, ref : "User"},
    createdBy : {type : ObjectId, ref : "User"},
    requirements : {
    cooler : {type : String},
    padding : {type : String},
    compartment : {type : String},
    pallets : {type : String},
    waterProtection : {type : String}
    },
    category : {type : String},
    driverDetails : {
        licensePresent : {type : String},
        rc : {type : String},
        phone : {type : String},
        airPressureGood : {type : String}    
    },
    halfLoadingImage : {type : String},
    fullLoadingImage : {type : String},
    summary : {type : String}
}, {timestamps : true})


//Creating model
 const BlankChecklist = mongoose.model ("blankChecklist", blankChecklistSchema)

 export default BlankChecklist
