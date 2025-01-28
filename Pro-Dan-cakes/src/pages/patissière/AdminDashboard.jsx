import React, { useState, useContext, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, User, Package, BarChart2, Settings, ChevronDown, LogOut } from 'lucide-react';
import { AuthContext } from '../../Auth/AuthContext';
import Products from './subpages/Products';
import Users from './subpages/Users';
import Setting from './subpages/Settings';
import Statistics from './subpages/Statistics';
import Dashboard from './subpages/Dashboard';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { authToken, isLoggedIn, logout, login, error, setError } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState({
    name: 'Dani Dollar',
    location: 'Bafoussam, Évéché',
    avatar: '/avatar/IMG-20221107-WA0021.jpg'
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogout = () => {
    logout();
    setIsAccountMenuOpen(false);
  };

  const handleSwitchAccount = () => {
    setIsLoginModalOpen(true);
    setIsAccountMenuOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          motDePasse: loginPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(loginEmail, data.token);
        setIsLoginModalOpen(false);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setError('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login error');
    }
  };

  useEffect(() => {
    if (!isLoggedIn && !authToken) {
      console.log(localStorage.getItem('token'));
      console.log(authToken);
      
      // Redirect to login page or homepage if not authenticated
      window.location.href = '/';
    }
  }, [authToken, isLoggedIn]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          {/* Account Switcher */}
          <div className="relative">
            <button
              className="w-full flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute -right-4 -bottom-1 w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                  <img
                    src={currentUser.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 text-left">
                <h2 className="font-semibold text-lg text-gray-800">{currentUser.name}</h2>
                <p className="text-sm text-gray-500">{currentUser.location}</p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>

            {isAccountMenuOpen && (
              <div className="absolute w-full mt-2 py-2 bg-white rounded-lg shadow-xl z-10">
                <button
                  onClick={handleSwitchAccount}
                  className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm flex items-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  Switch Account
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm flex items-center text-red-500"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-6">
          {[
            { id: 'dashboard', icon: BarChart2, label: 'Dashboard' },
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'users', icon: User, label: 'Users' },
            { id: 'settings', icon: Settings, label: 'Settings' },
            { id: 'statistics', icon: BarChart2, label: 'Statistics' },
          ].map(({ id, icon: Icon, label }) => (
            <div
              key={id}
              className={`flex items-center px-6 py-4 cursor-pointer transition-colors ${
                selectedTab === id ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedTab(id)}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {selectedTab === 'products' && <Products />}
          {selectedTab === 'users' && <Users />}
          {selectedTab === 'settings' && <Setting />}
          {selectedTab === 'statistics' && <Statistics />}
          {selectedTab === 'dashboard' && <Dashboard />}
        </div>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6">Switch Account</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
