import mongoose from "mongoose";
// import Locals from "../config/config.js";


class Database {
// Initialize the database connection
static async init () {
    //dsn : Data source name
    const dsn = process.env.MONGOOSE_URI
try {
    const options = {
        useNewUrlParser: true
    }
    mongoose.connect(dsn, options)
    console.log("Database initialized successfully");
    
} catch (error) {
    console.log("Database connection error: " + error.message);
    }
}}

export default Database;