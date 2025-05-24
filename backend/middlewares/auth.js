const jwt=require("jsonwebtoken")
require('dotenv').config()

const verifytoken=(req,res,next)=>{
 try {
       const tokens=req.cookies.tokens
    if(!tokens){
        res.status(404).json("Yo the tokens are missing thug")
        return
    }
    const verifying=jwt.verify(tokens,process.env.SECERT)
  req.user=verifying
  next()

 } catch (error) {
   res.status(401).json("cookies has expires or the authentication has failed")    
return
 }
}
module.exports=verifytoken
