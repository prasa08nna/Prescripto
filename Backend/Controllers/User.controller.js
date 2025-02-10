import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../Models/user.model.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../Models/doctor.model.js'
import appointmentModel from '../Models/Appointment.model.js'
import { memoryStorage } from 'multer'
import Razorpay from "razorpay";
const registerUser=async(req,res)=>{
    try {
       const {name,email,password}=req.body
       if(!name || !email || !password){
        return res.status(401).json({ success:false, message: "Missing Details" });
       } 
       if(!validator.isEmail(email)){
        return res.status(401).json({success:false,message:"Provide valid email"})
       }
       if(password.length < 8){
        return res.status(401).json({success:false,message:"Strong password required"})
       }

       const salt=await bcrypt.genSalt(10);
       const hashedPassword=await bcrypt.hash(password,salt)
       const userData={
        name,
        email,
        password:hashedPassword
       }
       const newUser=new userModel(userData)
       const user=await newUser.save()
       const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY)
       return res.status(201).json({success:true,token})
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}
const loginUser=async(req,res)=>{
    try {
       const {email,password}=req.body
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(401).json({success:false,message:"User not exists"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if (isMatch) {
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY)
            return res.status(201).json({success:true,token}) 
        } else {
            return res.status(401).json({success:false,message:"Invalid Credentials"})
        }
       
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

const getProfile=async(req,res)=>{
    try {
        const {userId}=req.body;
        const userData=await userModel.findById(userId).select('-password');
        return res.status(201).json({success:true,userData})
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

const updateProfile=async(req,res)=>{
    try {
        const {userId,name,phone,address,dob,gender}=req.body
        const imageFile=req.file
        if(!name || ! phone || !dob || ! gender){
            return res.status(401).json({success:false,message:"Missing details"})
        }
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})

        if(imageFile){
            const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageUrl=imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId,{image:imageUrl})
        }
        return res.status(201).json({success:true,message:'Profile updated succesfully'})
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}
const bookAppointment = async (req, res) => {
    try {
        console.log("Request received in Backend:", req.body); 

        const { userId, doctorId, slotDate, slotTime } = req.body;

       
        if (!userId || !doctorId || !slotDate || !slotTime) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const docData = await doctorModel.findById(doctorId).select('-password');
        if (!docData) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        if (!docData.available) {
            return res.status(401).json({ success: false, message: "Doctor is not available" });
        }

        let slots_booked = docData.slots_booked || {};
        if (slots_booked[slotDate]?.includes(slotTime)) {
            return res.status(401).json({ success: false, message: "Slot not available" });
        }

        slots_booked[slotDate] = slots_booked[slotDate] || [];
        slots_booked[slotDate].push(slotTime);

        const userData = await userModel.findById(userId).select('-password');
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const appointmentData = new appointmentModel({
            userId,
            doctorId,  
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        });

        await appointmentData.save();
        await doctorModel.findByIdAndUpdate(doctorId, {slots_booked});

        return res.status(201).json({ success: true, message: "Appointment Booked" });
    } catch (error) {
        console.error("Error booking appointment:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

const listAppointments = async (req, res) => {
    try {
        const {userId}=req.body
        const appointments=await appointmentModel.find({userId})
        return res.status(201).json({success: true, appointments})
    } catch (error) {
        console.error("Error booking appointment:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}
const cancelAppointment = async (req, res) => {
    try {
      const { userId, appointmentId } = req.body;
  
    
      const appointmentData = await appointmentModel.findById(appointmentId);
  
     
      if (!appointmentData) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
      }
  
      if (appointmentData.userId != userId) {
        return res.status(400).json({ success: false, message: "Unauthorized action" });
      }
  
      // Mark appointment as cancelled
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
  
      const { doctorId, slotDate, slotTime } = appointmentData;
  
      // Fetch doctor details
      const doctorData = await doctorModel.findById(doctorId);
  
      // Check if the doctor exists
      if (!doctorData) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
      }
  
      let slots_booked = doctorData.slots_booked || {};
  
      // Remove the cancelled slot from booked slots
      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
      }
  
      // Update the doctor’s booked slots
      await doctorModel.findOneAndUpdate({ _id: doctorId }, { slots_booked });
  
      return res.status(200).json({ success: true, message: "Appointment Cancelled" });
  
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
  };
  
  const razorPayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

const paymentRazorPay = async (req, res) => {
    try {
        console.log("Incoming Payment Request:", req.body);

        const { appointmentId } = req.body;
        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "Missing appointmentId" });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);
        console.log("Appointment Data:", appointmentData);

        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
        if (appointmentData.cancelled) {
            return res.status(400).json({ success: false, message: "Appointment has been cancelled" });
        }
        if (!appointmentData.amount) {
            return res.status(400).json({ success: false, message: "Invalid appointment amount" });
        }

        if (!razorPayInstance) {
            console.error(" Razorpay instance is NOT initialized");
            return res.status(500).json({ success: false, message: "Payment gateway is not configured" });
        }
        console.log(process.env.CURRENCY);
        
        const options = {
            amount: appointmentData.amount * 100,  
            currency:process.env.CURRENCY.toString()|| "INR", 
            receipt: appointmentId,
        };

        console.log("Creating Razorpay Order with options:", options);

        const order = await razorPayInstance.orders.create(options);
        console.log("Order Created:", order);

        return res.status(201).json({ success: true, order });

    } catch (error) {
        console.error("🚨 Error processing payment:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};



export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointments,cancelAppointment,paymentRazorPay}