import React, { useContext, useEffect, useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {AppContext} from '../Context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../Components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'
const Appointment = () => {
  const {doctorId}=useParams()
  const {doctors,currencySymbol,backendUrl,token,getDoctorData}=useContext(AppContext)
  const navigate=useNavigate();
  const daysOfWeek=['SUN','MON','TUE','WED','THU','FRI','SAT']
  const [docInfo,setDocInfo]=useState(null)
  const [docSlots,setDocSlots]=useState([]);
  const [slotIndex,setSlotIndex]=useState(0);
  const [slotTime,setSlotTime]=useState("");
  const fetchDocInfo=async()=>{
    
    const fetchedDocInfo = doctors.find(doc => doc._id === doctorId);
    setDocInfo(fetchedDocInfo)
    
    
  }
  const getAvailableSlots=async()=>{
    setDocSlots([]);


    let today= new Date();
    for(let i=0; i<7; i++){
      let currentDate=new Date(today);
      currentDate.setDate(today.getDate()+i)

      let endTime=new Date();
      endTime.setDate(today.getDate()+i)
      endTime.setHours(21,0,0,0)
      if (today.getDate() === currentDate.getDate()) {
       currentDate.setHours(currentDate.getHours()>10 ? currentDate.getHours()+1 :10)
       currentDate.setMinutes(currentDate.getMinutes()>30 ? 30:0)
      }else{
        currentDate.setHours(10);
        currentDate.setMinutes(0)
      }
      let timeSlots=[];
      while(currentDate<endTime){
        let formattedTime=currentDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})

         let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1; 
         let year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        let slotTime=formattedTime

        const isSlotAvailable = docInfo && docInfo.slots_booked && docInfo.slots_booked[slotDate] 
        ? !docInfo.slots_booked[slotDate].includes(slotTime) 
        : true;
      
        if (isSlotAvailable) {
          timeSlots.push({
            datetime:new Date(currentDate),
            time:formattedTime
          })
         }

        currentDate.setMinutes(currentDate.getMinutes()+30);
      }
      setDocSlots(prev=>([...prev,timeSlots]))
    }
  }

  const bookAppointment = async () => {
    if (!token) {
        toast.warn("Login to book an appointment");
        return navigate("/login");
    }

    console.log("Token being sent:", token);

    try {
        const date = docSlots[slotIndex][0].datetime;
        let day = date.getDate();
        let month = date.getMonth() + 1; 
        let year = date.getFullYear();

        const slotDate = `${day}_${month}_${year}`;

        
        console.log("Booking data:", { slotDate, slotTime, docId: doctorId });

        const { data } = await axios.post(
            `${backendUrl}/api/user/book-appointment`,
            { slotDate, slotTime, doctorId }, 
            {
                headers: { token } 
            }
        );

        console.log(" Response Data:", data);

        if (data.success) {
            toast.success(data.message);
            getDoctorData();
            navigate('/my-appointments');
        } else {
            toast.error(data.message);
        }

    } catch (error) {
        console.error("Error booking appointment:", error.response?.data || error);
        toast.error(error.response?.data?.message || "Something went wrong!");
    }
};



  
  useEffect(()=>{
    fetchDocInfo()
  },[doctors,doctorId])

  useEffect(()=>{
    getAvailableSlots()
  },[docInfo])

  useEffect(()=>{
    // console.log(docSlots);
    
  },[docSlots])
  return docInfo && (
    <div>
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Doctor Image */}
      <div className="w-full sm:w-auto">
        <img className="bg-blue-600 w-full sm:max-w-72 rounded-lg object-cover" src={docInfo.image} alt="" />
      </div>
  
      {/* Doctor Details */}
      <div className="flex-1 border border-gray-400 rounded-lg p-6 sm:p-8 bg-white mx-2 sm:mx-0 mt-4 sm:mt-0">
        <p className="flex items-center gap-2 text-xl sm:text-2xl font-medium text-gray-900">
          {docInfo.name} 
          <img className="w-4 sm:w-5" src={assets.verified_icon} alt="" />
        </p>
  
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mt-1 text-gray-600">
          <p>{`${docInfo.degree} - ${docInfo.speciality}`}</p>
          <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
        </div>
  
        <div>
          <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
            About 
            <img className="w-4 sm:w-5" src={assets.info_icon} alt="" />
          </p>
          <p className="text-xs sm:text-sm text-gray-500 max-w-full sm:max-w-[700px] mt-1">{docInfo.about}</p>
        </div>
  
        <p className="text-gray-500 font-medium mt-4">
          Appointment fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
        </p>
      </div>
    </div>
  
    
    <div className="sm:ml-72 sm:pl-4 mt-6 font-medium text-gray-700">
      <p>Booking Slots</p>
  
      {/* Slot Days */}
      <div className="flex gap-3 items-center w-full overflow-x-auto mt-4 scrollbar-hide">
        {docSlots.length > 0 && docSlots.map((item, index) => (
          <div
            onClick={() => setSlotIndex(index)}
            className={`text-center py-3 px-4 min-w-[3.5rem] sm:min-w-[4rem] rounded-full cursor-pointer transition-all duration-200
            ${slotIndex === index ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600"}`}
            key={index}
          >
            <p className="text-xs sm:text-sm">{item.length > 0 && daysOfWeek[item[0].datetime.getDay()]}</p>
            <p className="text-xs sm:text-sm">{item.length > 0 && item[0].datetime.getDate()}</p>
          </div>
        ))}
      </div>
  
      
      <div className="flex items-center gap-3 w-full overflow-x-auto mt-4 whitespace-nowrap scrollbar-hide">
        {docSlots.length > 0 && docSlots[slotIndex]?.length > 0 ? (
          docSlots[slotIndex].map((item, index) => (
            <p 
              onClick={() => setSlotTime(item.time)}
              className={`text-xs sm:text-sm font-light flex-shrink-0 px-4 sm:px-5 py-2 rounded-full cursor-pointer transition-all duration-200
              ${item.time === slotTime ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-600 hover:bg-gray-100"}`}
              key={index}
            >
              {item.time?.toLowerCase()}
            </p>
          ))
        ) : (
          <p className="text-gray-500">No slots available</p>
        )}
      </div>
  
      {/* Book Button */}
      <button onClick={bookAppointment} className="bg-blue-600 text-white text-sm font-light px-12 sm:px-14 py-3 rounded-full my-6 hover:scale-105 transition-all duration-300">
        Book an appointment
      </button>
    </div>
  
    <RelatedDoctors doctorId={doctorId} speciality={docInfo.speciality} />
  </div>
  
  )
}

export default Appointment
