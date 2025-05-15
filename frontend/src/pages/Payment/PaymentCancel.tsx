import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancel: React.FC = () => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="text-danger">Payment Canceled</h1>
        <p className="lead mt-3">Oops! Your payment was not completed.</p>
        <Link to="/checkout" className="btn btn-danger mt-4">
          Try Again
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;
