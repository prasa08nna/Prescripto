import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import MyAppointments from './Pages/MyAppointments'
import Appointment from './Pages/Appointment'
import Contact from './Pages/Contact'
import { ToastContainer, toast } from 'react-toastify';

import Login from './Pages/Login'
import MyProfile from './Pages/MyProfile'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Doctors from './Pages/Doctors'
const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar></Navbar>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path="/doctors/:speciality?" element={<Doctors />} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/appointment/:doctorId' element={<Appointment/>}/>
      <Route path='/my-appointments' element={<MyAppointments/>}/>
      <Route path='/my-profile' element={<MyProfile/>}/> 
    </Routes>
    <Footer></Footer>
    </div>
  )
}

export default App
