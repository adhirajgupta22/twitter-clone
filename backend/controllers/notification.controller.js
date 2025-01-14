const Notification = require('../models/notification.model');

module.exports.getNotifications = async (req,res) => {
    try {
        const userId = req.user._id;
        const Notifications = await Notification.find({to:userId})
                    .populate({
                        path:"from",
                        select:"username profilePicture",
                    });

        await Notification.updateMany({to:userId},{read:true});
        res.status(200).json(Notifications);
    } catch (error) {
        console.log("Error in get notifications controller",error);
        res.status(500).json({error:"Internal Server Error in get notifications controller"});
    }
}
module.exports.deleteNotifications = async (req,res) => {
    try {
        const userId = req.user._id;
        await Notification.deleteMany({to:userId});
        res.status(200).json({message:"Notifications deleted successfully"});
    } catch (error) {
        console.log("Error in delete notifications controller",error);
        res.status(500).json({error:"Internal Server Error in delete notifications controller"});
    }
}