
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || "your-secret-key"; // Add fallback if env is not set

const jwtAuthMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({ error: "Token not found" });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        // ✅ Attach the user info to `req.user` (IMPORTANT)
        req.user = decoded;

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: "Invalid Token" });
    }
}

// Function to generate JWT Token
const generateToken = (userData) => {
    const payload = {
        id: userData.id || userData._id, // Use _id if using MongoDB
        role: userData.role
    }

    return jwt.sign(payload, secretKey, { expiresIn: '1d' });
}

module.exports = { jwtAuthMiddleware, generateToken };


