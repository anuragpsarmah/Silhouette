import mongoose from "mongoose"
import { ConnectionObject } from "@/types/connectionObject";
import { apiResponse } from "@/types/apiResponse";

const connection : ConnectionObject = {};

async function dbConnect(): Promise<apiResponse> {
    if(connection.isConnected){
        console.log("DB is already connected!");
        return {success: true, message: "already connected"};
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
        connection.isConnected = db.connections[0].readyState;
        console.log("DB connected successfully!");
        return {success: true, message: "newly connected"};
    } catch(error){
        console.log("DB connection failed!", error);
        process.exit(1);
    }
}

export default dbConnect;