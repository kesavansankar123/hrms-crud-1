

const mongoose =require('mongoose');
const Schema =mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,   
    },
    start_date:{
        type:String,
        required:true,
    },
    end_date :{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true
    },
    reason:{
        type:String,
        required:true,
    },

   
},{ tinestamps:true  
    
})

const loginUsers= mongoose.model('Leave',userSchema)

module.exports=loginUsers;