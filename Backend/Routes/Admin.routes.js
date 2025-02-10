import express from 'express'
import {addDoctors,adminDashboard,adminLogin, allDoctors, appointmentAdmin, appointmentCancel} from '../Controllers/Admin.controller.js'
import upload from '../Middlewares/multer.middleware.js'
import authAdmin from '../Middlewares/authAdmin.middleware.js'
import { changeAvailability } from '../Controllers/Doctor.controller.js'

const adminRouter=express.Router()
adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctors)
adminRouter.post('/login',adminLogin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.get('/appointments',authAdmin,appointmentAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)

export default adminRouter;