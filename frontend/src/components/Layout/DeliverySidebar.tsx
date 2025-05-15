import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Gauge,
  MapPin,
  Bell,
  ClipboardList,
  DollarSign,
  User,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const navItems = [
  { path: "/deliver", label: "Dashboard", icon: Gauge },
  { path: "/deliver/live-tracking", label: "Live Tracking", icon: MapPin },
  { path: "/deliver/notifications", label: "Notifications", icon: Bell },
  { path: "/deliver/delivery-details", label: "Order Details", icon: ClipboardList },
  { path: "/deliver/earning", label: "Earning", icon: DollarSign },
  { path: "/deliver/profile", label: "Profile", icon: User },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col p-4 border-r border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-semibold text-[#FF6B00]">Delivery Dashboard</h3>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-[#FFD600]/20 text-[#FF6B00] font-semibold"
                  : "text-gray-300 hover:bg-gray-800 hover:text-[#FF6B00]"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      {/* <button className="mt-6 bg-[#FF3D00] text-white px-4 py-2 rounded-lg hover:bg-[#e53900] transition">
        Logout
      </button> */}
    </aside>
  );
};

export default Sidebar;
