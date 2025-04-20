import React from 'react'

const testimonials = [
  {
    content: "Doctor AI has revolutionized how we handle patient care. The AI-powered diagnostics have significantly improved our accuracy.",
    author: "Dr. Sarah Johnson",
    role: "Chief Medical Officer",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    content: "The real-time monitoring system has helped us provide better care to our patients. It's like having an extra set of eyes 24/7.",
    author: "Dr. Michael Chen",
    role: "Head of Cardiology",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    content: "As a patient, I feel more secure knowing that AI is helping to monitor my health conditions around the clock.",
    author: "Emily Rodriguez",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  }
]

const Testimonials = () => {
  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by Healthcare Professionals
          </p>
        </div>
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="lg:col-span-1">
                <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-8">
                    <div className="relative text-lg font-medium text-gray-700">
                      <svg
                        className="absolute top-0 left-0 transform -translate-x-3 -translate-y-2 h-8 w-8 text-gray-200"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                      >
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="relative">{testimonial.content}</p>
                    </div>
                    <div className="mt-8 flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={testimonial.image}
                          alt={testimonial.author}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-base font-medium text-gray-900">{testimonial.author}</div>
                        <div className="text-base text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonials