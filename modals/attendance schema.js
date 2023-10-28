

const mongoose =require('mongoose');
const Schema =mongoose.Schema;

const userSchema = new Schema({
    SNo:{
        type:Number,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
    },
    team:{
        type:String,
        required:true,   
    },
    date:{
        type:Date,
        required:true,
    },
    punch_in:{
        type:String,
        required:true,
    },
    punch_out :{
        type:String,
        required:true,
    },
    production:{
        type:Number,
        required:true,
    },
    breaktime:{
        type:String,
        required:true
    },

   
},{ tinestamps:true  
    
})

const loginUsers= mongoose.model('Attendance',userSchema)

module.exports=loginUsers;