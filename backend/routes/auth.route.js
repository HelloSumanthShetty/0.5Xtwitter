const express=require("express")
const router =express.Router();
const {signup,login,logout}=require("../controllers/auth.controller");
const verifytoken = require("../middlewares/auth");

router.route('/').post(signup)
router.route('/login').post(login)
router.route('/logout').post(verifytoken,logout)

module.exports=router 