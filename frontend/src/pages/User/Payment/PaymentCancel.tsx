import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react';

const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Error Header */}
        <div className="bg-gradient-to-r from-red-400 to-red-500 px-6 py-8 text-center">
          <div className="animate-bounce mb-4 inline-flex">
            <XCircle className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Canceled</h1>
          <p className="text-red-100">Your order was not completed</p>
        </div>

        {/* Error Details */}
        <div className="p-6">
          <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-100">
            <div className="text-center text-red-700">
              <p className="font-medium">
                Oops! Your payment was not completed. This could be due to:
              </p>
              <ul className="mt-2 text-left text-sm list-disc list-inside">
                <li>Canceled transaction</li>
                <li>Payment was declined</li>
                <li>Connectivity issues</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 flex flex-col items-center">
            <Link 
              to="/cart" 
              className="inline-flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-transform duration-200 transform hover:scale-105 hover:shadow-lg w-full mb-3"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Return to Cart
            </Link>
            
            <Link 
              to="/restaurants" 
              className="inline-flex items-center justify-center text-gray-600 hover:text-red-600 mt-3"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
