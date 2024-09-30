'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronDown, Edit3, Menu, MessageCircle, Send, Plus, X } from 'lucide-react'
import { GoogleGenerativeAI } from "@google/generative-ai"
import ReactMarkdown from 'react-markdown'

type Message = {
  text: string;
  sender: 'user' | 'bot';
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

  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations')
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations))
  }, [conversations])

  const handleSend = async () => {
    if (input.trim()) {
      setIsLoading(true)
      const newMessage: Message = { text: input, sender: 'user' }
      let updatedConversation: Conversation

      if (currentConversation) {
        updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, newMessage]
        }
      } else {
        updatedConversation = {
          id: Date.now().toString(),
          title: input.slice(0, 30),
          messages: [newMessage]
        }
      }

      setCurrentConversation(updatedConversation)
      setInput('')

      try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        
        const result = await model.generateContent(input)
        const botMessage: Message = { text: result.response.text(), sender: 'bot' }
        updatedConversation.messages.push(botMessage)
      } catch (error) {
        const errorMessage: Message = { text: "Something went wrong.", sender: 'bot' }
        updatedConversation.messages.push(errorMessage)
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
  }

  const startNewConversation = () => {
    if (currentConversation && currentConversation.messages.length > 0) {
      setConversations(prev => [currentConversation, ...prev.filter(c => c.id !== currentConversation.id)])
    }
    setCurrentConversation(null)
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
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
                      {conv.messages[conv.messages.length - 1].text.slice(0, 50)}...
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-gray-700">
            {/* <Button variant="outline" className="w-full">
              Upgrade plan
            </Button> */}
          </div>
        </SheetContent>
      </Sheet>

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
          <Button
            variant="outline"
            size="icon"
            className="bg-gray-800/50 backdrop-blur-sm"
            onClick={startNewConversation}
          >
            <Edit3 className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          {currentConversation ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {currentConversation.messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.sender === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-700'
                  } max-w-[80%]`}
                >
                  <ReactMarkdown>{message.text}</ReactMarkdown>
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
                <center>
                  {/* TODO: Add SVG logo here */}
                </center>
                <h2 className="text-3xl font-bold mb-4">Welcome to Creator Studio</h2>
                <p className="text-gray-400 text-lg">Start a new conversation or select an existing one from the sidebar.</p>
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center max-w-4xl mx-auto">
            <Input
              placeholder="Message Creator Studio..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              className="flex-1 bg-[#2A2A2A] border-gray-600 focus:border-blue-500 text-lg py-4"
            />
            <Button className="ml-4 bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleSend} disabled={isLoading}>
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