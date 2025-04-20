import React from 'react'
import { Link } from 'react-router-dom'
import { Stethoscope } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className="bg-[#1a1d27] border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <Stethoscope className="h-8 w-8 text-[#4f46e5]" />
              <span className="ml-2 text-xl font-bold text-white">Doctor AI</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link to="/chat" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Chat
            </Link>
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Logout
            </Link>
          </div>
          
        </div>
      </div>
    </nav>
  )
}

export default Navbar