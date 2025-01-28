import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../Auth/AuthContext';
import { ThemeContext } from '../../../context/ThemeContext';
import Header from './Header';

const Setting = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    assistantEnabled: false,
    notificationsEnabled: false,
    language: 'en',
    // New equipment settings
    ovenEnabled: true,
    mixerEnabled: true,
    refrigeratorEnabled: true,
    blenderEnabled: true,
    equipmentMaintenanceReminders: true,
    automaticShutoff: true,
    temperatureUnit: 'celsius',
    weightUnit: 'kg'
  });
  const { theme, setTheme } = useContext(ThemeContext);
  // ... other state and context

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    setSettings({ ...settings, theme: newTheme });
    updateSettings({ ...settings, theme: newTheme });
  };
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/settings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSettings = async (updatedSettings) => {
    try {
      const response = await fetch('http://localhost:8081/api/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  // Existing handlers
  const handleAssistantToggle = () => {
    const newAssistantEnabled = !settings.assistantEnabled;
    setSettings({ ...settings, assistantEnabled: newAssistantEnabled });
    updateSettings({ ...settings, assistantEnabled: newAssistantEnabled });
  };

  const handleNotificationsToggle = () => {
    const newNotificationsEnabled = !settings.notificationsEnabled;
    setSettings({ ...settings, notificationsEnabled: newNotificationsEnabled });
    updateSettings({ ...settings, notificationsEnabled: newNotificationsEnabled });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSettings({ ...settings, language: newLanguage });
    updateSettings({ ...settings, language: newLanguage });
  };

  // New handlers for equipment settings
  const handleEquipmentToggle = (equipment) => {
    const newValue = !settings[`${equipment}Enabled`];
    setSettings({ ...settings, [`${equipment}Enabled`]: newValue });
    updateSettings({ ...settings, [`${equipment}Enabled`]: newValue });
  };

  const handleMaintenanceRemindersToggle = () => {
    const newValue = !settings.equipmentMaintenanceReminders;
    setSettings({ ...settings, equipmentMaintenanceReminders: newValue });
    updateSettings({ ...settings, equipmentMaintenanceReminders: newValue });
  };

  const handleAutomaticShutoffToggle = () => {
    const newValue = !settings.automaticShutoff;
    setSettings({ ...settings, automaticShutoff: newValue });
    updateSettings({ ...settings, automaticShutoff: newValue });
  };

  const handleUnitChange = (type, value) => {
    setSettings({ ...settings, [`${type}Unit`]: value });
    updateSettings({ ...settings, [`${type}Unit`]: value });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <Header title="Settings" />
      <main className="p-6 max-w-full">
        <div className={`rounded-lg shadow p-6 w-full ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          {/* General Settings Section */}
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">General Settings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="w-full">
              <label className={`block text-sm font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>Theme</label>
              <select
                value={settings.theme}
                onChange={handleThemeChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                }`}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className={`mt-4 p-4 border rounded-lg ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
              <label className="block text-gray-700 text-sm font-bold mb-2">Language</label>
              <select
                value={settings.language}
                onChange={handleLanguageChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
              </select>
            </div>

            <div className={`mt-4 p-4 border rounded-lg ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
              <label className="block text-gray-700 text-sm font-bold mb-2">Assistant</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.assistantEnabled}
                  onChange={handleAssistantToggle}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="ml-3">Enable Assistant</span>
              </div>
            </div>

            <div className={`mt-4 p-4 border rounded-lg ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
              <label className="block text-gray-700 text-sm font-bold mb-2">Notifications</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={handleNotificationsToggle}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="ml-3">Enable Notifications</span>
              </div>
            </div>
          </div>

          {/* Equipment Settings Section */}
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">Equipment Settings</h2>
          <div className="space-y-6">
            {/* Equipment Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Oven', 'Mixer', 'Refrigerator', 'Blender'].map((equipment) => (
                <div key={equipment} className="w-full p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{equipment}</span>
                    <input
                      type="checkbox"
                      checked={settings[`${equipment.toLowerCase()}Enabled`]}
                      onChange={() => handleEquipmentToggle(equipment.toLowerCase())}
                      className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Equipment Safety & Maintenance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Maintenance Reminders</h3>
                    <p className="text-sm text-gray-500">Get notifications for equipment maintenance</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.equipmentMaintenanceReminders}
                    onChange={handleMaintenanceRemindersToggle}
                    className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="w-full p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Automatic Shutoff</h3>
                    <p className="text-sm text-gray-500">Enable automatic equipment shutdown</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.automaticShutoff}
                    onChange={handleAutomaticShutoffToggle}
                    className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Measurement Units */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <label className="block text-gray-700 text-sm font-bold mb-2">Temperature Unit</label>
                <select
                  value={settings.temperatureUnit}
                  onChange={(e) => handleUnitChange('temperature', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="celsius">Celsius (°C)</option>
                  <option value="fahrenheit">Fahrenheit (°F)</option>
                </select>
              </div>

              <div className="w-full">
                <label className="block text-gray-700 text-sm font-bold mb-2">Weight Unit</label>
                <select
                  value={settings.weightUnit}
                  onChange={(e) => handleUnitChange('weight', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lbs">Pounds (lbs)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Setting;