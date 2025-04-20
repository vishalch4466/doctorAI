import React from 'react'
import { Microscope, HeartPulse, Stethoscope, Brain } from 'lucide-react'

const services = [
  {
    title: 'AI Diagnostics',
    description: 'Advanced diagnostic tools powered by machine learning algorithms',
    icon: Microscope,
  },
  {
    title: 'Health Monitoring',
    description: 'Real-time monitoring of vital signs and health metrics',
    icon: HeartPulse,
  },
  {
    title: 'Virtual Consultations',
    description: 'AI-assisted remote medical consultations',
    icon: Stethoscope,
  },
  {
    title: 'Predictive Analytics',
    description: 'Early detection and prevention of health issues',
    icon: Brain,
  },
]

const Services = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Services</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Comprehensive AI Healthcare Solutions
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="pt-6"
              >
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <service.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{service.title}</h3>
                    <p className="mt-5 text-base text-gray-500">{service.description}</p>
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

export default Services