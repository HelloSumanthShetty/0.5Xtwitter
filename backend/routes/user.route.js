const express=require("express")
const router=express.Router()
const {getuserprofile,followlogic,updateuser,suggestuser}=require('../controllers/user.controller')
const verifytokens=require("../middlewares/auth")

router.route('/profile/update').post(verifytokens,updateuser)
router.route('/profile/sugguser').get(verifytokens,suggestuser)
router.route('/profile/:email').get(verifytokens,getuserprofile)
router.route('/profile/:id').post(verifytokens,followlogic)

module.exports=router