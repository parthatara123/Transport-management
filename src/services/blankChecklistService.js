import BlankChecklist from "../models/blankChecklistModel.js"
import User from '../models/userModel.js';
import createHttpError from 'http-errors';
import mongoose from "mongoose";
const {Types} = mongoose


/*
* @author Parth Atara
* @description : Service to create blank checklist
*/
export const checklist = async (input, payload) => {
    try {

        //user by given client id is available in DB or not
        const userByClientId = await User.findById(input.clientId)

        //Checking user by given client id is present in DB or not
        if (! userByClientId) {
            throw createHttpError.NotFound(`User ${input.clientId} does not exist`);
        }

        //checking given user id is of clint or not
        if (userByClientId.role !== "client") {
            throw createHttpError.NotAcceptable(`${input.clientId} is a not a clientId`);
        }

        //adding key createdBY to input object before saving it to DB
        input.createdBy = payload.userId

        const newChecklist = await BlankChecklist.create(input)
        return newChecklist

    } catch (err) {
        throw err
    }
}



/*
* @author Parth Atara
* @description : Service to create blank checklist
*/
export const getChecklist = async (clientId) => {

    try {
        //valid object id validation
        if (!Types.ObjectId.isValid(clientId)) {
            throw new createHttpError.BadRequest("Please provide a valid clientId")
        }

        // does client exist
        const client = await User.findById(clientId);
        if (! client) {
            throw new createHttpError.NotFound(`${clientId} does not exist`)
        }

        // does client role is valid
        if (client.role !== 'client') {
            throw new createHttpError.NotAcceptable(`${clientId} is ${
                client.role
            }`)
        }

        const checklists = await BlankChecklist.find({clientId: clientId});

        //if no checklists are available
        if (checklists.length === 0) {
            throw new createHttpError.NotFound(`Checklist not found for ${clientId}`)
        }

        return checklists

    } catch (err) {
        throw err
    }
}
