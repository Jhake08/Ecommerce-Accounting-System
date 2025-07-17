'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import GeneralSettings from './GeneralSettings';
import AccountSettings from './AccountSettings';
import IntegrationSettings from './IntegrationSettings';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import BackupSettings from './BackupSettings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const settingsTabs = [
    { id: 'general', label: 'General', icon: 'ri-settings-line' },
    { id: 'account', label: 'Account', icon: 'ri-user-line' },
    { id: 'integrations', label: 'Integrations', icon: 'ri-plug-line' },
    { id: 'notifications', label: 'Notifications', icon: 'ri-notification-line' },
    { id: 'security', label: 'Security', icon: 'ri-shield-check-line' },
    { id: 'backup', label: 'Backup & Export', icon: 'ri-cloud-line' },
  ];

  const handleSaveSettings = async (settingsData: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving settings');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings onSave={handleSaveSettings} isLoading={isLoading} />;
      case 'account':
        return <AccountSettings onSave={handleSaveSettings} isLoading={isLoading} />;
      case 'integrations':
        return <IntegrationSettings onSave={handleSaveSettings} isLoading={isLoading} />;
      case 'notifications':
        return <NotificationSettings onSave={handleSaveSettings} isLoading={isLoading} />;
      case 'security':
        return <SecuritySettings onSave={handleSaveSettings} isLoading={isLoading} />;
      case 'backup':
        return <BackupSettings onSave={handleSaveSettings} isLoading={isLoading} />;
      default:
        return <GeneralSettings onSave={handleSaveSettings} isLoading={isLoading} />;
    }
  };

  return (
    <div className=\"min-h-screen bg-gray-50\">
      <Header />
      
      <main className=\"p-6 space-y-6\">
        {/* Header Section */}
        <div className=\"bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl p-8 text-white relative overflow-hidden\">
          <div className=\"absolute inset-0 bg-black opacity-10\"></div>
          <div className=\"relative z-10\">
            <div className=\"flex items-center justify-between\">
              <div>
                <h1 className=\"text-3xl font-bold mb-2\">Settings & Configuration</h1>
                <p className=\"text-gray-300 text-lg\">Customize your accounting system preferences</p>
                <div className=\"flex items-center space-x-6 mt-4\">
                  <div className=\"flex items-center space-x-2\">
                    <i className=\"ri-settings-line text-xl\"></i>
                    <span>System Configuration</span>
                  </div>
                  <div className=\"flex items-center space-x-2\">
                    <i className=\"ri-shield-check-line text-xl\"></i>
                    <span>Security & Privacy</span>
                  </div>
                  <div className=\"flex items-center space-x-2\">
                    <i className=\"ri-cloud-line text-xl\"></i>
                    <span>Cloud Integration</span>
                  </div>
                </div>
              </div>
              {saveMessage && (
                <div className={`px-4 py-2 rounded-xl ${saveMessage.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  <i className={`${saveMessage.includes('Error') ? 'ri-error-warning-line' : 'ri-check-line'} mr-2`}></i>
                  {saveMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className=\"grid grid-cols-1 lg:grid-cols-4 gap-6\">
          {/* Settings Navigation */}
          <div className=\"lg:col-span-1\">
            <div className=\"bg-white rounded-2xl shadow-lg border border-gray-100 p-6\">
              <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Settings Categories</h3>
              <nav className=\"space-y-2\">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gray-100 text-gray-900 border-2 border-gray-300'
                        : 'text-gray-600 hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <i className={`${tab.icon} text-lg`}></i>
                    <span className=\"font-medium\">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* System Status */}
              <div className=\"mt-8 p-4 bg-green-50 rounded-xl\">
                <div className=\"flex items-center space-x-2 mb-2\">
                  <div className=\"w-3 h-3 bg-green-500 rounded-full\"></div>
                  <span className=\"text-sm font-medium text-green-800\">System Status</span>
                </div>
                <p className=\"text-xs text-green-600\">All systems operational</p>
                <div className=\"mt-3 space-y-1\">
                  <div className=\"flex justify-between text-xs\">
                    <span className=\"text-gray-600\">Database</span>
                    <span className=\"text-green-600\">Online</span>
                  </div>
                  <div className=\"flex justify-between text-xs\">
                    <span className=\"text-gray-600\">Google Sheets</span>
                    <span className=\"text-green-600\">Connected</span>
                  </div>
                  <div className=\"flex justify-between text-xs\">
                    <span className=\"text-gray-600\">Backup</span>
                    <span className=\"text-green-600\">Up to date</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className=\"lg:col-span-3\">
            {renderActiveTab()}
          </div>
        </div>
      </main>
    </div>
  );
}