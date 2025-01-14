const notification = require('../models/notification.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');

const {v2:cloudinary} = require('cloudinary');

module.exports.createPost = async (req,res) => {
    try {
        const {text}=req.body;
        let {img} = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({msg:"User not found"});

        if(!text && !img){   //this is true jab text aur img dono hi nhi honge
            return res.status(400).json({msg:"Post must have text or image"});
        }
        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);  //this will work with the client part
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user:userId,
            text,
            img,
        });
        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        console.log("Error in creating post controller",error);
        res.status(500).json({msg:"Internal Server Error in creating post controller"});
    }
}
module.exports.deletePost = async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({msg:"Post not found"});
        // console.log(post); post object me user ke sath user ka id hai
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({msg:"You are not authorized to delete this post"});
        }
        if(post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Post deleted successfully"});
    } catch (error) {
        console.log("Error in delete post controller",error);
        res.status(500).json({error:"Internal Server Error in delete post controller"});
    }
}
module.exports.commentOnPost = async (req,res) => {
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if(!text) return res.status(400).json({error:"Comment can't be empty"});
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error:"Post not found"});
        }
        const comment = {
            text,
            user:userId,
        };
        post.comments.push(comment);
        await post.save();

        res.status(200).json(post);

    } catch (error) {
        console.log("Error in commenting on post controller",error);
        res.status(500).json({error:"Internal Server Error in commenting on post controller"});
    }
}
module.exports.likeUnlikePost = async (req,res) => {
    try {
        const userId = req.user._id;
        const {id:postId} = req.params;
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({msg:"Post not found"});
        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){
            //unlike post
            await Post.updateOne({_id:postId},{$pull:{likes:userId}});  //pulled from oist likes array
            await User.updateOne({_id:userId},{$pull:{likedPosts:postId}});  //pulled from user likedPosts array

            const updatedLikes = post.likes.filter((id)=>id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);  //sending updatedlikes array after excluding the user id
        }else{
            //like post
            post.likes.push(userId);
            await User.updateOne({_id:userId},{$push:{likedPosts:postId}});
            await post.save();

            //new to send the notification after like 
            const Notification = new notification({
                from:userId,
                to:post.user,
                type:"like",
            })
            await Notification.save();

            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
        }
    } catch (error) {
        console.log("Error in like unlike post controller",error);
        res.status(500).json({error:"Internal Server Error in like unlike post controller"});
    }

}
module.exports.getAllPosts = async (req,res) => {
    const posts=await Post.find().sort({createdAt:-1}).populate({path:'user',select:"-password"}).populate({path:'comments.user',select:"-password"});
    if(posts.length===0) return res.status(200).json([]);
    res.status(200).json(posts);
}
module.exports.getLikedPosts = async (req,res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message:"User not found"});

        const likedPosts = await Post.find({_id:{$in:user.likedPosts}})
                            .populate({path:'user',select:"-password"})
                            .populate({path:'comments.user',select:"-password"});
                        
        res.status(200).json(likedPosts);
    } catch (error) {
        console.log("Error in get liked posts controller",error);
        res.status(500).json({error:"Internal Server Error in get liked posts controller"});
    }

}
module.exports.getFollowingPosts = async (req,res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({error:"User not found"});

    const following = user.following;
    const feedPosts = await Post.find({user:{$in:following}})
                        .sort({createdAt:-1})  //sorting of post by time ...-1 means newest appears first;
                        .populate({path:'user',select:"-password"})  //adds user object to post object
                        .populate({path:'comments.user',select:"-password"}); //adds user object to comments object

    res.status(200).json(feedPosts); //Sends the list of fetched and populated posts to the frontend.
}
module.exports.getUserPosts = async (req,res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({username});
        if(!user) return res.status(404).json({error:"User not found"});

        const posts = await Post.find({user:user._id})
                        .sort({createdAt:-1})
                        .populate({path:'user',select:"-password"})
                        .populate({path:'comments.user',select:"-password"});

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in get user posts controller",error);
        res.status(500).json({error:"Internal Server Error in get user posts controller"});
    }
}
