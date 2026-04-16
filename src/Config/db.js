const mongoose =require("mongoose");

const connectdb = async ()=>{
   try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected Succesfully`);
   } catch (error) {
    console.log(`Database connection is failed`, error);
    process.exit(1);
   }
};
module.exports =connectdb;