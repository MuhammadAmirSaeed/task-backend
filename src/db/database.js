
import mongoose from "mongoose";

const connectdb = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // // useCreateIndex: true,
            // useFindAndModify: false
        })
        console.log("Database connected successfully")
    }
    catch(error){
        console.log("Database connection failed")
        console.log(error)
    }
}

export default connectdb