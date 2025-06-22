const mongoose=require("mongoose")
const connectdb= async(url)=>{
    try {
        //console.log("connecting")
    const db= await mongoose.connect(url)
    
     //console.log("connected to "+db.connection.host)
    } catch (error) {
        //console.log('error message'+error)
        process.exit(1)
    }
}

module.exports=connectdb