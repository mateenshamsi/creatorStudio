"use client"
import React, { useState } from 'react';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';


const Sidebar  : React.FC = () => {
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
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
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
                <div key={index} className="p-2 bg-white text-black rounded-lg shadow">
                  {message}
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
              className="flex-1 p-2 border rounded-l-lg focus:outline-none"
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
