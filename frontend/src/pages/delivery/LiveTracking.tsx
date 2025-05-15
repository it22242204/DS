import React, { useState } from "react";
import Sidebar from "../../components/Layout/DeliverySidebar";
// import Footer from "../../components/delivery/Footer";
import LiveMap from "../../components/livemap/LiveMap";
import { CheckCircle, MapPin } from "lucide-react";

// Define the shape of location state
interface Location {
  lat: number;
  lng: number;
}

const LiveTracking: React.FC = () => {
  const [status, setStatus] = useState<string>("Assigned");
  const [location, setLocation] = useState<Location>({
    lat: 6.9271,
    lng: 79.8612,
  }); // Default: Colombo coordinates
  const [darkTheme, setDarkTheme] = useState<boolean>(false); // For dark theme toggle

  // Handle "Picked Up" button click
  const handlePickedUp = () => {
    setStatus("Picked Up");
    // Backend call here if necessary
  };

  // Handle "Delivered" button click
  const handleDelivered = () => {
    setStatus("Delivered");
    // Backend call here if necessary
  };

  // Toggle theme between dark and light mode
  const toggleTheme = () => {
    setDarkTheme((prev) => !prev);
  };

  return (
    <div className={darkTheme ? "bg-gray-900 text-white" : "bg-softWhite text-gray-900"}>
      <div className="flex min-h-[85vh]">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className={`max-w-5xl mx-auto ${darkTheme ? "bg-gray-800" : "bg-white"} p-8 rounded-lg shadow-lg`}>
          <div className="flex justify-between items-center mb-6">
  <h2 className={`text-3xl font-bold flex items-center gap-2 ${darkTheme ? "text-white" : "text-gray-900"}`}>
    <MapPin className="text-deepBlue" />
    Live Delivery Tracking
  </h2>
  <span
    className={`text-md font-semibold px-4 py-2 rounded-lg ${
      status === "Delivered"
        ? "bg-limeGreen text-deepCharcoal"
        : status === "Picked Up"
        ? "bg-blue-600 text-white"
        : "bg-yellow-400 text-deepCharcoal"
    }`}
  >
    {status}
  </span>
</div>


            {/* Live Map Section */}
            <div className="h-80 rounded-lg overflow-hidden mb-6 border border-coolGray">
              <LiveMap coordinates={location} darkTheme={darkTheme} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
  <button
    onClick={handlePickedUp}
    disabled={status !== "Assigned"}
    className={`px-6 py-3 rounded-lg transition font-medium ${
      status !== "Assigned"
        ? darkTheme
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
        : darkTheme
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-blue-500 text-white hover:bg-blue-600"
    }`}
  >
    Mark as Picked Up
  </button>

  <button
    onClick={handleDelivered}
    disabled={status !== "Picked Up"}
    className={`px-6 py-3 rounded-lg transition font-medium ${
      status !== "Picked Up"
        ? darkTheme
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
        : darkTheme
        ? "bg-green-600 text-white hover:bg-green-700"
        : "bg-green-500 text-white hover:bg-green-600"
    }`}
  >
    Mark as Delivered
  </button>
</div>


          </div>
        </main>
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full fixed top-4 right-4 bg-gray-800 text-white"
      >
        {darkTheme ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
};

export default LiveTracking;
