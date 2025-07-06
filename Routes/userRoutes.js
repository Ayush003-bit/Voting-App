
const express = require("express");
const router = express.Router();
const User = require("./../Models/user");
const {jwtAuthMiddleware, generateToken} = require("../jwt");

router.post('/signup', async (req, res)=>{

    try{
      const data = req.body // Assuming the request body contains the person data
  
      // create a new person document using Mongoose model
  
      const newUser = new User(data);
  
      // Save the newPerson to the database
  
    const response = await newUser.save();
    console.log('data saved');

      const payload = {
           id: response.id,
      }

      console.log(JSON.stringify(payload));

    const token = generateToken(payload);
    console.log("Token is : ", token);


    res.status(200).json({response: response, token: token});
    } catch(err){
          console.log(err);
          res.status(500).json({error: 'Internal Server Error'});
    }
       
     
  })


  // Login Route

    router.post('/login', async(req, res)=>{
        try{
          // Extract aadharCardNumber and password from request body
             
             const {aadharCardNumber, password} = req.body;

             // Find the user by aadharCardNumber

               const user = await User.findOne({aadharCardNumber: aadharCardNumber});

               // if user does not exist or password does not match, return error

               if(!user || !(await user.comparePassword(password))) {
                    return res.status(401).json({error: "Invalid aadharCardNumber or password"});
               }

               // generate Token

                const payload = {
                     id: user.id,
                }

                const token = generateToken(payload);

                // return token as response

                res.json({token})
        }  catch(err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error'});
        }
    });


    // Profile route

    router.get('/profile', jwtAuthMiddleware,  async (req, res)=>{
        try {
            const userData = req.user;
            console.log("User Data", userData);

            const userId = userData.id;
             const user = await User.findById(userId);

             res.status(200).json({user});
        }  catch(err) {
           console.error(err);
           res.status(500).json({ error: "Internal Server Error"});
        }
    })
     

/// Put method to modify the person

 


 


router.put('/profile/password', jwtAuthMiddleware, async(req, res)=>{
     try{
          const userId = req.user; // Extract the id from the token
          const {currentPassword, newPassword} = req.body // Extract current and new password from request body

          // Find the user by userID

          const user = await User.findById(userId);

          // if password does not match, return error

          if( !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({error: "Invalid aadharCardNumber or password"});
       }

       // Update the user's password

       user.password = newPassword;
       await user.save();



         

          console.log("Password changed ");
          res.status(200).json({message: "Password updated"});
               
     } catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Server Error'});
     }
})




module.exports = router;
