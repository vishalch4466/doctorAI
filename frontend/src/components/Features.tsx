import React from 'react'
import { Brain, Activity, Clock, Shield } from 'lucide-react'

const features = [
  {
    name: 'AI-Powered Diagnostics',
    description: 'Advanced machine learning algorithms for accurate medical diagnosis',
    icon: Brain,
  },
  {
    name: 'Real-time Monitoring',
    description: 'Continuous health tracking and instant alerts for critical conditions',
    icon: Activity,
  },
  {
    name: '24/7 Availability',
    description: 'Round-the-clock access to AI-assisted healthcare services',
    icon: Clock,
  },
  {
    name: 'Secure & Private',
    description: 'Enterprise-grade security for your sensitive medical data',
    icon: Shield,
  },
]

const Features = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to manage healthcare
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Leverage the power of artificial intelligence to revolutionize healthcare delivery and patient outcomes.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features