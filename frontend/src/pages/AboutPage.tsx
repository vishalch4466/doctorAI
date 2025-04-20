import React from 'react'
import Navbar from '../components/Navbar'
import About from '../components/About'
import Features from '../components/Features'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <About />
      <Features />
      <Services />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default AboutPage