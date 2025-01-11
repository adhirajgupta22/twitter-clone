const jwt = require('jsonwebtoken');

module.exports.generateTokenAndSetCookie = (userId,res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'15d',
    });
    res.cookie("jwt",token,{
        maxAge: 15*24*60*60*1000, //15 days
        httpOnly:true, //cookie is not accessible through client side javascript
        sameSite: "strict", // cookie is not sent with cross-origin requests
        secure: process.env.NODE_ENV !== "development" //cookie is only sent over HTTPS //it is secure only in production mode
    })

}