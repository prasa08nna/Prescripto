import { createContext, useEffect, useState } from "react";
// import { doctors} from "../assets/assets";
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext=createContext()
const AppContextProvider=(probs)=>{

    const currencySymbol='$';
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [doctors,setDoctors]=useState([])
    const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const [userData,setUserData]=useState(false)
 
    const getDoctorData=async()=>{
        try {
            const {data}=await axios.get(`${backendUrl}/api/doctor/list`)
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message)
        }
    }

    const loadUserProfile=async()=>{
        try {
            const {data}=await axios.get(`${backendUrl}/api/user//get-profile`,{headers:{token:token}})
            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message)
        }
    }
    const value={
        doctors,getDoctorData,
        currencySymbol,token,setToken,backendUrl,userData,setUserData,
        loadUserProfile
    }

    useEffect(()=>{
        getDoctorData();
    },[])
    useEffect(()=>{
        if(token){
            loadUserProfile()
        }else{
            setUserData(false)
        }
    },[token])
   
    return(
        <AppContext.Provider value={value}>
            {probs.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;