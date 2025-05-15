import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="text-success">Payment Successful!</h1>
        <p className="lead mt-3">Thank you for your order. Your food is on the way!</p>
        <Link to="/" className="btn btn-success mt-4">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
