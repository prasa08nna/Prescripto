import React, { useContext, useEffect, useState } from 'react'
import {AppContext} from "../Context/AppContext"
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointments = () => {
  const {backendUrl,token,getDoctorData}=useContext(AppContext);

  const [appointments,setAppointments]=useState([])
  console.log(backendUrl);

 const getUserAppointments = async () => {
    try {
        const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
            headers: { token: token }
        });

        console.log("API Response:", data); // Log full API response

        if (data.success) {
            if (!data.appointments || !Array.isArray(data.appointments)) {
                console.error("Appointments data is missing or not an array:", data.appointments);
                setAppointments([]); 
                return;
            }

            const appointmentsList = [...data.appointments].reverse();
            console.log("Final Appointments List:", appointmentsList);
            setAppointments(appointmentsList);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error(error.message);
    }
};

  useEffect(()=>{
    if(token){
      getUserAppointments()
    }
  },[token])

  const cancelAppointments=async(appointmentId)=>{
    
    try {
      const {data}=await axios.post(`${backendUrl}/api/user/cancel-appointment`,{appointmentId},{headers:{token}})
      if(data.success){
          toast.success(data.message)
          getUserAppointments()
          getDoctorData()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
     
      toast.error(error.message);
    }
  }


  const initPay=(order)=>{
      const options={
        key:import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:order.amount,
        currency:order.currency,
        name:'Appointment Payment',
        description:'Appointment Payment',
        order_id:order.id,
        receipt:order.receipt,
        handler:async(response)=>{
          console.log(response);
          
        }
      } 
      if (!window.Razorpay) {
        console.error(" Razorpay SDK not loaded");
        return;
    }
    const rzp = new window.Razorpay(options);
    rzp.open();
  }
  const appointmentRazorpay = async (appointmentId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token is missing from localStorage");
            toast.error("User is not authenticated");
            return;
        }

        console.log("Sending payment request for appointmentId:", appointmentId);

        const { data } = await axios.post(
            `${backendUrl}/api/user/payment-razorpay`,
            { appointmentId },
            { headers: { token } } 
        );

        if (data.success) {
          initPay(data.order)
           console.log(data.order);
          
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.error("Payment API Error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Payment failed");
    }
};





  return (
    <div>
  <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
  
  <div className="grid grid-cols-1 gap-4">
    {appointments.map((item, index) => (
      <div key={index} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 border-b">
        
        {/* Doctor Image */}
        <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
          <img src={item.docData.image} alt="" className="w-full h-full object-cover rounded-lg" />
        </div>

        {/* Doctor Details */}
        <div className="space-y-1 text-sm text-zinc-600">
          <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
          <p className="text-sm ">{item.docData.speciality}</p>
          <p className="text-zinc-700 font-medium mt-1">Address:</p>
          <p className="text-xs ">{item.docData.address.line1}</p>
          <p className="text-xs ">{item.docData.address.line2}</p>
          <p className="text-sm mt-1">
            <span className='text-sm text-neutral-700 font-medium ' >Date & Time:</span> {item.slotDate} | {item.slotTime}
          </p>
        </div>

      
        <div className="flex flex-col gap-2">
          {!item.cancelled && !item.isCompleted && <button  onClick={() => {
    
    appointmentRazorpay(item._id);
  }}className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer ">Pay Online</button>}
          {
            !item.cancelled &&!item.isCompleted &&<button onClick={()=>cancelAppointments(item._id)} className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer">Cancel Appointment</button>
          }
          { item.cancelled &&!item.isCompleted && <button className="text-sm  text-center sm:min-w-48 py-2 border rounded  text-red-500 transition-all duration-300 ">Cancelled</button>
          } {
            item.isCompleted && <button className="text-sm  text-center sm:min-w-48 py-2 border rounded  text-green-500 transition-all duration-300 ">Completed</button>
          }
          
        </div>
      </div>
    ))}
  </div>
</div>

  )
}

export default MyAppointments
