import mongoose from "mongoose";
import bcrypt from "bcrypt";

const ObjectId = mongoose.Schema.Types.ObjectId;




/*
* @author Parth Atara
* @description User schema and model objects
*/

//User schema
const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            "admin", "client", "procurement manager", "inspection manager"
        ],
        default: ["client"]
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    workingUnder: {
        type: ObjectId
    },
    createdBy: {
        type: ObjectId
    }
});



// password hashing function using bcrypt
userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
    }
});


//Creating model
const User = mongoose.model("User", userSchema)

export default User
