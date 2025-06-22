
const User = require("../models/user.model")
const notifies = require("../models/notification.model")
const bcrypt = require("bcrypt")
const cloudinary = require("cloudinary").v2
const validator = require("validator")
const jwt = require("jsonwebtoken")

require("dotenv").config()

const getuserprofile = async (req, res) => {
    try {
        const user = req.params.username
        //console.log(user)
        const finduser = await User.findOne({ name: user }).select("-password")
        if (!finduser) {
            return res.status(400).json("user don't exist")
        }
        res.json(finduser)
    } catch (error) {
        res.status(500).json({ error: error.message })
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
        //console.log(finduser._id)
        //console.log(currentuser._id)
        if (finduser._id.toString() === currentuser._id.toString()) {
            return res.status(400).json("it's not possible to follow/unfollow yourself")
        }

        const isfollowing = currentuser.following.includes(finduser._id)
        //console.log("check" + isfollowing)
        const findnoti = await notifies.findOne({
            from: currentuser?._id,
            to: finduser._id,
            type: "follow"
        })
        //console.log("check" + findnoti)
        if (isfollowing) {

            await User.findByIdAndUpdate(finduser._id, { $pull: { follower: currentuser?._id } })
            await User.findByIdAndUpdate(currentuser._id, { $pull: { following: finduser?._id } })
            if (findnoti) {
                await notifies.findByIdAndDelete(findnoti._id)
            }

            res.status(200).json("unfollowed")


        }
        else {
            await User.findByIdAndUpdate(finduser._id, { $push: { follower: currentuser?._id } })
            await User.findByIdAndUpdate(currentuser._id, { $push: { following: finduser?._id } })



            const newnotify = new notifies({
                from: currentuser._id,
                to: finduser._id,
                type: "follow"

            })
            await newnotify.save()


            res.status(200).json("followed")

        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message + "Internal server issue" })
    }
}


const suggestuser = async (req, res) => {
    try {
        const user = req.user.userid

        const currentuser = await User.findById(user).select("following")
        if (!currentuser) {
            return res.status(404).json("user not found")
        }
        const sugg = await User.aggregate([{
            $match: {
                _id: { $ne: currentuser._id }
            }
        },
        { $sample: { size: 10 } }
        ])

        const filtering = sugg.filter(i => !currentuser.following?.includes(i._id))

        const newsugg = filtering.slice(0, 4)
        //    const suggestuser= newsugg.forEach(i => i.password = null)
        const newsuggs = newsugg.map(i => {
            i.password = undefined
            return i
        })

        res.status(200).json(newsuggs)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message + ": internal server issue" })
    }

}
const updateuser = async (req, res) => {
    try {
        const updates = {};
        const user = req.user.userid
        const { Fullname, currentpassword, newpassword, confirmedpassword, name, email, bio, link } = req.body
        let { profileImg, coverImg } = req.body

        if (!user) {
            return res.status(400).json("user is missing")
        }

        currentuser = await User.findById(user)
        //console.log(currentuser)
        if (currentpassword) {

            if (!currentpassword || !newpassword || !confirmedpassword) {
                return res.status(400).json("password is missing")
            }

            if (newpassword != confirmedpassword) {
                return res.status(400).json("Wrong user input")
            }
            currentuser = await User.findById(user)
            //console.log(currentuser)
            if (!currentuser) {
                return res.status(404).json("User not found")
            }
            if (newpassword.length < 8) {
                return res.status(400).json("minimum lenght of 8 character is need")
            }
            const compare = await bcrypt.compare(currentpassword, currentuser.password)
            if (!compare) {
                return res.status(401).json("Wrong password try again")
            }
            if (currentpassword === newpassword) {
                return res.status(400).json("you can't add same password for current and new password")
            }
            const gensalt = 9
            updates.password = await bcrypt.hash(newpassword, gensalt)
        }
        if (profileImg) {
            if (currentuser.profileImg) {
                await cloudinary.uploader.destroy(currentuser.profileImg.split("/").pop().split(".")[0])
            }
            const proups = await cloudinary.uploader.upload(profileImg, {
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto:low' },
                    { fetch_format: 'auto' }],
            })
            profileImg = proups.secure_url
        }
        if (coverImg) {
            if (currentuser.coverimg) {
                await cloudinary.uploader.destroy(currentuser.coverimg.split('/').pop().split('.')[0])
            }
            const covups = await cloudinary.uploader.upload(coverImg, {
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' }],
            })
            coverImg = covups.secure_url
        }

        // currentuser.name=name||currentuser.name
        // currentuser.email=email||currentuser.email
        // currentuser.Fullname=Fullname||currentuser.Fullname
        // currentuser.link=link||currentuser.link
        // currentuser.bio= bio||currentuser.bio
        // currentuser.password=newpass||currentuser.password
        // currentuser.profileImg= profileImg||currentuser.profileImg
        // currentuser.coverimg= coverImg||currentuser.coverimg

        // currentuser.save()
        // currentuser.password=undefined



        if (name && name !== currentuser.name) {
            const existname = await User.findOne({ name })
            if (existname) {
                return res.status(409).json("Name is already taken boii")
            }
            updates.name = name
        }

        if (email && email !== currentuser.email.toString()) {
            const existemail = await User.findOne({ email })
            if (existemail) {
                return res.status(409).json("email is already taken boii")
            }
            if (!validator.isEmail(email)) {
                return res.status(400).json("Email format is wrong")
            }
            updates.email = email
        }

        if (Fullname && Fullname !== currentuser.Fullname) {
            const existFullname = await User.findOne({ Fullname })
            if (existFullname) {
                return res.status(409).json("Fullname is already taken boii")
            }
            updates.Fullname = Fullname
        }
        if (email) updates.email = email;
        if (Fullname) updates.Fullname = Fullname;
        if (link) updates.link = link;
        if (bio) updates.bio = bio;
        if (profileImg) updates.profileImg = profileImg;
        if (coverImg) updates.coverimg = coverImg;

        const updateduser = await User.findByIdAndUpdate(user, updates, {
            runValidators: true,
            new: true
        })
        updateduser.password = undefined
        const tokens = jwt.sign({ useremail: updates.email, userid: user, userFullname: updates.Fullname, username: updates.name }, process.env.SECERT, { expiresIn: "2h" })
        res.cookie("tokens", tokens, {
            HttpsOnly: true,
            secure: process.env.NODE_ENV === "production",
            Samesite: "Lax",
            maxAge: 7200000
        })
        res.status(200).json(updateduser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message + ": internal server issue" })
    }

}
module.exports = {
    getuserprofile,
    followlogic,
    suggestuser,
    updateuser

}