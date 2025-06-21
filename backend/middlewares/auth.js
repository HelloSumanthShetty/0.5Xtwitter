const jwt=require("jsonwebtoken")
require('dotenv').config()

const verifytoken=(req,res,next)=>{
 try {
       const tokens=req.cookies?.tokens
    if(!tokens){
        throw new Error("Yo the tokens are missing thug")
        
    }
    const verifying=jwt.verify(tokens,process.env.SECERT)
  req.user=verifying
  next()

 } catch (error) {
   res.status(401).json({error:error.message}||"cookies has expires or the authentication has failed")    
return
 }
}
module.exports=verifytoken
