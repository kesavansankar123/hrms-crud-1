const express = require('express');
const loginDetails = require('./db/db');
const attendanceRouter = require('./routers/attendance router');
const leaveRouter =require("./routers/leave router")
const trainingRouter =require("./routers/training router")
const timesheetRouter =require("./routers/timesheet router")
const designationRouter =require("./routers/designation router")
const userLogin =require("./routers/userlogin rouder")




const app=express();
const port= 3000
const mongoose =require('mongoose');
require('dotenv').config();


loginDetails()

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!!')
  })

  app.use('/attendance',attendanceRouter)
  app.use('/leave',leaveRouter)
  app.use('/training',trainingRouter)
  app.use('/timesheet',timesheetRouter)
  app.use('/designation',designationRouter)
  app.use('/userlogin',userLogin)


 
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


