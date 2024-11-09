// src/app/chatStudio/page.tsx

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronDown, Edit3, Menu, MessageCircle, Send, Plus, X } from 'lucide-react'
import Groq from "groq-sdk";
import ReactMarkdown from 'react-markdown'
import dotenv from 'dotenv';

dotenv.config();

type Message = {
  text: string;
  sender: 'user' | 'bot';
  file?: File | null; // New field for file attachments
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
  const [models, setModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [isModelsLoading, setIsModelsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations')
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations))
  }, [conversations])

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setIsModelsLoading(true);
    setError(null);
    try {
      console.log('Client: Fetching models...');
      const response = await fetch('/api/models');
      console.log('Client: Response status:', response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Client: Model Response:', data);
      if (data && data.data) {
        const modelIds = data.data.map(model => model.id);
        console.log('Client: Fetched Models:', modelIds);
        setModels(modelIds);
        setSelectedModel(modelIds[0]);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Client: Error fetching models:', error);
      setError(`Failed to fetch models: ${error.message}`);
    } finally {
      setIsModelsLoading(false);
    }
  }

  const [file, setFile] = useState<File | null>(null); // New state for file input

  const handleSend = useCallback(async () => {
    if ((input.trim() || file) && selectedModel) {
      setIsLoading(true);
      setError(null);
      const newMessage: Message = { text: input, sender: 'user', file };
      let updatedConversation: Conversation;

      if (currentConversation) {
        updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, newMessage]
        };
      } else {
        updatedConversation = {
          id: Date.now().toString(),
          title: input.slice(0, 30),
          messages: [newMessage]
        };
      }

      setCurrentConversation(updatedConversation);
      setInput('');
      setFile(null); // Clear the file input after sending

      try {
        console.log('Sending message to server...');
        const formData = new FormData();
        formData.append('message', input);
        formData.append('model', selectedModel);
        if (file) {
          formData.append('file', file);
        }

        const response = await fetch('/api/sendMessage', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Server response:', result);
        const botMessage: Message = { text: result.choices[0]?.message?.content || "No response", sender: 'bot' };
        updatedConversation.messages.push(botMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage: Message = { text: "Something went wrong. Please try again.", sender: 'bot' };
        updatedConversation.messages.push(errorMessage);
        setError(`Failed to send message. Please check your API key and network connection. Error: ${error.message}`);
      } finally {
        setIsLoading(false);
        setCurrentConversation(updatedConversation);

        setConversations(prev =>
          currentConversation
            ? prev.map(conv => conv.id === currentConversation.id ? updatedConversation : conv)
            : [updatedConversation, ...prev]
        );
      }
    }
  }, [input, file, selectedModel, currentConversation]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">

          {/* Sidebar Button Menu Open Close */}
          <Button
            variant="outline"
            size="icon"
            className="bg-gray-800/50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Navbar Right HandSide Buttons like New Chat and Model selction */}
          <div className="flex space-x-4">
            {/* New Chat Button  */}
            <Button
              variant="outline"
              size="icon"
              className="bg-gray-800/50 backdrop-blur-sm"
              onClick={startNewConversation}
            >
              <Edit3 className="h-5 w-5" />
            </Button>

            {/* Model Selection  */}
            <div className="relative">
              {isModelsLoading ? (
                <div className="bg-[#2A2A2A] text-white border border-gray-600 rounded-md p-2">Loading models...</div>
              ) : error ? (
                <div className="bg-[#2A2A2A] text-red-500 border border-gray-600 rounded-md p-2">{error}</div>
              ) : (
                <select
                  value={selectedModel || ''}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-[#2A2A2A] text-white border border-gray-600 rounded-md p-2 appearance-none"
                >
                  {models.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              )}
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          {currentConversation ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {currentConversation.messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-700'
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
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} // New state to handle file input
              className="ml-4 bg-[#2A2A2A] text-white border border-gray-600 rounded-md p-2"
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