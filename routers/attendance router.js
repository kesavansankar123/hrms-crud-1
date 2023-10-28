const loginUsers = require('../modals/attendance schema');
const router=require('express').Router();
// const bcrypt= require('bcrypt')
// const genaratetoken=require('../token/token')
// const verifytoken=require('../middleware/middleware')
const nodemailer =require('nodemailer');



router.route('/').get((req,res)=>{
    loginUsers.find()
    .then(loginUsers => res.json(loginUsers))
    .catch(err => res.status(400).json('error:'+err))
})

router.route('/registration').post((req,res)=>{
    const {SNo,name,team,date,punch_in,punch_out,production,breaktime}=req.body;

    const newuser=new loginUsers({SNo,name,team,date,punch_in,punch_out,production,breaktime});
    newuser.save()
    .then(()=> res.json('user added'))
    .catch(err => res.status(400).json('error:'+err))

})
 

// router.route('/datas').get(async (req,res)=>{
//     try{
//         var users= await loginUsers.find()
//         res.json(users);
//     }catch(error) {
//         res.status(500).json({message:error.message})
//     }
// });

// router.route('/datas/:SNo').get(async (req,res)=>{
//     try{
//         var users= await loginUsers.find({SNo:req.params.SNo});
//         res.json(users);
//     }catch(error) {
//         res.status(500).json({message:error.message})
//     }
// });

router.route('/update/:id').put(async (req,res)=>{
    try{
        var users= await loginUsers.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.json(users);
    }catch(error) {
        res.status(500).json({message:error.message})
    }
});

router.route('/delete/:id').delete(async (req,res)=>{
    try{
        var users= await loginUsers.findByIdAndDelete(req.params.id)
        res.json("data is deleted");
    }catch(error) {
        res.status(500).json({message:error.message})
    }
});


module.exports=router;