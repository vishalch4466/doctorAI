import React from 'react'
import { ArrowRight, Stethoscope } from 'lucide-react'

interface HeroProps {
  onStartChat: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartChat }) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <Stethoscope className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            <span className="block">AI-Powered</span>
            <span className="block text-blue-600 mt-2">Medical Assistant</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
            Get instant medical guidance powered by advanced AI. Connect with specialized medical AI assistants for various health concerns.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={onStartChat}
              className="px-8 py-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Start Consultation
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Note: This is an AI assistant and not a replacement for professional medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Hero