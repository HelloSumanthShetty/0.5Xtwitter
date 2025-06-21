const mongoose=require("mongoose")

const notificationschema=new mongoose.Schema({
from:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Users'
},
to:{
 type:mongoose.Schema.Types.ObjectId,
 required:true,
 ref:"Users" 
},
type:{
  type:String,
  required:true,
  enum:['follow','like']
},
read:{
    type:Boolean,
    default:false 
}
},{timestamps:true})

module.exports=mongoose.model("notifies",notificationschema)