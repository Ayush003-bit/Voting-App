
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; 
const db = require('./db');

const bodyParser  = require('body-parser');
app.use(bodyParser.json());

// Import the router files

const userRoutes = require('./Routes/userRoutes');
const candidateRoutes = require('./Routes/candidateRoutes');

// Authentication for CandidateRoutes



// Use the routers 

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);



app.listen(PORT, () => {
    console.log(`Listening to the server on port ${PORT}`);
});