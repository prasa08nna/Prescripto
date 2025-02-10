import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className="md:mx-10">
   
    <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
     
        <div className="mb-10 md:mb-14">
        <img src={assets.logo} alt="" className="mb-5 w-40" />
        <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        </p>
        </div>

     
      <div>
        <p className="font-bold text-lg text-gray-900 mb-4">COMPANY</p>
        <ul className="space-y-2 text-gray-600">
          <li className="hover:text-gray-800 cursor-pointer">Home</li>
          <li className="hover:text-gray-800 cursor-pointer">About us</li>
          <li className="hover:text-gray-800 cursor-pointer">Contact us</li>
          <li className="hover:text-gray-800 cursor-pointer">Privacy policy</li>
        </ul>
      </div>
      
      <div>
        <p className="font-bold text-lg text-gray-900 mb-4">GET IN TOUCH</p>
        <ul className="space-y-2 text-gray-600">
          <li className="hover:text-gray-800 cursor-pointer">+1-212-456-7890</li>
          <li className="hover:text-gray-800 cursor-pointer">greatstackdev@gmail.com</li>
        </ul>
      </div>
    </div>
   
    <div className="mt-10">
      <hr className="border-gray-300 mb-4" />
      <p className="text-center text-gray-500 text-sm">
        Copyright © 2024 GreatStack - All Right Reserved.
      </p>
    </div>
  </div>
  
  )
}

export default Footer
