
const User = require("../models/user.model")
const notifies = require("../models/notification.model")


const getuserprofile = async (req, res) => {
    try {
        const user = req.params.email
        console.log(user)
        const finduser = await User.findOne({ email: user }).select("-password")
        if (!finduser) {
            return res.status(400).json("user don't exist")
        }
        res.json(finduser)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const followlogic = async (req, res) => {
    try {
        const id = req.params.id
        const user = req.user.userid
        if (!id || !user) {
            return res.status(400).status("Missing User Id or followerId")
        }
        const finduser = await User.findById(id).select("-password")
        const currentuser = await User.findById(user).select("-password")
        if (!finduser || !currentuser) {
            return res.status(404).json("user don't exist")
        }
        console.log(finduser._id)
        console.log(currentuser._id)
        if (finduser._id.toString() === currentuser._id.toString()) {
            return res.status(400).json("it's not possible to follow/unfollow yourself")
        }

        const isfollowing = currentuser.following.includes(finduser._id)
        console.log("check" + isfollowing)

        if (isfollowing) {
            await User.findByIdAndUpdate(finduser._id, { $pull: { follower: currentuser._id } })
            await User.findByIdAndUpdate(currentuser._id, { $pull: { following: finduser._id } })
            res.status(200).json("unfollowed the user")


        }
        else {
            await User.findByIdAndUpdate(finduser._id, { $push: { follower: currentuser._id } })
            await User.findByIdAndUpdate(currentuser._id, { $push: { following: finduser._id } })

            const findnoti = await notifies.findOne({ from: currentuser._id })

            if (!findnoti) {

                const newnotify = new notifies({
                    from: currentuser._id,
                    to: finduser._id,
                    type: "follow"

                })
                await newnotify.save()
            }

            res.status(200).json("followed the user")

        }
    } catch (error) {
        console.error(error)
        res.status(500).json(error.message + "Internal server issue")
    }
}


const suggestuser = async (req, res) => {
    try {
       const user=req.user.userid
    
        const currentuser = await User.findById(user).select("following")
        if (!currentuser) {
            return res.status(404).json("user not found")
        }
        const sugg = await User.aggregate([{
            $match: {
               _id: {$ne: currentuser._id}
            }
        },
        { $sample: { size: 10 } }
        ])

        const filtering = sugg.filter(i => !currentuser.following.includes(i._id))

        const newsugg = filtering.slice(0, 4)
    //    const suggestuser= newsugg.forEach(i => i.password = null)
     const newsuggs=newsugg.map(i=>{
        i.password=undefined
        return i    })
    
    res.status(200).json(newsuggs)
    
} catch (error) {
        console.error(error)
        res.status(500).json(error.message + ": internal server issue")
    }   
 
  }
  const updateuser=async(req,res)=>{
    try {
        const user=req.user.userid
        const {fullname,currentpassword,newpassword,conformedpassword,name,email,bio,link }=req.body
        let {profileImg,coverImg}=req.body

        if(!user){
            return res.status(400).json("user is missing")
        }
        if(!currentpassword ||!newpassword||!conformedpassword){
             return res.status(400).json("password is missing")
        }
  if(newpassword!=conformedpassword){
    return res.status(400).json("Wrong user input")
  }
          const currentuser=await User.findById(user)
        if(!currentuser){
             res.status(404).json("User not found")
        }

        const compare=
        res.status(200).json()
    } catch (error) {
        console.error(error)
        res.status(500).json(error.message+": internal server issue")
    }

  }
module.exports = { 
    getuserprofile,
    followlogic,
    suggestuser,
    updateuser

}