import React, { useState, useRef, useEffect } from 'react'
import { CircleUserRound, Heart, Stethoscope, Send, ImageIcon, Brain, Eye, Bone, Dna, Upload } from 'lucide-react'
import { DentalModel } from '../models/dentalModel'
import { CardiologyModel } from '../models/cardiologyModel'
import { DermatologyModel } from '../models/dermatologyModel'
import { OphthalmologyModel } from '../models/ophthalmologyModel'
import { OrthopedicsModel } from '../models/orthopedicsModel'
import { NeurologyModel } from '../models/neurologyModel'
import { GeneticsModel } from '../models/geneticsModel'
import { analyzeImage } from '../lib/openai'
import { fileToBase64 } from '../lib/imageUtils'
import Navbar from '../components/Navbar'

type Specialist = 'dental' | 'cardiology' | 'dermatology' | 'ophthalmology' | 'orthopedics' | 'neurology' | 'genetics'

interface SpecialistInfo {
  id: Specialist
  title: string
  description: string
  icon: React.ComponentType<any>
  model: any
}

interface Message {
  text: string
  isUser: boolean
  image?: {
    url: string
    name: string
  }
}

const ChatPage = () => {
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [modelLoading, setModelLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [modelError, setModelError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const specialists: SpecialistInfo[] = [
    {
      id: 'dental',
      title: 'Dental Specialist',
      description: 'Expert in oral health & dental care',
      icon: Stethoscope,
      model: new DentalModel()
    },
    {
      id: 'cardiology',
      title: 'Cardiology Specialist',
      description: 'Expert in heart & cardiovascular health',
      icon: Heart,
      model: new CardiologyModel()
    },
    {
      id: 'dermatology',
      title: 'Dermatology',
      description: 'Skin, hair & nail conditions',
      icon: Brain,
      model: new DermatologyModel()
    },
    {
      id: 'ophthalmology',
      title: 'Ophthalmology',
      description: 'Eye care & vision health',
      icon: Eye,
      model: new OphthalmologyModel()
    },
    {
      id: 'orthopedics',
      title: 'Orthopedics',
      description: 'Bone & joint specialist',
      icon: Bone,
      model: new OrthopedicsModel()
    },
    {
      id: 'neurology',
      title: 'Neurology',
      description: 'Brain & nervous system',
      icon: Brain,
      model: new NeurologyModel()
    },
    {
      id: 'genetics',
      title: 'Genetics',
      description: 'Genetic disorders & testing',
      icon: Dna,
      model: new GeneticsModel()
    }
  ]

  useEffect(() => {
    if (selectedSpecialist) {
      const loadModel = async () => {
        setModelLoading(true)
        setModelError(null)
        try {
          const specialist = specialists.find(s => s.id === selectedSpecialist)
          if (specialist) {
            await specialist.model.loadModel()
            setMessages([{
              text: `Hello! I'm your ${specialist.title}. How can I assist you today?`,
              isUser: false
            }])
          }
        } catch (error) {
          console.error('Error loading model:', error)
          setModelError('Failed to load the AI model. Please try selecting the specialist again.')
          setMessages([{
            text: 'I apologize, but I encountered an error while loading. Please try selecting the specialist again.',
            isUser: false
          }])
        } finally {
          setModelLoading(false)
        }
      }
      loadModel()
    }
  }, [selectedSpecialist])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSpecialistSelect = (specialist: Specialist) => {
    setSelectedSpecialist(specialist)
    setMessages([])
    setUploadError(null)
    setModelError(null)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !selectedSpecialist || modelLoading) return

    const userMessage = inputMessage.trim()
    setMessages(prev => [...prev, { text: userMessage, isUser: true }])
    setInputMessage('')
    setIsLoading(true)

    try {
      const specialist = specialists.find(s => s.id === selectedSpecialist)
      if (specialist) {
        const response = await specialist.model.predictCondition(userMessage)
        setMessages(prev => [...prev, { text: response, isUser: false }])
      }
    } catch (error) {
      console.error('Error getting response:', error)
      setMessages(prev => [...prev, { 
        text: 'I apologize, but I encountered an error. Please try again.',
        isUser: false 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!selectedSpecialist) return

    setIsLoading(true)
    setUploadError(null)

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file')
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB')
      }

      // Create object URL for local preview
      const imageUrl = URL.createObjectURL(file)

      // Add image message to chat
      setMessages(prev => [...prev, {
        text: `Analyzing image: ${file.name}...`,
        isUser: true,
        image: {
          url: imageUrl,
          name: file.name
        }
      }])

      // Convert image to base64
      const base64Image = await fileToBase64(file)

      // Get AI analysis of the image
      const specialist = specialists.find(s => s.id === selectedSpecialist)
      if (specialist) {
        setMessages(prev => [...prev, {
          text: 'Analyzing the image... Please wait.',
          isUser: false
        }])

        const analysis = await analyzeImage(base64Image, specialist.title)
        
        setMessages(prev => {
          // Remove the "analyzing" message
          const newMessages = prev.filter(msg => msg.text !== 'Analyzing the image... Please wait.')
          return [...newMessages, {
            text: analysis,
            isUser: false
          }]
        })
      }

    } catch (error) {
      console.error('Error processing image:', error)
      setUploadError(error instanceof Error ? error.message : 'Error processing image')
      setMessages(prev => [...prev, {
        text: 'I apologize, but I encountered an error while analyzing the image. Please try again or provide more details about your concerns.',
        isUser: false
      }])
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-[#1a1d27] rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">AI Medical Assistant</h1>
            <p className="text-gray-400 text-sm mt-1">
              Chat with our AI to get medical advice and information. Note: This is not a replacement for professional medical consultation.
            </p>
          </div>

          <div className="flex h-[600px]">
            {/* Specialists Sidebar */}
            <div className="w-80 bg-[#1a1d27] border-r border-gray-700 p-4 flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <h2 className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                  <CircleUserRound className="h-4 w-4" />
                  Medical Specialists
                </h2>
                <div className="space-y-1.5">
                  {specialists.map((specialist) => (
                    <button
                      key={specialist.id}
                      onClick={() => handleSpecialistSelect(specialist.id)}
                      disabled={modelLoading}
                      className={`w-full py-2 px-3 rounded-lg flex items-center gap-2 transition-colors text-sm ${
                        selectedSpecialist === specialist.id
                          ? 'bg-[#4f46e5] text-white'
                          : modelLoading
                          ? 'bg-[#2d3139] text-gray-500 cursor-not-allowed opacity-50'
                          : 'bg-[#2d3139] text-gray-300 hover:bg-[#3d424d]'
                      }`}
                    >
                      <specialist.icon className="h-4 w-4 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium leading-tight">{specialist.title}</div>
                        <div className="text-xs opacity-75 truncate">{specialist.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Medical Images Section */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <h2 className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Medical Images
                </h2>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!selectedSpecialist || isLoading || modelLoading}
                  className={`w-full py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    !selectedSpecialist || isLoading || modelLoading
                      ? 'bg-[#2d3139] text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-[#2d3139] text-gray-300 hover:bg-[#3d424d]'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Upload Image</span>
                </button>
                {uploadError && (
                  <p className="text-red-500 text-xs mt-2 text-center">
                    {uploadError}
                  </p>
                )}
                {!selectedSpecialist && (
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    Select a specialist to upload images
                  </p>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-[#1a1d27]">
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                {modelLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-[#4f46e5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading AI model...</p>
                    </div>
                  </div>
                ) : modelError ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-red-500">
                      <p>{modelError}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.isUser
                              ? 'bg-[#4f46e5] text-white'
                              : 'bg-[#2d3139] text-gray-200'
                          }`}
                        >
                          {message.text}
                          {message.image && (
                            <div className="mt-2">
                              <img
                                src={message.image.url}
                                alt={message.image.name}
                                className="max-w-full rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-700 p-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Describe your symptoms or ask a medical question..."
                    className="flex-1 rounded-lg bg-[#2d3139] border border-gray-600 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#4f46e5]"
                    disabled={!selectedSpecialist || isLoading || modelLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!selectedSpecialist || isLoading || modelLoading || !inputMessage.trim()}
                    className="bg-[#4f46e5] text-white rounded-lg px-4 py-2 hover:bg-[#4338ca] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-12"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage