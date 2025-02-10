import doctorModel from "../Models/doctor.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../Models/Appointment.model.js";
const changeAvailability=async(req,res)=>{
    try {
        const {docId}=req.body
        const docData=await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        return res.status(201).json({success: true, message: "Availability changed"})
    } catch (error) {
        console.error("Error fetching doctors:", error); 
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

const doctorList=async(req,res)=>{
    try {
        const doctors= await doctorModel.find({}).select(['-password','-email'])
        return res.status(201).json({success:true, doctors})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
    
}
const loginDoctor=async(req,res)=>{
    try {
        const {email,password}=req.body
        const doctor=await doctorModel.findOne({email})
        if(!doctor){
            return res.status(401).json({success:false,message:"Invalid Email"})
        }

        const isMatch=await bcrypt.compare(password,doctor.password)
       
        if (isMatch) {
            const token=jwt.sign({id:doctor._id},process.env.JWT_SECRET_KEY)
            return res.status(201).json({success:true,token})
        }else{
            return res.status(401).json({success:false,message:"Invalid Credentials"})
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

const appointmentsDoctor=async(req,res)=>{
    try {
        const {docId}=req.body
        const appointments=await appointmentModel.find({docId})
       
        
      
        
        return res.status(201).json({success:true,appointments})
        
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

const appointmentComplete=async(req,res)=>{
    try {
        const {docId,appointmentId}=req.body

        const appointmentData=await appointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId==docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
            return res.status(201).json({success:true,message:'Appointment completed'})
        }else{
            return res.status(401).json({success:false,message:"Mark failed"})
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}
const appointmentCancel=async(req,res)=>{
    try {
        const {docId,appointmentId}=req.body

        const appointmentData=await appointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId==docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
            return res.status(201).json({success:true,message:'Appointment cancelled'})
        }else{
            return res.status(401).json({success:false,message:"Cancellation failed"})
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

const doctorDashboard=async(req,res)=>{
    try {
        const {docId}=req.body
        console.log(req.body);

        const appointments=await appointmentModel.find({docId})
        let earning=0
        appointments.map((item)=>{
                if (item.payment || item.isCompleted) {
                    earning+=item.amount
                } 
        })
        let patients=[]
        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        const dashData={
            earning,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        return res.status(201).json({ success:true,dashData})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}
const doctorProfile=async(req,res)=>{
    try {
        const docId = req.docId
       
        const profileData=await doctorModel.findById(docId).select('-password ')
      
        
        return res.status(201).json({ success:true,profileData})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}
const updateProfile=async(req,res)=>{
    try {
        const docId = req.docId;
        const {fees,address, available}=req.body
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
        return res.status(201).json({ success:true,message:"Profile Updated"})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

export{changeAvailability,doctorList,loginDoctor,appointmentsDoctor,appointmentComplete,appointmentCancel,doctorDashboard,updateProfile,doctorProfile}