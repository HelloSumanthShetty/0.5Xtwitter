const notifies = require("../models/notification.model")
const postModel = require("../models/post.model")
const post = require("../models/post.model")
const user = require("../models/user.model")
const cloudinary = require("cloudinary")
const { getuserprofile } = require("./user.controller")
const createpost = async (req, res) => {
    try {
        const { text, img } = req.body
        const userid = req.user.userid
        const userfind = await user.findById(userid)
        if (!userfind) {
            return res.status(404).status("missing user")
        }
        if (!text && !img) {
            return res.status(400).json("missing input please enter text or img")
        }

        if (img) {
            const newimg = cloudinary.Uploader.upload(img)
            img = newimg.secure_url
        }

        const createpost = await post.create({
            user: userid,
            text,
            img,
        })
        res.status(201).json(createpost)
    } catch (error) {
        console.error(error)
        res.status(500).json(error.message + ": internal server issue ")
    }
}


const deletepost = async (req, res) => {
    try {
        const { id } = req.params
        const userid = req.user.userid
        const findpost = await post.findById(id)
        if (!userid) res.status(404).json("user not found")
        console.log({ lets: findpost })

        if (!findpost) {
            return res.status(404).json("sorry the post is not found")
        }
        if (userid.toString() !== findpost.user.toString()) {
            return res.status(403).json("sorry your are not autherized")
        }
        if (findpost.img) {
            const delimg = post.img.split("/").pop().split(".")[0]
            await cloudinary.Uploader.delete(delimg)
        }

        const deletepost = await post.findByIdAndDelete(findpost)

        res.status(200).json({
            successful: true,
            msg: "has been deleted successfully",
            post: deletepost
        })
    } catch (error) {
        console.error(error)
        res.status(500).json(error.message + ": internal server issue ")
    }
}

const comment = async (req, res) => {
    try {
        const id = req.params.id
        const userid = req.user.userid
        const tragetpost = await post.findById(id)
        if (!userid) {
            return res.status(404).json("sorry the user cant be found")
        }
        if (!tragetpost) return res.status(404).json("sorry could not find the post")
        const comments = await post.findByIdAndUpdate(tragetpost._id,
            { $push: { Comment: { text: req.body.text, user: userid } } },
            {
                runValidators: true,
                new: true
            })
        res.status(200).json(comments)
    }
    catch (error) {
        console.error(error)
        res.status(500).json(error.message + ": internal server issue ")
    }
}

const likeunlike = async (req, res) => {
    try {
        const { id: postid } = req.params
        const userid = req.user.userid
        if (!postid || !userid) {
            return res.status(400).status("Missing User Id or followerId")
        }
        const targetpost = await post.findById(postid)
        if (!targetpost) {
            return res.status(404).json("post info not found")
        }
        const liked = targetpost.like.includes(userid)
        console.log(liked)
        const notifyexit=await notifies.findOne({
            from:userid,
            to:targetpost.user,
            type:"like"
        })

        if (!liked) {
            await post.findByIdAndUpdate(targetpost._id, { $push: { like: userid } })
            await user.findByIdAndUpdate(userid,{$push:{likedpost:targetpost._id}})
        
            res.json("liked")
            
            const notify = new notifies(
                {
                    from: userid,
                    to: targetpost.user,
                    type: "like"
                }
            )
            await notify.save()
        }
        else {
            await post.findByIdAndUpdate(targetpost._id, { $pull: { like:userid } })
            await user.findByIdAndUpdate(userid,{$pull:{likedpost:targetpost._id}})
        if(notifyexit){
            await notifies.findByIdAndDelete(notifyexit._id)
        }
            res.json("unliked")
        }

    } catch (error) {
        console.error(error)
        res.status(500).json(error.message + ": internal server issue ")
    }
}
const getall=async(req,res)=>{
    try {
        const allpost=await post.find().sort({createdAt:-1}).populate({
            path:"user",select:"-password"
        }).populate({
            path:"Comment.user",
            select:"-password"
        })
        if(allpost.length==0){
         return res.status(200).json("no posts are available")
        }
        res.status(200).json(allpost)
    } catch (error) {
        console.error(error)
        res.status(500).json(error.message + ": internal server issue ")
    }
}
const getlikes=async(req,res)=>{
    try {
        const userid=req.params.id

    const targetuser=await user.findById(userid)
    if(!targetuser) return res.status(404).json("no user exist")
        
    const likes=await user.findOne(targetuser._id).select("likedpost").populate({
        path:"likedpost",populate:{
            path:"user",
            select:"-password"
        }
    }).populate({
        path:"likedpost",
        populate:{
            path:"Comment.user",
            select:"-password"
        }
    })
    res.json(likes)
    } catch (error) {
    console.error(error)
        res.status(500).json(error.message + ": internal server issue ")
    }
}
const getfollowingposts = async (req, res) => {
	try {
		const userId = req.user.userid;
		const users = await user.findById(userId);
		if (!users) return res.status(404).json( "User not found" );

		

		const feedPosts = await post.find({ user: { $in: users.following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "Comment.user",
				select: "-password",
			});

		res.status(200).json(feedPosts);
	} catch (error) {
		console.log("Error in getFollowingPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getuserposts = async (req, res) => {
	try {
		const { username } = req.params;

		const users = await user.findOne({name:username});
		if (!users) return res.status(404).json( "User not found" );

		const posts = await post.find({ user: users._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "Comment.user",
				select: "-password",
			});

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
module.exports = {
    createpost,
    deletepost,
    comment,
    likeunlike,
    getall,
    getlikes,
    getfollowingposts,
    getuserposts
} 