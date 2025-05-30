const mongoose=require("mongoose")

const postschema=new mongoose.Schema({
   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Users"
   },
   text:{
   type:String
   },
   img:{
    type:String
   },
   like:[{
    type:mongoose.Schema.Types.ObjectId
    ,ref:"Users"
   }],
   Comment:[{
    text:{
        type:String,
    },
    user:{
    type:mongoose.Schema.Types.ObjectId
    ,ref:"Users"
    }
   }]
},{timestamps:true})


module.exports=mongoose.model("post",postschema)