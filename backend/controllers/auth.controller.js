const User = require("../models/user.model")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

require('dotenv').config()
const signup = async (req, res) => {
    try {
        const { name, email, password, Fullname } = req.body

        if (!validator.isEmail(email)) {
            res.status(403).json("approriate email please")
            return
        } 
        const findname = await User.findOne({ name })

        const findemail = await User.findOne({ email })
        if (findname || findemail) {
            res.status(400).json("the email or name is already taken")
            return
        }
        if (password.length < 8) {
            res.status(402).json("Password must be atleast 8 char long")
        }

        const saltround = 9;
        const hashpass = await bcrypt.hash(password, 9)
        console.log(hashpass)
        const creates = await User.create({ email, name, Fullname, password: hashpass })
        const tokens = jwt.sign({  userid:creates._id, username: creates.name,useremail:findemail, userfullname: creates.Fullname }, process.env.SECERT, { expiresIn: "2h" })
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
        res.json(error.message)
   console.error(error)
    }
}


const login = async (req, res) => {
    try {
        const { name, password, email } = req.body;
        if (!validator.isEmail(email)) {
            res.status(403).json("wrong email")
            return
        }
         
        if(!email||!name){
            res.status(400).json("Please enter the email or name")
         return
        }
   const user=await User.findOne({email})
 if(!user){
    res.status(404).json("Sorry the user don't exist")
    return
 }

       const verifypass = await bcrypt.compare(password, user.password)
        if (!verifypass) {
            res.status(401).json("sorry the password is wrong here")
            return
        }

 const tokens=jwt.sign({ userid:user._id, username:user.name,useremail:user.email,userfullname:user.Fullname},process.env.SECERT,{expiresIn:'2h'})
        
    res.cookie("tokens",tokens,{
      httpOnly:true,
      secure:process.env.NODE_ENV==="production",
      maxAge:7200000,
     SameSite:"Lax"
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
        res.status(500).json(error.message)
    }
}
const logout=async (req,res)=>{
    
    res.clearCookie("tokens","",{
        httpOnly:true,
        SameSite:'Lax',
        secure:process.env.NODE_ENV==='production'
    })
    res.json({
        success:true,
        msg:"Your account has been logged out successfully"
    })

}

   
module.exports = {
    signup,
    login,
    logout
} 