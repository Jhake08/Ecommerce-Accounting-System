'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/', icon: 'ri-dashboard-line' },
    { id: 'transactions', label: 'Transactions', href: '/transactions', icon: 'ri-exchange-line' },
    { id: 'bills', label: 'Due Bills', href: '/bills', icon: 'ri-file-list-line' },
    { id: 'reports', label: 'Reports', href: '/reports', icon: 'ri-bar-chart-line' },
    { id: 'settings', label: 'Settings', href: '/settings', icon: 'ri-settings-line' }
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <i className="ri-calculator-line text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AccounTech Pro
              </h1>
              <p className="text-sm text-gray-500">Professional Accounting System</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className="whitespace-nowrap"
              >
                <div className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}>
                  <i className={`${item.icon} text-lg`}></i>
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                <i className="ri-notification-line text-gray-600 text-xl"></i>
              </button>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-medium">3</span>
              </div>
            </div>
            
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300">
              <i className="ri-user-line text-white text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}