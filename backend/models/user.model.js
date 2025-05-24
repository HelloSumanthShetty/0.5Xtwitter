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
        required: [true, "please enter the name"],
        type: String,
        maxlength: [30, "please enter char below 30"]

    },
    password: {
        type: String,
        minlength: [8, "password must have a min-length of 8"],
        required: [true, "please enter the password"],
    },
    email: {

        type: String,
        unique: true

    },
    follower: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: []

    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
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
    }

}, {timestamps: true })

module.exports = mongoose.model("Users", UserSchema)