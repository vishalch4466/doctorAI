import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'

const LandingPage = () => {
  const navigate = useNavigate()

  const handleStartChat = () => {
    navigate('/chat')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      <Hero onStartChat={handleStartChat} />
    </div>
  )
}

export default LandingPage