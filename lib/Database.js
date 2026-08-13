import Configs from "@/config/Configs";
import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

export default async function connectToDatabase() {
    
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        
        cached.promise = mongoose.connect(Configs.getMongoDBUrl()).then(mongoose => mongoose);
    }

    try {

        cached.conn = await cached.promise;

    } catch (Error) {

        console.error("Mongoose: Database Connection Failed. Error: ", Error);

        process.exit(1);
    }

    return cached.conn;
}