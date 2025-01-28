import React from 'react';
import { useLocation } from 'react-router-dom';

const ConfirmationPage = () => {
  const location = useLocation();
  const { receiptNumber } = location.state || {};

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-6">Thank You!</h2>
      <p className="mb-4">Your order has been successfully placed.</p>
      {receiptNumber && (
        <p className="mb-4">Your receipt number is: {receiptNumber}</p>
      )}
      <p>You will receive a confirmation email shortly.</p>
    </div>
  );
};

export default ConfirmationPage;
