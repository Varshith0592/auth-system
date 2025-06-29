import mongoose from "mongoose";

export default async function connectDB() {
    try {
        const con = await mongoose.connect(process.env.DATABASE_URL)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log("Error while connecting to db: ", error)

    }
}