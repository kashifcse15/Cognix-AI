import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        mongoose.connection.on('connected', ()=> 
            console.log('DataBase Connected SuccessFully'));
        await mongoose.connect(`${process.env.MONGODB_URI}/aibox`)
    } catch (error){
        console.log(error.message);
    }
}

export default connectDB;