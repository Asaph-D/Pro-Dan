import React, { useState, useContext, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../Auth/AuthContext';
import { CreditCard, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentService = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { authToken } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [operator, setOperator] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [waitingForValidation, setWaitingForValidation] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWaitingForValidation(false);
    setTransactionStatus(null);

    try {
      let response;
      const payload = {
        paymentMethod: paymentMethod === 'mobile' ? 'mobile' : 'card',
        operator: paymentMethod === 'mobile' ? operator : null,
        transferCode: null,
        phoneNumber: paymentMethod === 'mobile' ? phoneNumber : null,
        amount: parseFloat(totalPrice), // Ensure amount is sent as a number
        status: null,
        receiptNumber: null,
        paymentDate: null,
        customer: null, // Assuming customer details are handled server-side
        customerEmail: null, // Assuming customer email is handled server-side
        deliveryAddress: null, // Assuming delivery address is handled server-side
        orderItems: cart.map(item => ({
          product: { nom: item.nom },
          quantity: item.quantity,
          price: item.prix
        })),
        successful: false,
        orderDetails: []
      };

      console.log('Payment Payload:', payload); // Log the payload for debugging

      if (paymentMethod === 'mobile') {
        response = await fetch('http://localhost:8081/api/payment/process/mobile', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else if (paymentMethod === 'card') {
        response = await fetch('http://localhost:8081/api/payment/process/card', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const data = await response.json();

      if (paymentMethod === 'mobile') {
        setWaitingForValidation(true);
        // Optionally, start polling or use WebSockets to check the transaction status
      } else {
        clearCart();
        // Show success message or redirect to confirmation page
        navigate('/confirmation', { state: { receiptNumber: data.receiptNumber } });
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  // Optionally, implement polling to check the transaction status
  useEffect(() => {
    if (waitingForValidation) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch('http://localhost:8081/api/payment/status', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to check transaction status');
          }

          const data = await response.json();
          if (data.status === 'COMPLETED') {
            clearInterval(interval);
            setWaitingForValidation(false);
            setTransactionStatus('success');
            clearCart();
            navigate('/confirmation', { state: { receiptNumber: data.receiptNumber } });
          } else if (data.status === 'FAILED') {
            clearInterval(interval);
            setWaitingForValidation(false);
            setTransactionStatus('failed');
            setError('Transaction validation failed');
          }
        } catch (err) {
          setError(err.message || 'Failed to check transaction status');
        }
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(interval);
    }
  }, [waitingForValidation, authToken, navigate]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Payment Information</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {waitingForValidation && (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded mb-4">
          Please check your mobile device for a validation request from the operator and confirm the transaction.
        </div>
      )}

      {transactionStatus === 'success' && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          Transaction successfully validated!
        </div>
      )}

      {transactionStatus === 'failed' && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          Transaction validation failed. Please try again.
        </div>
      )}

      <form onSubmit={handlePayment} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Payment Method Selection */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`p-4 border rounded-lg flex items-center justify-center space-x-2 ${
                  paymentMethod === 'mobile' ? 'border-orange-500 bg-orange-50' : ''
                }`}
                onClick={() => setPaymentMethod('mobile')}
              >
                <Phone className="w-5 h-5" />
                <span>Mobile Money</span>
              </button>
              <button
                type="button"
                className={`p-4 border rounded-lg flex items-center justify-center space-x-2 ${
                  paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : ''
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard className="w-5 h-5" />
                <span>Bank Card</span>
              </button>
            </div>
          </div>

          {/* Mobile Money Fields */}
          {paymentMethod === 'mobile' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Operator</label>
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select Operator</option>
                  <option value="orange">Orange Money</option>
                  <option value="mtn">MTN Mobile Money</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                  placeholder="Enter phone number"
                />
              </div>
            </>
          )}

          {/* Bank Card Fields */}
          {paymentMethod === 'card' && (
            <div className="col-span-2">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="w-24 h-24 mx-auto mb-4" />
                <p>You will be redirected to PayPal for payment.</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center mt-4">
                <img src="https://www.commercialbank.com/logo.png" alt="Commercial Bank" className="w-24 h-24 mx-auto mb-4" />
                <p>You will be redirected to Commercial Bank for payment.</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{totalPrice} €</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{totalPrice} €</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !paymentMethod}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-300"
        >
          {loading ? 'Processing...' : 'Confirm Payment'}
        </button>
      </form>
    </div>
  );
};

export default PaymentService;
