import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Layout/DeliverySidebar";
import { MapPin, ClipboardList } from "lucide-react";

// 1. Define types
interface Delivery {
  _id: string;
  restaurantId: string;
  customerId: string;
  restaurantName: string;
  pickupLocation: {
    location: string;
    city: string;
  };
  dropLocation: {
    location: string;
    city: string;
  };
  items: string[];
  status: string;
}

const DeliveryDetails = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const baseUrl = "http://localhost:5200"; // fallback

  const getAuthToken = () => localStorage.getItem("token");

  const statuses = ["Pending", "Assigned", "Picked Up", "In Transit", "Delivered", "Cancelled"];

  //  Get next status
  const getNextStatus = (currentStatus: string) => {
    const index = statuses.indexOf(currentStatus);
    if (index !== -1 && index < statuses.length - 2) {
      return statuses[index + 1];
    }
    return null;
  };

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/delivery/userDeliveries`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        const data = await response.json();
        console.log("API Response:", data);

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch deliveries.");
        }

        if (data.deliveries && data.deliveries.length > 0) {
          setDeliveries(data.deliveries);
        } else {
          setErrorMsg("No deliveries found for this driver.");
        }
      } catch (err: any) {
        setErrorMsg(err.message);
        console.error("Error fetching deliveries:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const updateDeliveryStatusLocal = (id: string, newStatus: string) => {
    setDeliveries((prev) =>
      prev.map((delivery) =>
        delivery._id === id ? { ...delivery, status: newStatus } : delivery
      )
    );
  };

  const handleAccept = async (deliveryId: string, customerId: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/delivery/updateStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryId, status: "Assigned" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Send notification
      await fetch(`${baseUrl}/api/delivery/createNotification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: customerId,
          message: "Your order has been accepted by the driver and is on the way!",
        }),
      });

      updateDeliveryStatusLocal(deliveryId, "Assigned");
    } catch (err: any) {
      console.error("Failed to accept delivery:", err.message);
    }
  };

  const handleReject = async (deliveryId: string, customerId: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/delivery/updateStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryId, status: "Cancelled" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);


      // Send notification
      await fetch(`${baseUrl}/api/delivery/createNotification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: customerId,
          message: "Unfortunately, your delivery was cancelled by the driver. Searching for another driver!",
        }),
      });

      // Reassign driver
      await fetch(`${baseUrl}/api/delivery/reassignDriver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryId }),
      });

      updateDeliveryStatusLocal(deliveryId, "Cancelled");
    } catch (err: any) {
      console.error("Failed to reject and reassign delivery:", err.message);
    }
  };

  const handleNextStage = async (deliveryId: string, currentStatus: string, customerId: string) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;
  
    try {
      const res = await fetch(`${baseUrl}/api/delivery/updateStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryId, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
  
      // Generate a message based on the next status
      let message = "";
  
      switch (nextStatus) {
        case "Picked Up":
          message = "Your order has been picked up by the driver!";
          break;
        case "In Transit":
          message = "Your order is on the way to your location!";
          break;
        case "Delivered":
          message = "Your order has been delivered successfully. Thank you for using our service!";
          break;
        default:
          message = `Delivery status updated to ${nextStatus}.`;
          break;
      }
  
      // Send notification
      await fetch(`${baseUrl}/api/delivery/createNotification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: customerId,
          message: message,
        }),
      });
  
      updateDeliveryStatusLocal(deliveryId, nextStatus);
    } catch (err: any) {
      console.error("Failed to update delivery status:", err.message);
    }
  };
  
  return (
    <div className="flex min-h-[85vh] bg-gray-100 dark:bg-gray-900 transition-colors">
      <Sidebar />
      <div className="flex-1 p-6 space-y-6">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading deliveries...</p>
        ) : errorMsg ? (
          <p className="text-center text-red-500 dark:text-red-400 text-lg font-semibold">{errorMsg}</p>
        ) : deliveries.length === 0 ? (
          <p className="text-center text-red-500 dark:text-red-400 text-lg font-semibold">
            No deliveries found for this driver
          </p>
        ) : (
          deliveries.map((delivery) => {
            const status = delivery.status || "Pending";
            return (
              <div
                key={delivery._id}
                className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 flex items-center gap-2">
                    <ClipboardList className="text-blue-500 dark:text-blue-400" />
                    Delivery Details
                  </h2>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-medium ${
                      status === "Assigned"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : status === "Rejected" || status === "Cancelled"
                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Restaurant:</strong> {delivery.restaurantName}
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-yellow-500" />
                    <strong>Pickup Address:</strong> {delivery.pickupLocation.location}, {delivery.pickupLocation.city}
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-yellow-500" />
                    <strong>Customer Address:</strong> {delivery.dropLocation.location}, {delivery.dropLocation.city}
                  </p>

                  {delivery.items && delivery.items.length > 0 && (
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Items:</strong>{" "}
                      {delivery.items.map((item, i) => (
                        <span key={i}>
                          {item}
                          {i < delivery.items.length - 1 && ", "}
                        </span>
                      ))}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                {status === "pending" ? (
  <div className="flex space-x-4">
    <button
      onClick={() => handleAccept(delivery._id, delivery.customerId)}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
    >
      Accept Delivery
    </button>
    <button
      onClick={() => handleReject(delivery._id, delivery.customerId)}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
    >
      Reject Delivery
    </button>
  </div>
) : status !== "Cancelled" && status !== "Delivered" ? (
  <div className="flex space-x-4">
    <button
  onClick={() => handleNextStage(delivery._id, status, delivery.customerId)}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
>
  Move to {getNextStatus(status)}
</button>
  </div>
) : (
  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
    Current Status: {status}
  </p>
)}

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DeliveryDetails;
