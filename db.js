
const mongoose = require("mongoose");
require('dotenv').config();
  


// connect to mongoDB

 
//const mongoUrl =  "mongodb+srv://raghukulayush003:Shivpal9569@cluster0.mrr6c.mongodb.net/";
 const mongoUrl = process.env.MONGODB_URL_LOCAL;

// const mongoUrl = process.env.DB_URL;


mongoose.connect(mongoUrl);



// Handle Connection Event 

   const db = mongoose.connection;

  // Define event listeners for database connection


  db.on("connected", ()=>{
      console.log("Connected to MongoDB server");
  })

  db.on('error', (err)=>{
      console.error("MongoDB connection error", err);
  })

  db.on('disconnected', ()=>{
       console.log("MongoDB disconnected");
  })

  // Export database conncetion

  module.exports = db;
  
  
 