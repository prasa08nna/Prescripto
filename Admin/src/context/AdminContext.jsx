import { createContext, useState } from "react";
import {toast} from 'react-toastify'
import axios from 'axios'

export const AdminContext=createContext();

const AdminContextProvider=({ children })=>{

    const [aToken, setAToken]=useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):"")
    const [doctors,setDoctors]=useState([])
    const backendUrl = import.meta.env.VITE_BACKEND_URL; 
    const [appointments,setAppointments]=useState([]);
    const [dashData,setDashData]=useState(false)
    
    const getAllDoctors = async () => {
        try {
            // if (!aToken) {
            //     toast.error("Authorization token is missing");
            //     return;
            // }
    
            const { data } = await axios.post(`${backendUrl}/api/admin/all-doctors`, {}, 
                {
                    headers: { atoken: aToken }
            });
    
            if (data.success) {
                setDoctors(data.doctors);
                console.log(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    };
    const changeAvailability=async(docId)=>{
        try {
            const {data}=await axios.post(`${backendUrl}/api/admin/change-availability`,{docId},{
                headers: { atoken: aToken }
        })
       
        
        if(data.success){
            toast.success(data.message)
            getAllDoctors()
        }else{
            toast.error(data.message)
        }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    }
    const getAllAppointments=async()=>{
        try {
            const {data}=await axios.get(`${backendUrl}/api/admin/appointments`,{
                headers: { atoken: aToken }})
                if(data.success){
                    setAppointments(data.appointments)
                    console.log(data.appointments);
                    
                }else{
                    toast.error(data.message)
                }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const cancelAppointments=async(appointmentId)=>{
        try {
            const {data}=await axios.post(`${backendUrl}/api/admin/cancel-appointment`,{appointmentId},{headers:{atoken: aToken }})
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error(error.response?.data?.message || error.message);
        }
      
    }

    const getDashData=async()=>{
        try {
            const {data}=await axios.get(`${backendUrl}/api/admin/dashboard`,{headers:{atoken: aToken }})
            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData);
                
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    }
    const value={
        aToken,setAToken,backendUrl,doctors,getAllDoctors,changeAvailability,
        appointments,setAppointments,getAllAppointments,cancelAppointments,dashData,getDashData,setDashData
    }

    
    return (
        <AdminContext.Provider value={value}>
          { children }
        </AdminContext.Provider>
    )
}
export default AdminContextProvider;