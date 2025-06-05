const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter the name"],
        trim: true,
        unique: true,
        maxlength: [20, "please enter char below 20"]
    },
    Fullname: {
        type: String,
        maxlength: [30, "please enter char below 30"]

    },
    password: {
        type: String,
        minlength: [8, "password must have a min-length of 8"],
        required: [true, "please enter the password"],
    },
    email: {
    required:[true,"please enter the email"],
        type: String,
        unique: true

    },
    follower: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        default: []

    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        default: []

    }],
    bio: {
        type: String,
        default: "Hey there i am new to 0.5xtwitter"
    },
    profileImg: {
        type: String,
        default: ""
    },
    coverimg: {
        type: String,
        default: ""
    },
    link:{
        type: String,
        default: ""
    },
   likedpost:[{
   type:mongoose.Schema.Types.ObjectId
   ,ref:"post",
   default:[]
   }],

}, {timestamps: true })

module.exports = mongoose.model("Users", UserSchema) 