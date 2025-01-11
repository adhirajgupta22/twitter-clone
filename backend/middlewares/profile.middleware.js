const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.ProfileMiddleware = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;  //getting token from cookies
        if(!token){
            return res.status(401).json({error:"Unauthorized: No token found"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET); //verifying token
        //this is the format of decoded object
        // {
        //     userId: '67826fa9c4f7f9dccd89bf1b',
        //     iat: 1736617205,
        //     exp: 1737913205
        // }
        if(!decoded){
            return res.status(401).json({error:"Unauthorized user:Invalid token"});
        }

        const user = await User.findById(decoded.userId).select("-password"); //getting user from db
        if(!user){
            return res.status(401).json({error:"Unauthorized: No user found"});
        }
        req.user = user;  //setting user in req object
        next();  //calling next middleware

    } catch (error) {
        console.log("Error in profile middleware",error.message);
        res.status(500).json({error:"Internal server error in profile middleware"});
    }
}