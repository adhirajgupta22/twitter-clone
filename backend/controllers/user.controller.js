const bcrypt = require('bcryptjs');
const {v2 : cloudinary} = require('cloudinary');

const notification = require('../models/notification.model');   //follow aur like pe model me add krna padega 
const User = require('../models/user.model');

module.exports.getUserProfile = async (req, res) => {
    const {username} = req.params;  //username params se hi aara h 
    try {
        const user = await User.findOne({username}).select("-password");
        if(!user) return res.status(404).json({message:"User not found"});
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserprofile controller",error.message);
        res.status(500).json({error:error.message});
    }
};
module.exports.followUnfollowUser = async (req, res) => {
    try {
        const {id} = req.params;
        const userToModify = await User.findById(id);  //user to follow or unfollow 
        const currentUser = await User.findById(req.user._id); //req will be coming from the middleware

        if(id===req.user._id.toString()){
            return res.status(400).json({error:"You can't follow unfollow yourself"});
        }
        if(!userToModify || !currentUser) return res.status(400).json({error:"user not found"});

        const isFollowing = currentUser.following.includes(id);  //id of the to be followed user and this var is going to check-> if true we are already following and if false we are not following
        if(isFollowing){
            //we will unfollow
            //unfollow the user
            await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});  //uske followers se pull kro
            await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}});  //iski following se pull kro

            res.status(200).json({message:"User unfollowed successfully"})

        }else{
            //follow the user
            await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});  //id vale user ka follower badh gya
            await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});  //jisne kiya(current user) uska following badh gya 

            //send notification to the use//creating a data in the notification model 
            const newnotification = new notification({
                type:"follow",
                from:req.user._id,
                to:userToModify._id,
            });
            await newnotification.save(); //to create a new notification data

            res.status(200).json({message:"User followed succesfully"});
        }

    } catch (error) {
        console.log("Error in followunfollowUser controller:",error.message);
        return res.status(500).json({error:error.message});
    }
};
module.exports.getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const userfollowedbyme = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match:{
                    _id:{$ne:userId}
                },
            },
            {$sample:{size:10}},
        ]);

        const filteredUsers = users.filter(user=>!userfollowedbyme.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0,4);

        suggestedUsers.forEach(user=>user.password=null);  //for each user password should be null , applied in response only
        res.status(200).json(suggestedUsers);

    } catch (error) {
        console.log("Error in getSuggestedUser controller",error.message);
        res.status(500).json({error:error.message});
    }
};
module.exports.updateUser = async (req, res) => {
    const {fullName,email,username,currentPassword,newPassword,bio,link} = req.body;
    let {profilePicture,coverPicture} =req.body;

    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if(!user) return res.status(404).json({message:"User not found"});

        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		};
        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword,user.password);  //check if present password is correct
            if(!isMatch){
                return res.status(400).json({error:"The current password is incorrect"});
            }
            if(newPassword.length()<6){
                return res.status(400).json({error:"Password must be atleast 6 characters long"});
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword,salt);
        }
        if(profilePicture){
            if(user.profilePicture){
                await cloudinary.uploader.destroy(user.profilePicture.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePicture);
            profilePicture=uploadedResponse.secure_url;
        }
        if(coverPicture){
            if(user.coverPicture){
                await cloudinary.uploader.destroy(user.coverPicture.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverPicture);
            coverPicture=uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email||user.email;
        user.username=username||user.username;
        user.bio=bio||user.bio;
        user.link=link||user.link;
        user.profilePicture=profilePicture||user.profilePicture
        user.coverPicture=coverPicture||user.coverPicture;
        
        user = await user.save();
        //password should be null in response;
        user.password = null;
        return res.status(200).json(user);

    } catch (error) {
        console.log("Error in the updateUser controller:",error.message);
        res.status(500).json({error:error.message});
    }
};
