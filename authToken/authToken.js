require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateToken = (req,res,next)=>{
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token){
        return res.status(403).json({message:"Access denied, No token provided"});
    }
    jwt.verify(token, process.env.USER_TOKEN_GENERATION, (err, decoded)=>{
        if(err){
            return res.status(403).json({message:"Invalid or expired token"});
        }
        req.user= decoded;
        next();
    }) 
}

module.exports = authenticateToken;
