'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ChevronDown, Edit3, Menu, Send, Mic, ImageIcon, Volume2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { groupModelsByCategory } from "@/libs/modelUtils"
import { getModelMetadata, ModelCategory, ModelMetadata } from '@/types/model'

type Message = {
  text: string;
  sender: 'user' | 'bot';
  file?: File | null;
  fileType?: 'audio' | 'image' | null;
}

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
}

export default function ChatStudio() {
  const [input, setInput] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [modelGroups, setModelGroups] = useState<Record<ModelCategory, ModelMetadata[]>>()
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [isModelsLoading, setIsModelsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<ModelCategory>('chat')
  const [file, setFile] = useState<File | null>(null)

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations')
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations))
    }
  }, [])

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations))
  }, [conversations])

  // Fetch models on mount
  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    setIsModelsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/models')
      if (!response.ok) throw new Error(`Failed to fetch models: ${response.status}`)

      const data = await response.json()
      const modelIds = data.data.map((model: any) => model.id)
      const models = modelIds.map((id: string) => getModelMetadata(id))
      const grouped = groupModelsByCategory(models)

      setModelGroups(grouped)
      setSelectedModel(grouped[activeCategory]?.[0]?.id || null)
    } catch (error) {
      setError(`Failed to fetch models: ${error.message}`)
    } finally {
      setIsModelsLoading(false)
    }
  }

  const handleSend = useCallback(async () => {
    if ((input.trim() || file) && selectedModel) {
      setIsLoading(true)
      setError(null)

      const metadata = getModelMetadata(selectedModel)
      const newMessage: Message = {
        text: input,
        sender: 'user',
        file,
        fileType: metadata.category === 'audio-transcription' ? 'audio' :
          metadata.category === 'vision' ? 'image' : null
      }

      let updatedConversation: Conversation = currentConversation
        ? { ...currentConversation, messages: [...currentConversation.messages, newMessage] }
        : { id: Date.now().toString(), title: input.slice(0, 30), messages: [newMessage] }

      setCurrentConversation(updatedConversation)
      setInput('')
      setFile(null)

      try {
        const formData = new FormData()
        formData.append('message', input)
        formData.append('model', selectedModel)
        if (file) formData.append('file', file)

        const response = await fetch('/api/sendMessage', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error(`Failed to send message: ${response.status}`)

        const result = await response.json()
        const botMessage: Message = {
          text: result.choices[0]?.message?.content || "No response",
          sender: 'bot'
        }

        updatedConversation.messages.push(botMessage)
      } catch (error) {
        const errorMessage: Message = {
          text: `Error: ${error.message}`,
          sender: 'bot'
        }
        updatedConversation.messages.push(errorMessage)
        setError(error.message)
      } finally {
        setIsLoading(false)
        setCurrentConversation(updatedConversation)
        setConversations(prev =>
          currentConversation
            ? prev.map(conv => conv.id === currentConversation.id ? updatedConversation : conv)
            : [updatedConversation, ...prev]
        )
      }
    }
  }, [input, file, selectedModel, currentConversation])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const startNewConversation = () => {
    if (currentConversation?.messages.length) {
      setConversations(prev => [currentConversation, ...prev.filter(c => c.id !== currentConversation.id)])
    }
    setCurrentConversation(null)
    setIsSidebarOpen(false)
  }

  const renderMessageContent = (message: Message) => {
    if (message.fileType === 'audio') {
      return (
        <audio controls className="mt-2">
          <source src={URL.createObjectURL(message.file!)} type={message.file?.type} />
          Your browser does not support audio playback.
        </audio>
      )
    }
    if (message.fileType === 'image') {
      return (
        <img
          src={URL.createObjectURL(message.file!)}
          alt="Uploaded content"
          className="mt-2 max-w-full rounded"
        />
      )
    }
    return <ReactMarkdown>{message.text}</ReactMarkdown>
  }

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      {/* Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-80 bg-[#2A2A2A] p-0 border-r border-gray-700">
          <div className="p-6 flex items-center justify-between border-b border-gray-700">
            <Button variant="ghost" className="text-white text-xl font-bold" onClick={startNewConversation}>
              Creator Studio
            </Button>
          </div>
          <ScrollArea className="flex-1 h-[calc(100vh-10rem)] px-4">
            <div className="py-6 space-y-4">
              {conversations.map((conv) => (
                <Button
                  key={conv.id}
                  variant="ghost"
                  className="w-full justify-start text-left py-4 px-4"
                  onClick={() => {
                    setCurrentConversation(conv)
                    setIsSidebarOpen(false)
                  }}
                >
                  <div>
                    <div className="font-medium">{conv.title}</div>
                    <div className="text-sm text-gray-400 truncate">
                      {conv.messages[conv.messages.length - 1]?.text?.slice(0, 50) || 'New chat'}...
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <Button
            variant="outline"
            size="icon"
            className="bg-gray-800/50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              size="icon"
              className="bg-gray-800/50 backdrop-blur-sm"
              onClick={startNewConversation}
            >
              <Edit3 className="h-5 w-5" />
            </Button>

            {/* Model Category Tabs */}
            {/* Replace the existing model category tabs with this */}
            <div className="flex space-x-2 overflow-x-auto py-2 px-4">
              {modelGroups && Object.entries(modelGroups).map(([category, models]) => (
                models.length > 0 && (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    className={`whitespace-nowrap ${activeCategory === category ? 'bg-blue-600' : 'bg-[#2A2A2A]'}`}
                    onClick={() => {
                      setActiveCategory(category as ModelCategory);
                      setSelectedModel(models[0]?.id || null);
                    }}
                  >
                    {category === 'audio-transcription' && <Mic className="h-4 w-4 mr-2" />}
                    {category === 'vision' && <ImageIcon className="h-4 w-4 mr-2" />}
                    {category === 'text-to-speech' && <Volume2 className="h-4 w-4 mr-2" />}
                    {category.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                  </Button>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Model Selection Dropdown */}
        {modelGroups && (
          <div className="px-4 py-2 border-b border-gray-700">
            <div className="relative max-w-4xl mx-auto">
              {isModelsLoading ? (
                <div className="bg-[#2A2A2A] text-white border border-gray-600 rounded-md p-2">
                  Loading models...
                </div>
              ) : error ? (
                <div className="bg-[#2A2A2A] text-red-500 border border-gray-600 rounded-md p-2">
                  {error}
                </div>
              ) : (
                <select
                  value={selectedModel || ''}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-[#2A2A2A] text-white border border-gray-600 rounded-md p-2 w-full"
                >
                  {modelGroups[activeCategory]?.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name || model.id}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          {currentConversation ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {currentConversation.messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-700'} max-w-[80%]`}
                >
                  {renderMessageContent(message)}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-center items-center py-4">
                  <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Welcome to Creator Studio</h2>
                <p className="text-gray-400 text-lg">
                  Start a new conversation or select an existing one from the sidebar.
                </p>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-700">
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <div className="flex items-center max-w-4xl mx-auto">
            <Input
              placeholder="Message Creator Studio..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-[#2A2A2A] border-gray-600 focus:border-blue-500 text-lg py-4"
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept={
                activeCategory === 'audio-transcription' ? 'audio/*' :
                  activeCategory === 'vision' ? 'image/*' : '*/*'
              }
              className="ml-4 bg-[#2A2A2A] text-white border border-gray-600 rounded-md p-2"
            />
            <Button
              className="ml-4 bg-blue-600 hover:bg-blue-700"
              size="lg"
              onClick={handleSend}
              disabled={isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-center text-sm text-gray-500 mt-4">
            Creator Studio can make mistakes. Consider checking important information.
          </div>
        </div>
      </div>
    </div>
  )
}