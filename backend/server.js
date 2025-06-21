const express=require("express")
require("dotenv").config()
const connectdb=require('./db/mongodb')
const cloudinary=require("cloudinary")
const authrouter=require("./routes/auth.route")
const userrouter=require("./routes/user.route")
const postrouter=require("./routes/post.route")
const notify=require("./routes/notification.route")
const cookieParser = require("cookie-parser")
const cors=require("cors")
const app=express()

app.use(cors())
cloudinary.config({
    secure:process.env.NODE_ENV==="production",
    cloud_name:process.env.CLOUDINARY_NAME,
api_key:process.env.CLOUDINARY_API_KEY,
api_secret:process.env.CLOUDINARY_API_PASSWORD,
secure:true
})

app.use(express.json({limit:"3mb"}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use('/api',authrouter) 
app.use('/api/user',userrouter)
app.use('/api/post',postrouter)
app.use("/api/notification",notify)
const port =process.env.PORT        

const start=async ()=>{
    app.listen(port,()=>{console.log(`server is listening ${port}`) 

})
   await connectdb(process.env.MONGO_URI);
}
start()  