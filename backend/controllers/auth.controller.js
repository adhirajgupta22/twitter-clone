const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateTokenAndSetCookie } = require('../utils/generateToken');

module.exports.signup = async (req, res) => {
    try {
        const {fullname, username, email, password} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}
        const existingUser= await User.findOne({username});
        if(existingUser){
            return res.status(400).json({error: "Username already exists"});
        }
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({error:"Email already exists"})
        }
        
        if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}
        const salt = bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password:hashedPassword
        });
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();
            res.status(201).json(
                {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    username: newUser.username,
                    email: newUser.email,
                    profilePicture: newUser.profilePicture,
                    followers: newUser.followers,
                    following: newUser.following,
                    coverPicture: newUser.coverPicture,
                }
            );
        }else{
            res.status(400).json({error: "Invalid user data"});
        }

    } catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({error:"Interval server error happened while creating new user"});
    }
}
module.exports.login = async (req, res) => {

}
module.exports.logout = async (req, res) => {

}
module.exports.me = async (req, res) => {
    //this function is for profile page


}