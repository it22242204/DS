import React, { useState, useEffect } from "react";
import ResturentSidebar from "../../components/Layout/ResturentSidebar";

// Define interfaces based on your Mongoose schema
interface CustomizationOption {
  name: string;
  option: string;
  price: number;
}

interface OrderItem {
  menuItem: string; // ObjectId in MongoDB
  name: string;
  price: number;
  quantity: number;
  customizations: CustomizationOption[];
  specialInstructions?: string;
  subtotal: number;
}

interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

interface Order {
  _id: string;
  orderId: string;
  customer: string; // ObjectId in MongoDB
  customerName: string; // Added for display
  restaurant: string; // ObjectId in MongoDB
  items: OrderItem[];
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  deliveryAddress: DeliveryAddress;
  deliveryPerson?: string; // ObjectId in MongoDB
  createdAt: string; // For orderedAt display
}

// Mock data based on your schema
const mockOrders: Order[] = [
  {
    _id: "o1",
    orderId: "ORD-001",
    customer: "cust123",
    customerName: "John Doe",
    restaurant: "rest123",
    items: [
      {
        menuItem: "m1",
        name: "Margherita Pizza",
        price: 1200,
        quantity: 2,
        customizations: [
          { name: "Size", option: "Medium", price: 200 },
          { name: "Extra Cheese", option: "Yes", price: 100 }
        ],
        subtotal: 3000 // (1200 + 200 + 100) * 2
      }
    ],
    status: "Pending",
    subtotal: 3000,
    deliveryFee: 200,
    tax: 300,
    total: 3500,
    paymentMethod: "Credit Card",
    paymentStatus: "Pending",
    specialInstructions: "Please ring the doorbell twice",
    deliveryAddress: {
      street: "123 Main St",
      city: "Colombo",
      state: "Western",
      postalCode: "10100"
    },
    createdAt: "2025-04-28T11:30:00.000Z"
  },
  {
    _id: "o2",
    orderId: "ORD-002",
    customer: "cust456",
    customerName: "Jane Smith",
    restaurant: "rest123",
    items: [
      {
        menuItem: "m2",
        name: "Chicken Biryani",
        price: 1500,
        quantity: 1,
        customizations: [
          { name: "Spice Level", option: "Hot", price: 0 }
        ],
        subtotal: 1500
      },
      {
        menuItem: "m3",
        name: "Vegetable Salad",
        price: 800,
        quantity: 1,
        customizations: [
          { name: "Dressing", option: "Caesar", price: 50 }
        ],
        subtotal: 850
      }
    ],
    status: "Confirmed",
    subtotal: 2350,
    deliveryFee: 150,
    tax: 235,
    total: 2735,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    deliveryAddress: {
      street: "456 Park Ave",
      city: "Colombo",
      state: "Western",
      postalCode: "10200"
    },
    createdAt: "2025-04-28T12:45:00.000Z"
  },
  {
    _id: "o3",
    orderId: "ORD-003",
    customer: "cust789",
    customerName: "Robert Johnson",
    restaurant: "rest123",
    items: [
      {
        menuItem: "m1",
        name: "Margherita Pizza",
        price: 1200,
        quantity: 1,
        customizations: [
          { name: "Size", option: "Large", price: 400 }
        ],
        subtotal: 1600
      }
    ],
    status: "Delivered",
    subtotal: 1600,
    deliveryFee: 150,
    tax: 160,
    total: 1910,
    paymentMethod: "Credit Card",
    paymentStatus: "Completed",
    deliveryAddress: {
      street: "789 Beach Rd",
      city: "Colombo",
      state: "Western",
      postalCode: "10300"
    },
    deliveryPerson: "deliv123",
    estimatedDeliveryTime: "2025-04-28T14:30:00.000Z",
    actualDeliveryTime: "2025-04-28T14:25:00.000Z",
    createdAt: "2025-04-28T13:10:00.000Z"
  },
  {
    _id: "o4",
    orderId: "ORD-004",
    customer: "cust101",
    customerName: "Sara Williams",
    restaurant: "rest123",
    items: [
      {
        menuItem: "m3",
        name: "Vegetable Salad",
        price: 800,
        quantity: 2,
        customizations: [
          { name: "Dressing", option: "Vinaigrette", price: 0 }
        ],
        subtotal: 1600
      }
    ],
    status: "Preparing",
    subtotal: 1600,
    deliveryFee: 150,
    tax: 160,
    total: 1910,
    paymentMethod: "Digital Wallet",
    paymentStatus: "Completed",
    deliveryAddress: {
      street: "101 Hill Ave",
      city: "Colombo",
      state: "Western",
      postalCode: "10400"
    },
    createdAt: "2025-04-28T09:15:00.000Z"
  }
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call with mock data
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 800);
  }, []);

  const handleAcceptOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order._id === orderId 
        ? {...order, status: "Confirmed"} 
        : order
    ));
  };

  const handleRejectOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order._id === orderId 
        ? {...order, status: "Cancelled"} 
        : order
    ));
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order._id === orderId 
        ? {...order, status: "Delivered"} 
        : order
    ));
  };

  return (
    <div className="flex h-[85vh] bg-softWhite dark:bg-gray-900 text-deepCharcoal dark:text-white">
      <ResturentSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Order Management</h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Incoming Orders</h3>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead>
                <tr className="bg-coolGray dark:bg-gray-700 text-deepCharcoal dark:text-white uppercase text-sm">
                  <th className="py-3 px-6 text-left">Order ID</th>
                  <th className="py-3 px-6 text-left">Customer</th>
                  <th className="py-3 px-6 text-left">Items</th>
                  <th className="py-3 px-6 text-left">Total</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Payment</th>
                  <th className="py-3 px-6 text-left">Ordered At</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-coolGray dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="py-3 px-6">{order.orderId}</td>
                    <td className="py-3 px-6">{order.customerName}</td>
                    <td className="py-3 px-6">
                      {order.items.map(item => (
                        <div key={item.menuItem}>
                          {item.quantity}x {item.name}
                          {item.customizations.length > 0 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {item.customizations.map(c => 
                                `${c.name}: ${c.option}`
                              ).join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-6">Rs. {order.total.toFixed(2)}</td>
                    <td className={`py-3 px-6 ${getStatusColor(order.status)}`}>{order.status}</td>
                    <td className="py-3 px-6">
                      {order.paymentMethod}
                      <div className={`text-xs ${order.paymentStatus === "Completed" ? "text-green-500" : "text-yellow-500"}`}>
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td className="py-3 px-6">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-6">
                      {order.status === "Pending" && (
                        <>
                          <button 
                            className="text-green-600 hover:underline mr-2"
                            onClick={() => handleAcceptOrder(order._id)}
                          >
                            Accept
                          </button>
                          <button 
                            className="text-red-600 hover:underline"
                            onClick={() => handleRejectOrder(order._id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {order.status === "Confirmed" && (
                        <button 
                          className="text-blue-600 hover:underline"
                          onClick={() => handleCompleteOrder(order._id)}
                        >
                          Mark as Ready
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Delivered":
      return "text-green-500";
    case "Preparing":
      return "text-blue-500";
    case "Confirmed":
      return "text-blue-400";
    case "Ready":
      return "text-indigo-500";
    case "Out for Delivery":
      return "text-purple-500";
    case "Pending":
      return "text-yellow-500";
    case "Cancelled":
      return "text-red-500";
    default:
      return "text-deepCharcoal dark:text-white";
  }
};

export default Orders;
