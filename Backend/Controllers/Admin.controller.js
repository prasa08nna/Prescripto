//API for adding doctors
import validator from 'validator'
import bcrypt from 'bcrypt'
import cloudinary from 'cloudinary'
import doctorModel from '../Models/doctor.model.js'
import jwt from "jsonwebtoken";
import appointmentModel from '../Models/Appointment.model.js';
import userModel from '../Models/user.model.js';



const addDoctors = async (req, res) => {
    try {
      const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
      const imageFile = req.file; 
  
    
      if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }
  
    
      if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format." });
      }
  
     
      if (password.length < 8) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
      }
  
      
      const existingDoctor = await doctorModel.findOne({ email });
      if (existingDoctor) {
        return res.status(400).json({ success: false, message: "Doctor with this email already exists." });
      }
  
     
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
    
      if (!imageFile) {
        return res.status(400).json({ success: false, message: "No image file uploaded." });
      }
  
      
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      const imageUrl = imageUpload.secure_url;
  
     
      let parsedAddress;
      try {
        parsedAddress = JSON.parse(address);
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid address format." });
      }
  
      const doctorData = {
        name,
        email,
        image: imageUrl,
        password: hashedPassword,
        speciality,
        degree,
        experience,
        about,
        fees,
        address: parsedAddress,
        date: Date.now(),
      };
  
      const newDoctor = new doctorModel(doctorData);
      await newDoctor.save();
  
      return res.status(200).json({ success: true, message: "Doctor added successfully." });
  
    } catch (error) {
      console.error("Error in addDoctors:", error); 
      return res.status(500).json({ success: false, message: "Internal Server Error.", error: error.message });
    }
  };
  



const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY);
            return res.status(200).json({ success:true, token });
        } else {
            return res.status(401).json({ success:false, message: "Invalid Credentials" });
        }
    } catch (error) {
        return res.status(500).json({  success:false,message: "Internal Server Error" });
    }
};


const allDoctors = async (req, res) => {
  try {
      const doctors = await doctorModel.find({}).select("-password");

      return res.status(200).json({ success: true, doctors });
  } catch (error) {
      console.error("Error fetching doctors:", error); 
      return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


const appointmentAdmin=async(req,res)=>{
    try {
      const appointments=await appointmentModel.find({})
      return res.status(201).json({success:true,appointments})
    } catch (error) {
      console.error("Error fetching doctors:", error); 
      return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });  
    }
}

const appointmentCancel= async (req, res) => {
  try {
    const {appointmentId } = req.body;

  
    const appointmentData = await appointmentModel.findById(appointmentId);


    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { doctorId, slotDate, slotTime } = appointmentData;

  
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


const adminDashboard=async (req,res)=>{
  try {
    const doctors=await doctorModel.find({})
    const users=await userModel.find({})
    const appointments=await appointmentModel.find({})

    const dashData={
      doctors:doctors.length,
      appointments:appointments.length,
      patients:users.length,
      latestAppointments:appointments.reverse().slice(0,5)

    }
    return res.status(201).json({success:true,dashData})
  } catch (error) {
    onsole.error("Error fetching doctors:", error); 
      return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

export {addDoctors,adminLogin,allDoctors,appointmentAdmin,appointmentCancel,adminDashboard}