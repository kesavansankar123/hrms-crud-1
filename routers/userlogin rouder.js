const loginUsers = require('../modals/userlogin schema');
const router=require('express').Router();
const bcrypt= require('bcrypt')
const nodemailer =require('nodemailer')
const jwt=require('jsonwebtoken')
const Joi = require('@hapi/joi')




router.route('/').get((req,res)=>{
    loginUsers.find()
    .then(loginUsers => res.json(loginUsers))
    .catch(err => res.status(400).json('error:'+err))
})



router.route('/register').post((req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required(),password:Joi.string().required(),repassword:Joi.string() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const { email } = req.body;

        if (req.body.password === req.body.repassword) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
                    const password = hashedPassword;
                    const newUser = new loginUsers({ email, password });
                    newUser.save()
                        .then(() => res.json('user added'))
                        .catch(err => res.status(400).json('error:' + err))
                })
            })
        } else {
            // Moved this line inside the 'else' block
            res.status(501).send('password mismatch');
        }
    } catch (e) {
        // Handle or log errors here
        console.error(e);
        res.status(500).send('Internal server error');
    }
});



router.route('/login').post(async (req,res)=>{
    try{
        const schema = Joi.object({ email: Joi.string().email().required(), password:Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        
        var user= await loginUsers.findOne({email:req.body.email})
        if(!user){
            return res.status(400).send('email or User not found')
        }

        var validpassword = await bcrypt.compare(req.body.password,user.password)
        if(!validpassword){
            return res.send('password incrroect')
        }
        
        res.send('login successfully')
        
    } 
    catch(e){
        
    }
   
})


router.post('/reset-email',async (req,res)=>{
    const{ email }=req.body;

    const user = await loginUsers.findOne({email});

    if(!user){
        return res.status(404).json({message:'user not found'})
    }

    const token = Math.random().toString(36).slice(-6)
    console.log(token);
    // res.json({message:'Success',token})

    user.resetpasswordToken = token ;
    user.resetpasswordExpires= Date.now() + 3600000;
     
    await user.save()

    const transporter= nodemailer.createTransport({
        service:"gmail",
        auth: {
            user: "gokulsankargokulsankar7@gmail.com",
              pass: "pidi gmli njlk kwqv "
        },

    })
    const message={
        from :'gokulsankargokulsankar7@gmail.com',
        to : user.email,
        subject : 'passreset request',
        text: `your account reset token code is ${token}`
    };

    transporter.sendMail(message,(err, info)=>{
        if(err){
            res.status(404).json({message:'somthing wen wring, try again'})
        }
        res.status(200).json({message:'password reset email send' + info.response});
    });
    
 });


 router.post('/reset-pass/:token',async (req, res)=>{
    const { token } = req.params;
    const { password }=req.body;
    try{
        // res.json({message:'success'});
        const user= await loginUsers.findOne({
            resetpasswordToken : token,
            resetpasswordExpires : {  $gt: Date.now() },
        });

         if(!user){
            return res.status(404).json({message:'invalid token'})
        }

        const hashPassword= await bcrypt.hash(password,10);
        user.password = hashPassword;  
        user.resetpasswordToken=null;
        user.resetpasswordExpires=null;

        await user.save();

        res.json({message:"password reset successfully"})
    } catch(err){
        res.json({
            message:'Errpr'});
    }
});

module.exports=router;