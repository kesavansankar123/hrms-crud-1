const loginUsers = require('../modals/designation schema');
const router=require('express').Router();
 const nodemailer =require('nodemailer')



router.route('/').get((req,res)=>{
    // res.send('leave applying page!')
    loginUsers.find()
    .then(loginUsers => res.json(loginUsers))
    .catch(err => res.status(400).json('error:'+err))
})

router.route('/registration').post((req,res)=>{
    const {name,designation,status}=req.body;

    const newuser=new loginUsers({name,designation,status});
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

router.route('/datas/:name').get(async (req,res)=>{
    try{
        var users= await loginUsers.find({name:req.params.name});
        res.json(users);
    }catch(error) {
        res.status(500).json({message:error.message})
    }
});

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