
const express = require("express");
const router = express.Router();
const Candidate = require("./../Models/candidate");
const User = require('./../Models/user');
const {jwtAuthMiddleware, generateToken} = require('../jwt');

const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);
        return user.role === "admin";
    } catch(err) {
        return false;
    }
}

// POST route to add a candidate
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({message: "User does not have admin role"});
        }
        
        const data = req.body;
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save();
        console.log('Data saved');
        res.status(200).json({response: response});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// PUT method to modify the candidate
router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({message: "User does not have admin role"});
        }

        const candidateId = req.params.candidateID;
        const updatedCandidateData = req.body;
        const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData, {
            new: true,
            runValidators: true
        })

        if (!response) {
            return res.status(404).json({error: "Candidate not found"});
        }

        console.log("Data updated");
        res.status(200).json(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// DELETE candidate
router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({message: "User does not have admin role"});
        }

        const candidateId = req.params.candidateID;
        const response = await Candidate.findByIdAndDelete(candidateId);

        if (!response) {
            return res.status(404).json({error: "Candidate not found"});
        }

        console.log("Data deleted successfully");
        res.status(200).json({message: "Candidate Data Deleted Successfully"});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// Voting route
router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {
    const candidateID = req.params.candidateID;
    const userId = req.user.id; // Make sure jwtAuthMiddleware sets req.user

    try {
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({message: "Candidate not found"});
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        } 

        if (user.isVoted) {
            return res.status(400).json({message: "You have already voted"});
        }

        if (user.role === "admin") {
            return res.status(403).json({message: "Admin is not allowed to vote"});
        }

        // Update the candidate document to record the vote
        candidate.votes.push({user: userId});
        candidate.voteCount++;
        await candidate.save();

        // Update the user document
        user.isVoted = true;
        await user.save();

        res.status(200).json({message: "Vote recorded successfully"});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
})

// Vote count
router.get('/vote/count', async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({voteCount: 'desc'});
        const voteRecord = candidates.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        });
        return res.status(200).json(voteRecord);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
})

module.exports = router;