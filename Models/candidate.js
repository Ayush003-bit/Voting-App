
// create candidate model

const mongoose = require('mongoose');


// Define the candidate schema

const candidateSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

   party: {
      type: String,
      required: true
   }, 

   age: {
      type: Number,
      required: true
   },

   votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            votedAt: {
                 type: Date,
                 default: Date.now(),
            }
        }
   ],

   voteCount: {
      type: Number,
      default: 0
   }
   
 
})

// create person model

const Candidate = mongoose.model('candidate', candidateSchema);
module.exports = Candidate;