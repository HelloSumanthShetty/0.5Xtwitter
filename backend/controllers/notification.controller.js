const notifies=require("../models/notification.model")

const getnotify=async(req,res)=>{
    try {
		const userId = req.user.userid;

		const notifications = await notifies.find({ to: userId }).sort({ createdAt: -1 }).populate({
			path: "from", 
			select: "name profileImg",
		});

		await notifies.updateMany({ to: userId }, { read: true });
      
		res.status(200).json(notifications);
	} catch (error) {
		console.log("Error in getNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const deletenotify=async(req,res)=>{
    try {
		const userId = req.user.userid;

		await notifies.deleteMany({ to: userId });

		res.status(200).json({ message: "Notifications deleted successfully" });
	} catch (error) {
		console.log("Error in deleteNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};



module.exports={
    getnotify,
    deletenotify
}