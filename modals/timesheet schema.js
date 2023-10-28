

const mongoose =require('mongoose');
const Schema =mongoose.Schema;

const userSchema = new Schema({
    project:{
        type:String,
        required:true,
    },
    deadline:{
        type:String,
        required:true,   
    },
    totalHours:{
        type:Number,
        required:true,
    },
    remainingHours :{
        type:Number,
        required:true,
    },
    date:{
        type:String,
        required:true
    },
    hours:{
        type:Number,
        required:true,
    },
    discription:{
        type:String,
        required:true
    },
    
},{ tinestamps:true  
    
})

const loginUsers= mongoose.model('Timesheet',userSchema)

module.exports=loginUsers;