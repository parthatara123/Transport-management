import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const blankChecklistSchema = new mongoose.Schema({
    clientId: {type : ObjectId, required: true, ref : "User"},
    createdBy : {type : ObjectId, ref : "User"},
    requirements : {
    cooler : {type : Boolean},
    paddings : {type : Boolean},
    compartment : {type : Boolean},
    pallets : {type : Boolean},
    waterProtection : {type : Boolean}
    },
    category : {type : String, required: true, enum : ["food", "medical", "houseHolds", "electronics", "other"]},
    driverDetails : {
        licensePresent : {type : Boolean},
        rc : {type : Boolean},
        phone : {type : String},
        airPressureGood : {type : Boolean}    
    },
    summary : {type : String}
}, {timestamps : true})

 const blankChecklist = mongoose.model ("blankChecklist", blankChecklistSchema)

 export default blankChecklist


 const filledChecklistSchema = new mongoose.Schema({
    // clientId: {type : ObjectId, required: true, ref : "User"},
    createdBy : {type : ObjectId, ref : "User"},
    filledBy : {type : ObjectId, ref : "User"},
    isVerified : {type : Boolean, default : false},
    coolerPresent : {type : Boolean, default: false},
    category : {type : String, required: true, enum : ["food", "medical", "houseHolds"]},
    driverDetails : {
        licensePresent : {type : Boolean, default: false},
        rc : {type : Boolean, default: false},
        phone : {type : String, default: null},
        airPressureGood : {type : Boolean, default: false}    
    },
    overallSummary : {type : String, default : null}
}, {timestamps : true})

 const filledChecklist = mongoose.model ("filledChecklist", filledChecklistSchema)

//  export default filledChecklist
 