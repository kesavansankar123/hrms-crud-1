

const mongoose =require('mongoose');
const Schema =mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    designation:{
        type:String,
        required:true,   
    },
    status:{ 
        type:String,
        required:true,
    },
    
   
},{ tinestamps:true  
    
})

const loginUsers= mongoose.model('designation',userSchema)

module.exports=loginUsers;