const loginUsers = require('../modals/userlogin schema');
const otp_Verification=require('../modals/otp schema')
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





// const sendOTPverification=async ({_id,email})=>{
//     try{
//         const otp = `${Math.floor(1000+Math.random()*9000)}`;
//     } catch(error){

//     }
// }




router.post('/reset-email',async (req,res)=>{
    try{
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);


        const{ email }=req.body;

        const user = await loginUsers.findOne({email});

        if(!user){
            return res.status(404).json({message:'user not found'})
        }

        const otp = Math.random().toString(36).slice(-4)

        // res.json({message:'Success',token})

        // user.resetpasswordToken = token ;
        // user.resetpasswordExpires= Date.now() + 3600000;
        
        // await user.save()

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
            text: `your account reset token code is ${otp}`
        };
        console.log(otp)

        // const hashOTP = await bcrypt.hash(otp,10);
        const newOTPverification = otp_Verification({
            userId:user._id,
            otp:otp,
            createAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });
        console.log(otp)

        await newOTPverification.save();
        await   transporter.sendMail(message);
        res.json({
            status:"PENDING",
            message:"Verification otp mail send",
            data:{
                userId:user._id,
                email,
                otp
            }
        })
    }catch(error){
        res.json({
            status:'failed',
            message:error.message
        })
    }

    
 });





 router.post('/verifyOTP', async (req, res) => {
    try {
      const { otp } = req.body;
  
      if ( !otp) {
        res.status(400).send("empty otp is not allowed.");
      } else {
        const verify_otp = await otp_Verification.find({ otp });
  
        if (verify_otp.length <= 0) {
          res.status(400).send("No matching OTP verification record found.");
        } else {
          const { expiresAt } = verify_otp[0];
          const hashedOTP = verify_otp[0].otp;
  
          if (expiresAt < Date.now()) {

            await otp_Verification.deleteMany({ otp });
            res.status(400).send("OTP code has expired.");
          } else {

            // const validOTP = await bcrypt.compare(otp, hashedOTP);
  
            if (!otp) {

              res.status(400).send("Invalid OTP code.");
            } else {

              await loginUsers.updateOne({ _id: otp_Verification.userId }, { verified: true });
              await otp_Verification.deleteMany({ otp });
              res.status(200).json({
                status: "verified",
                message: "User email verified"
              });
            }
          }
        }
      }
    } catch (error) {
      // Handle errors appropriately
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });




// router.patch("/reset-password/:id", async (req, res) => {
//     console.log(req.body);
//     try {
//             const schema = Joi.object({
//                 password: Joi.string().required(),
//                 repassword: Joi.string().required(),});

//             const { error } = schema.validate(req.body);
//             if (error) return res.status(400).send(error.details[0].message);

//             if(req.body.password===req.body.repassword){
//                 const password=req.body

//                         const user = await loginUsers.findByIdAndUpdate(req.params.id,password, { new: true });

//                         if (!user) {
//                             return res.status(404).json({ error: "User not found" });
//                         }

//                         return res.status(200).json({ message: "Success", user });
                    
                    
//             }else{
//                 res.status(403).json({message:"password miss match"})
//                 }
//         } catch (err) {
//             console.error(err);
//             res.status(500).json({ error: "Internal server error" });
//         }
// });




router.patch("/reset-password/:id", async (req, res) => {
  console.log(req.body);

  try {
    const schema = Joi.object({
      password: Joi.string().required(),
      repassword: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { password, repassword } = req.body;

    if (password !== repassword) {
      return res.status(403).json({ message: "Passwords do not match" });
    }

    bcrypt.genSalt(10, async (err, salt) => {
      if (err) {
        return res.status(500).json({ error: "Failed to generate salt" });
      }

      bcrypt.hash(password, salt, async (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: "Failed to hash password" });
        }

        const newpassword = hashedPassword;

        try {
          const user = await loginUsers.findByIdAndUpdate(
            req.params.id,
            { password: newpassword }, // Assuming 'password' is the field in your schema
            { new: true }
          );

          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          return res.status(200).json({ message: "Password reset successful", user });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal server error" });
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;








//  router.post('/reset-pass/:token',async (req, res)=>{
//     const { token } = req.params;
//     const { password }=req.body;
//     try{
//         // res.json({message:'success'});
//         const user= await loginUsers.findOne({
//             resetpasswordToken : token,
//             resetpasswordExpires : {  $gt: Date.now() },
//         });

//          if(!user){
//             return res.status(404).json({message:'invalid token'})
//         }

//         const hashPassword= await bcrypt.hash(password,10);
//         user.password = hashPassword;  
//         user.resetpasswordToken=null;
//         user.resetpasswordExpires=null;

//         await user.save();

//         res.json({message:"password reset successfully"})
//     } catch(err){
//         res.json({
//             message:'Errpr'});
//     }
// });

module.exports=router;