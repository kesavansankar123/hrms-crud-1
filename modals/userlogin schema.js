

const mongoose =require('mongoose');
const Schema =mongoose.Schema;

const userSchema = new Schema({    
    email:{
        type :String,
        unique:true,

    },
    password:{
        type:String,
        required:true,
    },
    repassword:{
        type:String,
    

    },
   
})

const loginUsers= mongoose.model('loginUser',userSchema)

module.exports=loginUsers;