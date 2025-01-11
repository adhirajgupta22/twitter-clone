const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateTokenAndSetCookie } = require('../utils/generateToken');

module.exports.signup = async (req, res) => {
    try {
        const {fullName, username, email, password} = req.body;
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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password:hashedPassword
        });
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();  //saving user to database
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
        res.status(500).json({error:"Interval server error happened while signup"});
    }
}
module.exports.login = async (req, res) => {
    try {
        const {username,password} = req.body;
        const user = await User.findOne({username}); //this will return user object or null
        const validPassword = await bcrypt.compare(password,user?.password||"");  //this will rerturn true or false
        if(!user || !validPassword){
            return res.status(400).json({error:"Invalid username or password"});
        }

        generateTokenAndSetCookie(user._id,res);
        res.status(200).json(
            {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                followers: user.followers,
                following: user.following,
                coverPicture: user.coverPicture,
            }
        );

    } catch (error) {  
        console.log("Error in login controller",error.message);
        res.status(500).json({error:"Interval server error happened while login"});
    }
}
module.exports.logout = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(400).json({ error: "No token found => login to kr laude" });
        }
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal server error happened while logout" });
    }
}
module.exports.me = async (req, res) => {
    //this function is for profile page
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getme controller",error.message);
        res.status(500).json({error:"Internal server error happened while fetching user profile"});
    }
}