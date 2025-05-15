import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Clock, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { restaurants } from '@/data/mockData';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  // Use items and restaurantId from CartContext
  const { clearCart, items, restaurantId } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const cleared = useRef(false);
  const navigate = useNavigate();

  

  useEffect(() => {
    if (!cleared.current && user && items.length > 0 && restaurantId) {
      // Get delivery fee from restaurant data
      const restaurant = restaurants.find(r => r.id === restaurantId);
      const deliveryFee = restaurant?.deliveryFee || 0;
      const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

      addOrder({
        id: "FD-" + Math.floor(10000 + Math.random() * 90000),
        customerId: user.id,
        restaurantId,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
        })),
        status: "in_progress",
        total: total + deliveryFee,
        deliveryFee,
        placedAt: new Date().toISOString(),
        deliveryAddress: "N/A", // fallback if address not present
        paymentMethod: "card",
        driver: null,
      });

      clearCart();
      toast.success("Cart cleared after payment!");
      cleared.current = true;

      setTimeout(() => {
        navigate("/orders");
      }, 2000); // Redirect after 2 seconds
    }
  }, [clearCart, addOrder, user, items, restaurantId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-400 to-green-500 px-6 py-8 text-center">
          <div className="animate-bounce mb-4 inline-flex">
            <CheckCircle className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-green-100">Your order has been placed</p>
        </div>
        {/* Order Details */}
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <span className="px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              Order #FD-{Math.floor(10000 + Math.random() * 90000)}
            </span>
          </div>
          <div className="mb-6 bg-amber-50 p-4 rounded-lg border border-amber-100">
            <div className="flex items-center text-amber-700 mb-2">
              <Clock className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Estimated Delivery</h3>
            </div>
            <p className="text-amber-800 font-medium text-xl">30-45 minutes</p>
          </div>
          <div className="text-gray-600 mb-6">
            <p>Thank you for your order! Your delicious food is being prepared and will be on its way soon.</p>
          </div>
          <div className="border-t border-gray-200 pt-4 flex flex-col items-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-transform duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <Home className="h-5 w-5 mr-2" />
              Return to Home
            </Link>
            <Link 
              to="/orders" 
              className="mt-4 inline-flex items-center justify-center text-gray-600 hover:text-green-600"
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
