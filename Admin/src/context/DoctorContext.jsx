import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'
export const DoctorContext=createContext();

const DoctorContextProvider=({ children })=>{

    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [dToken,setDToken]=useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):"")
    const [appointments,setAppointments]=useState([])

    const [dashData,setDashData]=useState(false)
    const [profileData,setProfileData]=useState(false)

    const getAppointments = async () => {
        try {
          console.log("Fetching appointments with dToken:", dToken);
          const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
            headers: { dToken: dToken },
          });
    
          console.log("API Response:", data);
    
          if (data.success) {
            setAppointments(data.appointments.slice().reverse());
            console.log("Updated Appointments:", data.appointments.slice().reverse());
          } else {
            // console.warn("No appointments found:", data.message);
            // setAppointments([]); // Ensure state is updated even if empty
            toast.error(data.message);
          }
        } catch (error) {
          console.error("API Error:", error);
          toast.error(error.message);
        }
      };

      const completeAppointment = async (appointmentId) => {
        try {
          console.log("Sending request with dToken:", dToken); 
      
          const response = await axios.post(
            `${backendUrl}/api/doctor/complete-appointment`,
            { appointmentId }, 
            { headers: { dToken } }
          );
      
          console.log("Response:", response.data);
          if (response.data.success) {
            toast.success("Appointment marked as completed");
            getAppointments();
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error("Error completing appointment:", error);
          toast.error("Failed to mark appointment as completed");
        }
      };
      
      const cancelAppointment=async(appointmentId)=>{
        try {
          const {data}=await axios.post(`${backendUrl}/api/doctor/cancel-appointment`,{appointmentId},{headers:{dToken:dToken}})
          if(data.success){
              toast.success(data.message)
              getAppointments()
          }else{
            toast.error(data.message)
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
      
      const getDashData=async()=>{
            try {
              const {data}=await axios.get(`${backendUrl}/api/doctor/dashboard`,{headers:{dToken:dToken}})
              if(data.success){
                  setDashData(data.dashData)
                  console.log(data.dashData);
                  
              }else{
                toast.error(data.message)
              }
            } catch (error) {
              toast.error(error.message);
            }
      }

      const getProfileData=async()=>{
        try {
          const {data}=await axios.get(`${backendUrl}/api/doctor/profile`,{headers:{dToken:dToken}})
          if(data.success){
              setProfileData(data.profileData)
              console.log(data.profileData);
              
          }else{
            toast.error(data.message)
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    const value={
        dToken,setDToken,backendUrl,appointments,setAppointments,getAppointments,completeAppointment,cancelAppointment,dashData,setDashData,getDashData,
        profileData,setProfileData,getProfileData
    }
    return (
        <DoctorContext.Provider value={value}>
           { children }
        </DoctorContext.Provider>
    )
}
export default DoctorContextProvider;