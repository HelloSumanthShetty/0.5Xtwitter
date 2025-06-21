const express=require("express")
const router=express.Router()
const {createpost,getlikes,getuserposts,deletepost,likeunlike,comment,getall,getfollowingposts}=require("../controllers/post.controller")
const verifytoken = require("../middlewares/auth")

router.route('/').post(verifytoken,createpost).get(verifytoken,getall)
router.route('/:id').delete(verifytoken,deletepost)
router.route("/comment/:id").post(verifytoken,comment)
router.route("/following").get(verifytoken,getfollowingposts)
router.route("/like/:id").post(verifytoken,likeunlike).get(verifytoken,getlikes)
router.route("/user/:username").get(verifytoken,getuserposts)
module.exports=router    