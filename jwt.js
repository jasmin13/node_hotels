const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) =>{

    // First check if request header has authorization or not
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({error : 'Token not found'});

    // Extract the token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error : 'Unathorized'});
    
    try{
        // Verify the token and return the decoded payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user information to request object
        req.user = decoded;
        next();
    }catch(error){
        console.error(error)
        res.status(401).json({error : 'Invalid token'});
    }
}

// Function to generate token

const generateToken = (userData) => {

    // Generate the new token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 300});
}

module.exports = {jwtAuthMiddleware, generateToken};
