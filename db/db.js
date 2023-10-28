const express = require('express');
const Mongoose =require('mongoose');
const loginUsers = require('../modals/attendance schema');
// const url ="mongodb+srv://admin:gokul@mern.sqrvp1s.mongodb.net/?retryWrites=true&w=majority"
// const url="mongodb://127.0.0.1:27017/employee"

 function loginDetails() {
    Mongoose.connect(process.env.url) 

    Mongoose.connection.once('open',()=>{
        console.log('connected success');
        // async function users(){
        //     const loginUsersDetails= loginUsers.create({
        //         username:"gokul",            
        //         password:"gokul12"               
        //     })
        // }
        // users()
    })
}

module.exports=loginDetails;
