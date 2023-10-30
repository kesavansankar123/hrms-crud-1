const mongoose =require('mongoose');
const Schema =mongoose.Schema;

const OTP_Verification = new Schema({
    userId:{
     type:String,
    },
    otp:{
     type:String
    },
    createdAt:{
     type:Date
    },
    expiresAt:{
     type:Date
    }
 }, { timestamps: true });
 
 // Create a model based on the schema
 const otp_Verification = mongoose.model('OTPverification', OTP_Verification);

 module.exports=otp_Verification;