import React from 'react'

const About = () => {
  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              About Doctor AI
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-gray-500">
              Doctor AI combines cutting-edge artificial intelligence with healthcare expertise to provide innovative solutions for patients and healthcare providers. Our mission is to make quality healthcare more accessible, efficient, and personalized through technology.
            </p>
            <div className="mt-8 sm:flex">
              <div className="rounded-md shadow">
                <a
                  href="#contact"
                  className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <img
              className="rounded-lg shadow-lg"
              src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
              alt="AI in healthcare"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default About