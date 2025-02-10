import express from 'express'
import { bookAppointment, cancelAppointment, getProfile, listAppointments, loginUser, paymentRazorPay, registerUser, updateProfile } from '../Controllers/User.controller.js'
//  import authAdmin from '../Middlewares/user.middleware.js'
import authUser from '../Middlewares/user.middleware.js'
import upload from '../Middlewares/multer.middleware.js'

const userRouter=express.Router()
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointments)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorPay)

export default userRouter;