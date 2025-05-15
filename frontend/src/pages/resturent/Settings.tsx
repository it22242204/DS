import React, { useState, useEffect } from "react";
import ResturentSidebar from "../../components/Layout/ResturentSidebar";
import axios from "axios";
import { Clock, Map, CreditCard, Bell, Store } from "lucide-react";

interface RestaurantSettings {
  restaurantInfo: {
    name: string;
    description: string;
    cuisineType: string;
    averagePreparationTime: number;
  };
  operatingHours: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };
  deliverySettings: {
    radius: number;
    minimumOrderAmount: number;
    freeDeliveryThreshold: number;
  };
  paymentOptions: {
    cashOnDelivery: boolean;
    creditCard: boolean;
    mobilePayment: boolean;
  };
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    pushNotifications: boolean;
  };
}

function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get("http://localhost:5200/api/restaurant/settings");
        setSettings(response.data);
      } catch (error) {
        console.error("Error fetching restaurant settings:", error);
        // Set default settings if fetch fails
        setSettings({
          restaurantInfo: {
            name: "Your Restaurant",
            description: "Delicious food delivered fast",
            cuisineType: "Mixed",
            averagePreparationTime: 20
          },
          operatingHours: {
            monday: { open: "09:00", close: "22:00", isOpen: true },
            tuesday: { open: "09:00", close: "22:00", isOpen: true },
            wednesday: { open: "09:00", close: "22:00", isOpen: true },
            thursday: { open: "09:00", close: "22:00", isOpen: true },
            friday: { open: "09:00", close: "23:00", isOpen: true },
            saturday: { open: "09:00", close: "23:00", isOpen: true },
            sunday: { open: "10:00", close: "22:00", isOpen: true }
          },
          deliverySettings: {
            radius: 5,
            minimumOrderAmount: 10,
            freeDeliveryThreshold: 25
          },
          paymentOptions: {
            cashOnDelivery: true,
            creditCard: true,
            mobilePayment: false
          },
          notificationPreferences: {
            email: true,
            sms: false,
            pushNotifications: true
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (section, field, value) => {
    if (!settings) return;
    
    const updatedSettings = { ...settings };
    
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.');
      updatedSettings[section][parentField][childField] = value;
    } else {
      updatedSettings[section][field] = value;
    }
    
    setSettings(updatedSettings);
  };

  const handleSubmit = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    setSaveMessage({ text: "", type: "" });
    
    try {
      // Replace with your actual API endpoint
      await axios.put("http://localhost:5200/api/restaurant/settings", settings);
      setSaveMessage({ text: "Settings saved successfully!", type: "success" });
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveMessage({ text: "Failed to save settings. Please try again.", type: "error" });
    } finally {
      setIsSaving(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage({ text: "", type: "" });
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[85vh] bg-softWhite dark:bg-gray-900">
        <ResturentSidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-300">Loading settings...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-[85vh] bg-softWhite dark:bg-gray-900 text-deepCharcoal dark:text-white">
      <ResturentSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Restaurant Settings</h1>

        {/* Settings Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            {[
              { id: "general", label: "General Information", icon: <Store className="w-4 h-4 mr-2" /> },
              { id: "hours", label: "Operating Hours", icon: <Clock className="w-4 h-4 mr-2" /> },
              { id: "delivery", label: "Delivery Settings", icon: <Map className="w-4 h-4 mr-2" /> },
              { id: "payment", label: "Payment Options", icon: <CreditCard className="w-4 h-4 mr-2" /> },
              { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4 mr-2" /> }
            ].map(tab => (
              <li className="mr-2" key={tab.id}>
                <button 
                  onClick={() => setActiveTab(tab.id)} 
                  className={`inline-flex items-center py-4 px-4 text-sm font-medium rounded-t-lg border-b-2 ${
                    activeTab === tab.id 
                      ? "text-[#FF6B00] border-[#FF6B00]" 
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Settings Content */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          {/* General Information */}
          {activeTab === "general" && settings && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">General Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                  value={settings.restaurantInfo.name}
                  onChange={(e) => handleChange('restaurantInfo', 'name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                  value={settings.restaurantInfo.description}
                  onChange={(e) => handleChange('restaurantInfo', 'description', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cuisine Type
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                    value={settings.restaurantInfo.cuisineType}
                    onChange={(e) => handleChange('restaurantInfo', 'cuisineType', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Average Preparation Time (minutes)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                    value={settings.restaurantInfo.averagePreparationTime}
                    onChange={(e) => handleChange('restaurantInfo', 'averagePreparationTime', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Operating Hours */}
          {activeTab === "hours" && settings && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>
              
              {Object.entries(settings.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4 py-2 border-b dark:border-gray-700">
                  <div className="w-28 font-medium capitalize">{day}</div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] rounded"
                      checked={hours.isOpen}
                      onChange={(e) => handleChange('operatingHours', `${day}.isOpen`, e.target.checked)}
                    />
                    <span className="text-sm">Open</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      className="p-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                      value={hours.open}
                      onChange={(e) => handleChange('operatingHours', `${day}.open`, e.target.value)}
                      disabled={!hours.isOpen}
                    />
                    <span>to</span>
                    <input
                      type="time"
                      className="p-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                      value={hours.close}
                      onChange={(e) => handleChange('operatingHours', `${day}.close`, e.target.value)}
                      disabled={!hours.isOpen}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Delivery Settings */}
          {activeTab === "delivery" && settings && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Delivery Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Delivery Radius (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                  value={settings.deliverySettings.radius}
                  onChange={(e) => handleChange('deliverySettings', 'radius', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Order Amount (Rs.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                  value={settings.deliverySettings.minimumOrderAmount}
                  onChange={(e) => handleChange('deliverySettings', 'minimumOrderAmount', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Free Delivery Threshold (Rs.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                  value={settings.deliverySettings.freeDeliveryThreshold}
                  onChange={(e) => handleChange('deliverySettings', 'freeDeliveryThreshold', parseFloat(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* Payment Options */}
          {activeTab === "payment" && settings && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="cashOnDelivery"
                    className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded"
                    checked={settings.paymentOptions.cashOnDelivery}
                    onChange={(e) => handleChange('paymentOptions', 'cashOnDelivery', e.target.checked)}
                  />
                  <label htmlFor="cashOnDelivery" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Cash on Delivery
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="creditCard"
                    className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded"
                    checked={settings.paymentOptions.creditCard}
                    onChange={(e) => handleChange('paymentOptions', 'creditCard', e.target.checked)}
                  />
                  <label htmlFor="creditCard" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Credit Card
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="mobilePayment"
                    className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded"
                    checked={settings.paymentOptions.mobilePayment}
                    onChange={(e) => handleChange('paymentOptions', 'mobilePayment', e.target.checked)}
                  />
                  <label htmlFor="mobilePayment" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Mobile Payment
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Notification Preferences */}
          {activeTab === "notifications" && settings && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="email"
                    className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded"
                    checked={settings.notificationPreferences.email}
                    onChange={(e) => handleChange('notificationPreferences', 'email', e.target.checked)}
                  />
                  <label htmlFor="email" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Email Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sms"
                    className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded"
                    checked={settings.notificationPreferences.sms}
                    onChange={(e) => handleChange('notificationPreferences', 'sms', e.target.checked)}
                  />
                  <label htmlFor="sms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    SMS Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="push"
                    className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded"
                    checked={settings.notificationPreferences.pushNotifications}
                    onChange={(e) => handleChange('notificationPreferences', 'pushNotifications', e.target.checked)}
                  />
                  <label htmlFor="push" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Push Notifications
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="mt-6 flex justify-end">
            {saveMessage.text && (
              <div className={`mr-4 text-sm ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {saveMessage.text}
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="bg-[#FF6B00] text-white px-6 py-2 rounded-lg hover:bg-[#e65a00] transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
