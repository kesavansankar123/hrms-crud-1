

const mongoose =require('mongoose');
const Schema =mongoose.Schema;

const userSchema = new Schema({
    trainingType:{
        type:String,
        required:true,
    },
    employee:{
        type:String,
        required:true,   
    },
    trainer:{
        type:String,
        required:true,
    },
    startDate :{
        type:String,
        required:true,
    },
    endDate:{
        type:String,
        required:true
    },
    discription:{
        type:String,
        required:true,
    },
    trainingCost:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true

    }
   
},{ tinestamps:true  
    
})

const loginUsers= mongoose.model('Training',userSchema)

module.exports=loginUsers;