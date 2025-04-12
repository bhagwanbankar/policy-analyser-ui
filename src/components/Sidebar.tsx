import React from 'react';

const Sidebar: React.FC = () => (
  <aside className="w-64 bg-gray-100 p-4 border-r border-gray-300 hidden md:block">
    <nav className="space-y-4">
      <a href="#" className="block text-gray-700 hover:text-blue-700">Dashboard</a>
      <a href="#" className="block text-gray-700 hover:text-blue-700">Upload Policy</a>
      <a href="#" className="block text-gray-700 hover:text-blue-700">Analysis Reports</a>
      <a href="#" className="block text-gray-700 hover:text-blue-700">Settings</a>
    </nav>
  </aside>
);

export default Sidebar;
