const User = require("../models/user.model")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

require('dotenv').config()
const signup = async (req, res) => {
    try {
        const { name, email, password, Fullname } = req.body

        if (!validator.isEmail(email)) {
            //  return res.status(403).json("approriate email please")
            throw new Error("approriate email please")
        }
        const findname = await User.findOne({ name })

        const findemail = await User.findOne({ email })
        if (findname || findemail) {
            //return res.status(400).json("the email or name is already taken")
            throw new Error("the email or name is already taken")

        }
        if (password.length < 8) {
            // return res.status(402).json("Password must be atleast 8 char long")
            throw new Error("Password must be atleast 8 char long")
        }

        const saltround = 9;
        const hashpass = await bcrypt.hash(password, 9)
        //console.log(hashpass)
        const creates = await User.create({ email, name, Fullname, password: hashpass })
        const tokens = jwt.sign({ userid: creates._id, username: creates.name, useremail: findemail, userfullname: creates.Fullname }, process.env.SECERT, { expiresIn: "2h" })
        res.cookie("tokens", tokens, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            maxAge: 7200000,
            SameSite: "Lax"
        })


        res.json({
            success: true,
            msg: "the user has been created",
            userId: creates._id,
            userfullname: creates.Fullname,
            username: creates.name,
            useremail: creates.email

        })

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                error: error.message
            })
        console.error(error)
    }
}


const login = async (req, res) => {
    try {
        const { name, password, email } = req.body;
          if (!email || !name) {

            // return   res.status(400).json("Please enter the email or name")
            throw new Error("Please enter the email or name")
        }
        if (!validator.isEmail(email)) {
            //   return res.status(403).json("wrong email")
            throw new Error("approriate email please")

        }
       
        const user = await User.findOne({ email })
        if (!user) {
            //return res.status(404).json("Sorry the user don't exist")
            throw new Error("Sorry the user don't exist")
        }

        const verifypass = await bcrypt.compare(password, user.password)
        if (!verifypass) {
            //  return  res.status(401).json("sorry the password is wrong here")
            throw new Error("sorry the password is wrong here")
        }
 

      
        

        const tokens = jwt.sign({ userid: user._id, username: user.name, useremail: user.email, userfullname: user.Fullname }, process.env.SECERT, { expiresIn: '2h' })

        res.cookie("tokens", tokens, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7200000,
            SameSite: "Lax"
        }
        )
        res.json({
            success: true,
            msg: "the user has been logged in successfully",
            userId: user._id,
            userfullname: user.Fullname,
            username: user.name,
            useremail: user.email

        })

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        })

    }
}
const logout = async (req, res) => {
    try {


        res.clearCookie("tokens", "", {
            httpOnly: true,
            SameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production'
        })
        res.status(200).json({
            success: true,
            msg: "Your account has been logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }

}
const getme = async (req, res) => {
    try {
        const userid = req.user?.userid
        //console.log(userid)
        if (!userid) throw new Error("token expired")
        const getuser = await User.findById(userid).select("-password")
        if (!getuser) return res.status(404).json("user not found")
        res.status(200).json(getuser)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
}


module.exports = {
    signup,
    login,
    logout,
    getme
} 