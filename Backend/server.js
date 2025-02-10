import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectMongoDB } from './config/mondodb.js'
import { connectCloudinary } from './config/cloudinary.js'
import adminRouter from './Routes/Admin.routes.js'
import doctorRouter from './Routes/Doctor.router.js'
import userRouter from './Routes/User.routes.js'

const app=express()
const port=process.env.PORT || 4000
connectMongoDB();
connectCloudinary();

app.use(cors())
app.use(express.json())

app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter )
app.use('/api/user',userRouter)
app.get("/",(req,res)=>{
    res.send("Apii working correctly")
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
    console.log(`http://localhost:${port}`)
})