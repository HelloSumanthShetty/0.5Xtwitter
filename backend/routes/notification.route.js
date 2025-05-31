const express=require("express")
const router=express.Router()
const verifytoken=require("../middlewares/auth")
const {getnotify,deletenotify}=require("../controllers/notification.controller")
router.route("/").get(verifytoken,getnotify).delete(verifytoken,deletenotify)

module.exports=router