import mongoose from "mongoose";
import {DB_NAME} from '../constants.js'
const connectMongoDB=async()=>{
    try {
        const connectedInstant=await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`MongoDB connected sucessfully DB HOST!! ${connectedInstant.connection.host}`)
    } catch (error) {
        console.error("Error occured while connecting with database");
    }
}
export {connectMongoDB}