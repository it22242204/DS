import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Layout/DeliverySidebar";
import DeliveryAnalytics from "./DeliveryAnalytics";

interface Stats {
  total: number;
  today: number;
  monthly: number;
  yearly: number;
}

interface Delivery {
  _id: string;
  orderId: string;
  customerName: string;
  restaurantName: string;
  status: string;
  assignedAt: string;
  updatedAt: string;
}

const DeliveryDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    today: 0,
    monthly: 0,
    yearly: 0,
  });

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get("http://localhost:5200/api/delivery/userDeliveries");
        const fetchedDeliveries = response.data.deliveries;

        setDeliveries(fetchedDeliveries);

        const today = new Date().toDateString();
        const todayDeliveries = fetchedDeliveries.filter((d: Delivery) => new Date(d.assignedAt).toDateString() === today).length;

        const currentMonth = new Date().getMonth();
        const monthlyDeliveries = fetchedDeliveries.filter((d: Delivery) => new Date(d.assignedAt).getMonth() === currentMonth).length;

        const currentYear = new Date().getFullYear();
        const yearlyDeliveries = fetchedDeliveries.filter((d: Delivery) => new Date(d.assignedAt).getFullYear() === currentYear).length;

        setStats({
          total: fetchedDeliveries.length,
          today: todayDeliveries,
          monthly: monthlyDeliveries,
          yearly: yearlyDeliveries,
        });

      } catch (error) {
        console.error("Failed to fetch deliveries", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  return (
    <div className="flex h-[85vh] bg-softWhite dark:bg-gray-900 text-deepCharcoal dark:text-white">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Delivery Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Deliveries" value={stats.total} />
          <StatCard title="Completed Today" value={stats.today} />
          <StatCard title="Monthly Deliveries" value={stats.monthly} />
          <StatCard title="Yearly Deliveries" value={stats.yearly} />
        </div>

        {/* Recent Deliveries Table */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-lg font-bold mb-4">Recent Deliveries</h3>
          <div className="overflow-x-auto">
            {loading ? (
              <p>Loading deliveries...</p>
            ) : deliveries.length === 0 ? (
              <p>No deliveries found.</p>
            ) : (
              <table className="min-w-full bg-white dark:bg-gray-800">
                <thead>
                  <tr className="bg-coolGray dark:bg-gray-700 text-deepCharcoal dark:text-white uppercase text-sm">
                    <th className="py-3 px-6 text-left">Order ID</th>
                    <th className="py-3 px-6 text-left">Customer Name</th>
                    <th className="py-3 px-6 text-left">Restaurant Name</th>
                    <th className="py-3 px-6 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery) => (
                    <tr key={delivery._id} className="border-b border-coolGray dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="py-3 px-6">{delivery.orderId}</td>
                      <td className="py-3 px-6">{delivery.customerName}</td>
                      <td className="py-3 px-6">{delivery.restaurantName}</td>
                      <td className={`py-3 px-6 ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Delivery Analytics */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Delivery Analytics</h3>
          <DeliveryAnalytics />
        </div>

      </main>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
    <p className="text-gray-500 dark:text-gray-300">{title}</p>
    <h2 className="text-xl font-bold text-deepCharcoal dark:text-white">{value}</h2>
    <p className="text-sm text-gray-400 dark:text-gray-400">Since last month</p>
  </div>
);

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Completed":
      return "text-limeGreen";
    case "Assigned":
      return "text-blue-600 dark:text-blue-400";
    case "Pending":
      return "text-yellow-500";
    default:
      return "text-deepCharcoal dark:text-white";
  }
};

export default DeliveryDashboard;
