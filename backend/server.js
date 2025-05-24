const express=require("express")
require("dotenv").config()
const connectdb=require('./db/mongodb')
const authrouter=require("./routes/auth.route")
const userrouter=require("./routes/user.route")
const cookieParser = require("cookie-parser")
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use('/api',authrouter)
app.use('/api/user',userrouter)
const port =process.env.PORT        

const start=async ()=>{
    app.listen(port,()=>{console.log(`server is listening ${port}`) 

})
   await connectdb(process.env.MONGO_URI);
}
start() 