import React, { useState } from "react";
import axios from "axios";

interface DeliveryInfo {
  driverId: string;
  status: string;
  pickupLocation: {
    location: string;
    city: string;
  };
  dropLocation: {
    location: string;
    city: string;
  };
}

const AssignDriverPage: React.FC = () => {
  const [orderId, setOrderId] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);

  const handleAssign = async () => {
    try {
      const res = await axios.post<{ message: string; delivery: DeliveryInfo }>(
        "http://localhost:5200/api/delivery/assignDriver",
        { orderId, customerId, restaurantId },
        {
          withCredentials: true,
        }
      );

      setMessage(res.data.message);
      setDeliveryInfo(res.data.delivery);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex flex-col items-center justify-center transition-colors">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Assign Driver to Order</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md space-y-4 transition-colors">
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
        />
        <input
          type="text"
          placeholder="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
        />
        <input
          type="text"
          placeholder="Restaurant ID"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
        />
        <button
          onClick={handleAssign}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Assign Driver
        </button>
      </div>

      {message && (
        <div className="mt-6 text-center">
          <p className="text-lg font-medium text-gray-800 dark:text-white">{message}</p>
          {deliveryInfo && (
            <div className="mt-4 text-left text-gray-800 dark:text-gray-200">
              <p>
                <strong>Assigned Driver ID:</strong> {deliveryInfo.driverId}
              </p>
              <p>
                <strong>Status:</strong> {deliveryInfo.status}
              </p>
              <p>
                <strong>Pickup:</strong> {deliveryInfo.pickupLocation.location},{" "}
                {deliveryInfo.pickupLocation.city}
              </p>
              <p>
                <strong>Drop:</strong> {deliveryInfo.dropLocation.location},{" "}
                {deliveryInfo.dropLocation.city}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignDriverPage;
