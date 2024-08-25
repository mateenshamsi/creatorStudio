// src/components/Sidebar.tsx

import React from 'react';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';

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

export default Sidebar;
