import React, { useContext, useState } from 'react'
import {assets} from "../assets/assets"
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/AppContext';
import { use } from 'react';
const Navbar = () => {
  const navigate=useNavigate();
  const [showMenu, setShowMenu]=useState(false);
  const {token,setToken,userData}=useContext(AppContext)
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const logout=()=>{
    setToken(false);
    localStorage.removeItem('token')
  }
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
  <img onClick={() => navigate('/')} className="w-44 cursor-pointer" src={assets.logo} alt="" />
  <ul className="hidden md:flex items-start gap-5 font-medium">
    <NavLink to="/">
      <li className="py-1">Home</li>
      <hr className="outline-none h-0.5 bg-#5f6FFF w-3/5 m-auto hidden" />
    </NavLink>
    <NavLink to="/doctors">
      <li className="py-1">All Doctors</li>
      <hr className="outline-none h-0.5 bg-#5f6FFF w-3/5 m-auto hidden" />
    </NavLink>
    <NavLink to="/about">
      <li className="py-1">About</li>
      <hr className="outline-none h-0.5 bg-#5f6FFF w-3/5 m-auto hidden" />
    </NavLink>
    <NavLink to="/contact">
      <li className="py-1">Contact</li>
      <hr className="outline-none h-0.5 bg-#5f6FFF w-3/5 m-auto hidden" />
    </NavLink>
  </ul>

  <div className="flex items-center gap-4">
    {token && userData ? (
      <div className="relative flex items-center gap-2 cursor-pointer">
        <img className="w-8 rounded-full" src={userData.image} alt="" />
        <img className="w-2.5" src={assets.dropdown_icon} alt="" onClick={() => setShowProfileMenu(!showProfileMenu)} />

      
        {showProfileMenu && (
          <div
            className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
              <p className="hover:text-black cursor-pointer" onClick={() => navigate('/my-profile')}>My Profile</p>
              <p className="hover:text-black cursor-pointer" onClick={() => navigate('/my-appointments')}>My Appointments</p>
              <p onClick={logout} className="hover:text-black cursor-pointer">Logout</p>
            </div>
          </div>
        )}
      </div>
    ) : (
      <button
        onClick={() => navigate("/login")}
        className="bg-blue-600 text-white px-8 py-3 rounded-full font-light cursor-pointer hidden md:block"
      >
        Create Account
      </button>
    )}

    
    <img onClick={() => setShowMenu(true)} className="w-6 md:hidden" src={assets.menu_icon} alt="" />
  </div>

 
  <div
    className={`fixed top-0 right-0 z-20 h-screen w-[80%] bg-white shadow-lg transform transition-transform duration-300 ${showMenu ? 'translate-x-0' : 'translate-x-full'} md:hidden`}
  >
    <div className="flex items-center justify-between p-4 border-b">
      <img src={assets.logo} alt="Logo" className="w-30" />
      <img
        onClick={() => setShowMenu(false)}
        src={assets.cross_icon}
        alt="Close"
        className="w-7 cursor-pointer"
      />
    </div>

    <ul className="flex flex-col space-y-4 p-6 text-sm font-medium text-gray-700">
      <NavLink onClick={() => setShowMenu(false)} to="/" className="hover:text-blue-500">HOME</NavLink>
      <NavLink onClick={() => setShowMenu(false)} to="/doctors" className="hover:text-blue-500">ALL DOCTORS</NavLink>
      <NavLink onClick={() => setShowMenu(false)} to="/about" className="hover:text-blue-500">ABOUT</NavLink>
      <NavLink onClick={() => setShowMenu(false)} to="/contact" className="hover:text-blue-500">CONTACT</NavLink>
    </ul>
  </div>
</div>



  
  )
}

export default Navbar
