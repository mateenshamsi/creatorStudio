"use client";

import React, { useState } from 'react';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        MyApp
      </div>
      <div className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
              <FaHome className="mr-3" />
              <span>Home</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
              <FaUser className="mr-3" />
              <span>Profile</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
              <FaCog className="mr-3" />
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="p-4 border-t border-gray-700">
        <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
          <FaUser className="mr-3" />
          <span>Logout</span>
        </a>
      </div>
    </div>
  );
};

const ChatGPT: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(input);
        setMessages([...messages, { text: input, sender: 'user' }, { text: result.response.text(), sender: 'bot' }]);
      } catch (error) {
        setMessages([...messages, { text: input, sender: 'user' }, { text: "Something went wrong.", sender: 'bot' }]);
      }
      setInput('');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
          {messages.length === 0 ? (
            <p className="text-gray-500">Start the conversation...</p>
          ) : (
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div key={index} className={`p-2 rounded-lg shadow ${message.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}>
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-white">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // Prevent default behavior (like adding a new line)
                  handleSend(); // Call the function to send the message
                }
              }}
              className="flex-1 p-2 border rounded-l-lg focus:outline-none text-black"
              placeholder="Type your message..."
            />

            <button
              onClick={handleSend}
              className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGPT;
