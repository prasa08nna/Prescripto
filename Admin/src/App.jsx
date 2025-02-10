import React from 'react'
import Login from './Pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { useContext } from 'react';

import { AdminContext } from './context/AdminContext';
import Navbar from './component/Navbar';
import SideBar from './component/SideBar';
import { Route, Routes } from 'react-router-dom';
import DashBorad from './Pages/AdminPage/DashBorad';
import AllAppointments from './Pages/AdminPage/AllAppointments';
import AddDoctor from './Pages/AdminPage/AddDoctor';
import DoctorList from './Pages/AdminPage/DoctorList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './Pages/DoctorPage/DoctorDashboard';
import DoctorAppointment from './Pages/DoctorPage/DoctorAppointment';
import DoctorProfile from './Pages/DoctorPage/DoctorProfile';

const App = () => {
  const {aToken}=useContext(AdminContext)
  const {dToken}=useContext(DoctorContext)
  return aToken || dToken? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar/>
      <div className='flex items-start'>
      <SideBar/>
      <Routes>
        <Route path='/' element={<></>}/>
        <Route path='/admin-dashboard' element={<DashBorad/>}/>
        <Route path='/all-appointments' element={<AllAppointments/>}/>
        <Route path='/add-doctor' element={<AddDoctor/>}/>
        <Route path='/doctor-list' element={<DoctorList/>}/>

        <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
        <Route path='/doctor-appointments' element={<DoctorAppointment/>}/>
        <Route path='/doctor-profile' element={<DoctorProfile/>}/>



      </Routes>
      </div>
    </div>
    ):
    (
    <>
    <Login/>
    <ToastContainer />
    </>
    )
  
}

export default App
