'use client';

import { useState } from 'react';

interface GeneralSettingsProps {
  onSave: (data: any) => void;
  isLoading: boolean;
}

export default function GeneralSettings({ onSave, isLoading }: GeneralSettingsProps) {
  const [settings, setSettings] = useState({
    companyName: 'AccounTech Pro',
    companyAddress: '123 Business Street, Metro Manila, Philippines',
    companyPhone: '+63 2 123 4567',
    companyEmail: 'contact@accountech.pro',
    currency: 'PHP',
    dateFormat: 'MM/DD/YYYY',
    timeZone: 'Asia/Manila',
    fiscalYearStart: 'January',
    language: 'English',
    defaultTaxRate: '12',
    roundingPrecision: '2',
    autoSave: true,
    darkMode: false,
    compactView: false
  });

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  const currencies = [
    { code: 'PHP', name: 'Philippine Peso (₱)' },
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' }
  ];

  const dateFormats = [
    'MM/DD/YYYY',
    'DD/MM/YYYY',
    'YYYY-MM-DD',
    'DD-MMM-YYYY'
  ];

  const timeZones = [
    'Asia/Manila',
    'UTC',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo'
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className=\"bg-white rounded-2xl shadow-lg border border-gray-100 p-6\">
      <div className=\"flex items-center justify-between mb-6\">
        <h2 className=\"text-2xl font-bold text-gray-900\">General Settings</h2>
        <i className=\"ri-settings-line text-2xl text-gray-400\"></i>
      </div>

      <form onSubmit={handleSubmit} className=\"space-y-8\">
        {/* Company Information */}
        <div>
          <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Company Information</h3>
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Company Name
              </label>
              <input
                type=\"text\"
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200\"
              />
            </div>

            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Email Address
              </label>
              <input
                type=\"email\"
                value={settings.companyEmail}
                onChange={(e) => handleChange('companyEmail', e.target.value)}
                className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200\"
              />
            </div>

            <div className=\"md:col-span-2\">
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Company Address
              </label>
              <textarea
                value={settings.companyAddress}
                onChange={(e) => handleChange('companyAddress', e.target.value)}
                rows={3}
                className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200\"
              />
            </div>

            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Phone Number
              </label>
              <input
                type=\"tel\"
                value={settings.companyPhone}
                onChange={(e) => handleChange('companyPhone', e.target.value)}
                className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200\"
              />
            </div>
          </div>
        </div>

        {/* Localization Settings */}
        <div>
          <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Localization & Format</h3>
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className=\"w-full px-4 py-3 pr-8 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200\"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Date Format
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) => handleChange('dateFormat', e.target.value)}
                className=\"w-full px-4 py-3 pr-8 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200\"
              >
                {dateFormats.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Time Zone
              </label>
              <select
                value={settings.timeZone}
                onChange={(e) => handleChange('timeZone', e.target.value)}
                className=\"w-full px-4 py-3 pr-8 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200\"
              >
                {timeZones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Fiscal Year Start
              </label>
              <select
                value={settings.fiscalYearStart}
                onChange={(e) => handleChange('fiscalYearStart', e.target.value)}
                className=\"w-full px-4 py-3 pr-8 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200\"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div>
          <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Financial Settings</h3>
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Default Tax Rate (%)
              </label>
              <input
                type=\"number\"
                step=\"0.01\"
                value={settings.defaultTaxRate}
                onChange={(e) => handleChange('defaultTaxRate', e.target.value)}
                className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200\"
              />
            </div>

            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Decimal Precision
              </label>
              <select
                value={settings.roundingPrecision}
                onChange={(e) => handleChange('roundingPrecision', e.target.value)}
                className=\"w-full px-4 py-3 pr-8 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200\"
              >
                <option value=\"0\">0 decimal places</option>
                <option value=\"2\">2 decimal places</option>
                <option value=\"4\">4 decimal places</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interface Preferences */}
        <div>
          <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Interface Preferences</h3>
          <div className=\"space-y-4\">
            <div className=\"flex items-center justify-between p-4 bg-gray-50 rounded-xl\">
              <div className=\"flex items-center space-x-3\">
                <i className=\"ri-save-line text-xl text-gray-600\"></i>
                <div>
                  <p className=\"font-medium text-gray-900\">Auto Save</p>
                  <p className=\"text-sm text-gray-600\">Automatically save changes as you work</p>
                </div>
              </div>
              <label className=\"relative inline-flex items-center cursor-pointer\">
                <input
                  type=\"checkbox\"
                  checked={settings.autoSave}
                  onChange={(e) => handleChange('autoSave', e.target.checked)}
                  className=\"sr-only peer\"
                />
                <div className=\"w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600\"></div>
              </label>
            </div>

            <div className=\"flex items-center justify-between p-4 bg-gray-50 rounded-xl\">
              <div className=\"flex items-center space-x-3\">
                <i className=\"ri-moon-line text-xl text-gray-600\"></i>
                <div>
                  <p className=\"font-medium text-gray-900\">Dark Mode</p>
                  <p className=\"text-sm text-gray-600\">Use dark theme for the interface</p>
                </div>
              </div>
              <label className=\"relative inline-flex items-center cursor-pointer\">
                <input
                  type=\"checkbox\"
                  checked={settings.darkMode}
                  onChange={(e) => handleChange('darkMode', e.target.checked)}
                  className=\"sr-only peer\"
                />
                <div className=\"w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600\"></div>
              </label>
            </div>

            <div className=\"flex items-center justify-between p-4 bg-gray-50 rounded-xl\">
              <div className=\"flex items-center space-x-3\">
                <i className=\"ri-layout-line text-xl text-gray-600\"></i>
                <div>
                  <p className=\"font-medium text-gray-900\">Compact View</p>
                  <p className=\"text-sm text-gray-600\">Use smaller spacing and compact layouts</p>
                </div>
              </div>
              <label className=\"relative inline-flex items-center cursor-pointer\">
                <input
                  type=\"checkbox\"
                  checked={settings.compactView}
                  onChange={(e) => handleChange('compactView', e.target.checked)}
                  className=\"sr-only peer\"
                />
                <div className=\"w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600\"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className=\"flex justify-end pt-6 border-t border-gray-100\">
          <button
            type=\"submit\"
            disabled={isLoading}
            className=\"px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl hover:from-gray-800 hover:to-black transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-50\"
          >
            {isLoading ? (
              <div className=\"flex items-center space-x-2\">
                <i className=\"ri-loader-4-line animate-spin\"></i>
                <span>Saving...</span>
              </div>
            ) : (
              <div className=\"flex items-center space-x-2\">
                <i className=\"ri-save-line\"></i>
                <span>Save Settings</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}