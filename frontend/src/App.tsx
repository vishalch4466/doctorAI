import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'
import AboutPage from './pages/AboutPage'
import Signup from './pages/SignUp'
import SignIn from './pages/SignIn'
function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  )
}

export default App