import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../Auth/AuthContext';
import { Edit2, Trash2, TrendingUp, Package, ShoppingCart, DollarSign, Clock, AlertCircle } from 'lucide-react';
import Header from './Header';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const { authToken } = useContext(AuthContext);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good Morning';
      if (hour < 18) return 'Good Afternoon';
      return 'Good Evening';
    };
    setGreeting(getGreeting());
    fetchProducts();
    fetchTopProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/products', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/products/statistics', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setTopProducts(data);
    } catch (error) {
      console.error('Error fetching top products:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard" />
      
      <main className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{greeting}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your store today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">
                +12.5%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm">Total Products</h3>
            <p className="text-2xl font-bold mt-1">{products.length}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>Updated just now</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-sm font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">
                +8.2%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm">Total Orders</h3>
            <p className="text-2xl font-bold mt-1">245</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Increased this month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-sm font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">
                +23.1%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm">Total Revenue</h3>
            <p className="text-2xl font-bold mt-1">$12,456</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Calculated in real-time</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
              </div>
              <span className="text-sm font-medium text-yellow-500 bg-yellow-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-gray-600 text-sm">Conversion Rate</h3>
            <p className="text-2xl font-bold mt-1">3.24%</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>Last 30 days</span>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Recent Products</h2>
            <p className="text-sm text-gray-500 mt-1">A list of recently added products to your store</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={product.image || "/api/placeholder/40/40"} 
                          alt={product.name} 
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">${product.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{product.orderCount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;