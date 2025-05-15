import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Layout/DeliverySidebar";
import { Bell } from "lucide-react";
import axios from "axios";

// Update type if needed to match MongoDB structure
interface Notification {
  _id: string;
  message: string;
  createdAt: string;
}

function Notifications(): JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = "680a84e358564da5fb0a6758"; // Replace this with auth-based user ID

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:5200/api/delivery/getAllNotifications`);
        setNotifications(res.data.notifications); // ✅ Access the array inside the object
      } catch (err) {
        setError("Could not fetch notifications");
      } finally {
        setLoading(false);
      }
    };
  
    fetchNotifications();
  }, []);
  

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString(); // or format as needed
  };

  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <div className="flex h-[85vh] bg-gray-100 dark:bg-gray-900">
        <Sidebar />

        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-6 flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-500" />
              Notifications
            </h2>

            {loading ? (
              <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : notifications.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">No notifications found.</p>
            ) : (
              <div className="h-[400px] overflow-y-scroll pr-2">
              <ul className="space-y-4">
                {notifications.map((note) => (
                  <li
                    key={note._id}
                    className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300"
                  >
                    <p className="text-gray-700 dark:text-gray-100">{note.message}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatTimestamp(note.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
