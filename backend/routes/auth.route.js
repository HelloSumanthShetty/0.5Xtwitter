const express=require("express")
const router =express.Router();
const {signup,login,logout,getme}=require("../controllers/auth.controller");
const verifytoken = require("../middlewares/auth");

router.route('/').post(signup)
router.route('/me').get(verifytoken,getme)
router.route('/login').post(login)
router.route('/logout').post(verifytoken,logout)

module.exports=router 