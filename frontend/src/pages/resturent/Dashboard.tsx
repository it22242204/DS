import React, { useState, useEffect } from "react";
import ResturentSidebar from "../../components/Layout/ResturentSidebar";

// Define interfaces that match your MongoDB schemas
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

interface Order {
  _id: string;
  orderId: string;
  customer: string; // ObjectId in MongoDB
  customerName: string; // Added for display purposes
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
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  deliveryPerson?: string; // ObjectId in MongoDB
  createdAt: string; // For orderedAt display
}

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  restaurant: string; // ObjectId in MongoDB
  customizationOptions: Array<{
    name: string;
    options: Array<{
      name: string;
      price: number;
    }>;
    required: boolean;
  }>;
  isAvailable: boolean;
  preparationTime: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spiceLevel: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  tags: string[];
}

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalMenuItems: number;
}

// Mock menu items data based on the menuItem.model.js
const mockMenuItems: MenuItem[] = [
  {
    _id: "m1",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 1200,
    image: "https://example.com/pizza.jpg",
    category: "Pizza",
    restaurant: "rest123",
    customizationOptions: [
      {
        name: "Size",
        options: [
          { name: "Small", price: 0 },
          { name: "Medium", price: 200 },
          { name: "Large", price: 400 }
        ],
        required: true
      },
      {
        name: "Extra Cheese",
        options: [
          { name: "Yes", price: 100 },
          { name: "No", price: 0 }
        ],
        required: false
      }
    ],
    isAvailable: true,
    preparationTime: 20,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: "Mild",
    tags: ["Italian", "Cheese", "Vegetarian"]
  },
  {
    _id: "m2",
    name: "Chicken Biryani",
    description: "Fragrant rice dish with chicken, spices, and herbs",
    price: 1500,
    image: "https://example.com/biryani.jpg",
    category: "Rice",
    restaurant: "rest123",
    customizationOptions: [
      {
        name: "Spice Level",
        options: [
          { name: "Mild", price: 0 },
          { name: "Medium", price: 0 },
          { name: "Hot", price: 0 }
        ],
        required: true
      }
    ],
    isAvailable: true,
    preparationTime: 30,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: "Medium",
    tags: ["Indian", "Rice", "Chicken"]
  },
  {
    _id: "m3",
    name: "Vegetable Salad",
    description: "Fresh garden vegetables with our signature dressing",
    price: 800,
    image: "https://example.com/salad.jpg",
    category: "Salad",
    restaurant: "rest123",
    customizationOptions: [
      {
        name: "Dressing",
        options: [
          { name: "Ranch", price: 0 },
          { name: "Vinaigrette", price: 0 },
          { name: "Caesar", price: 50 }
        ],
        required: true
      }
    ],
    isAvailable: true,
    preparationTime: 10,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    spiceLevel: "Mild",
    tags: ["Healthy", "Vegan", "Fresh"]
  }
];

// Mock orders data based on the order.model.js
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
    estimatedDeliveryTime: new Date("2025-04-28T14:30:00.000Z"),
    actualDeliveryTime: new Date("2025-04-28T14:25:00.000Z"),
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
    status: "Cancelled",
    subtotal: 1600,
    deliveryFee: 150,
    tax: 160,
    total: 1910,
    paymentMethod: "Digital Wallet",
    paymentStatus: "Refunded",
    deliveryAddress: {
      street: "101 Hill Ave",
      city: "Colombo",
      state: "Western",
      postalCode: "10400"
    },
    createdAt: "2025-04-28T09:15:00.000Z"
  }
];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalMenuItems: 0,
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      // Use our mock data instead of API calls
      setOrders(mockOrders);
      
      setStats({
        totalOrders: mockOrders.length,
        pendingOrders: mockOrders.filter(o => o.status === "Pending").length,
        completedOrders: mockOrders.filter(o => o.status === "Delivered").length,
        totalMenuItems: mockMenuItems.length,
      });
      
      setLoading(false);
    }, 1000); // Simulate network delay of 1 second
  }, []);

  return (
    <div className="flex h-[85vh] bg-softWhite dark:bg-gray-900 text-deepCharcoal dark:text-white">
      <ResturentSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Restaurant Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Orders" value={stats.totalOrders} />
          <StatCard title="Pending Orders" value={stats.pendingOrders} />
          <StatCard title="Completed Orders" value={stats.completedOrders} />
          <StatCard title="Menu Items" value={stats.totalMenuItems} />
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
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
                    <th className="py-3 px-6 text-left">Ordered At</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map((order) => (
                    <tr key={order._id} className="border-b border-coolGray dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="py-3 px-6">{order.orderId}</td>
                      <td className="py-3 px-6">{order.customerName}</td>
                      <td className="py-3 px-6">{order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}</td>
                      <td className="py-3 px-6">Rs. {order.total.toFixed(2)}</td>
                      <td className={`py-3 px-6 ${getStatusColor(order.status)}`}>{order.status}</td>
                      <td className="py-3 px-6">{new Date(order.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
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

export default Dashboard;
