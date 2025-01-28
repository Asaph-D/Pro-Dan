import React, { useState, useContext, useEffect } from 'react';
import { Edit2, Trash2, Users as UsersIcon, Search, FileDown, Filter } from 'lucide-react';
import { AuthContext } from '../../../Auth/AuthContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationAction, setVerificationAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationPassword, setVerificationPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { authToken, email } = useContext(AuthContext);
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/auth/get-all-users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const verifyAdminPassword = async (password) => {
    try {
      const response = await fetch('http://localhost:8081/api/auth/verify-admin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email , password }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error verifying admin:', error);
      return false;
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    const isVerified = await verifyAdminPassword(verificationPassword);

    if (isVerified) {
      if (verificationAction.type === 'edit') {
        setIsEditing(true);
        setEditingUser(verificationAction.user);
      } else if (verificationAction.type === 'delete') {
        await deleteUser(verificationAction.user.email);
      }
      setVerificationPassword('');
      setIsVerifying(false);
    } else {
      alert('Invalid admin password');
    }
  };

  const updateUser = async (email, updatedUser) => {
    try {
      const response = await fetch(`http://localhost:8081/api/auth/update-user?email=${email}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setUsers(users.map(user => user.email === email ? data : user));
        } else {
          const text = await response.text();
          console.log('Response is not JSON:', text);
        }
        setIsEditing(false); // Close the form after the request is sent
      } else {
        const errorText = await response.text();
        console.error('Error updating user:', errorText);
        setErrors({ server: errorText });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setErrors({ server: error.message });
    }
  };

  const deleteUser = async (email) => {
    try {
      await fetch(`http://localhost:8081/api/auth/delete-user?email=${email}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      setUsers(users.filter(user => user.email !== email));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditClick = (user) => {
    setVerificationAction({ type: 'edit', user });
    setIsVerifying(true);
  };

  const handleDeleteClick = (user) => {
    setVerificationAction({ type: 'delete', user });
    setIsVerifying(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(editingUser);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      await updateUser(editingUser.email, editingUser);
    }
  };

  const validateForm = (user) => {
    const errors = {};
    if (!user.nom) errors.nom = 'Nom is required';
    if (!user.email) errors.email = 'Email is required';
    if (!user.roles || user.roles.length === 0) errors.roles = 'Role is required';
    if (!user.adresse) errors.adresse = 'Adresse is required';
    if (!user.telephone) errors.telephone = 'Téléphone is required';
    return errors;
  };

  const handlePhoneChange = (value) => {
    setEditingUser({ ...editingUser, telephone: value });
  };

  const getAvatarColor = (email) => {
    const firstLetter = email.charAt(0).toUpperCase();
    const charCode = firstLetter.charCodeAt(0);
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFBD33'];
    return colors[charCode % colors.length];
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = (
      (user?.nom?.toLowerCase()?.includes(searchTermLower) ||
      user?.email?.toLowerCase()?.includes(searchTermLower))
    );
    const matchesRole = filterRole === 'ALL' || user?.roles?.[0]?.name === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleExport = () => {
    const csvContent = [
      // CSV Headers
      ['Nom', 'Email', 'Role'],
      // CSV Data
      ...filteredUsers.map(user => [
        user.nom || 'Unnamed User',
        user.email || 'No Email',
        user.roles?.[0]?.name || 'No Role'
      ])
    ].map(row => row.join(',')).join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Enhanced Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-2 rounded-lg">
                <UsersIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">Users Management</h1>
                <p className="text-sm text-gray-500">Manage and monitor user accounts</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="bg-transparent outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">All Roles</option>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <FileDown className="w-5 h-5 mr-2" />
                Export Users
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <main className="p-6">
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 flex items-center">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center mr-2"
                      style={{ backgroundColor: getAvatarColor(user.email) }}
                    >
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    {user.nom}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.roles.map(role => role.name).join(', ')}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <Edit2
                        className="w-5 h-5 text-gray-400 cursor-pointer hover:text-orange-600"
                        onClick={() => handleEditClick(user)}
                      />
                      <Trash2
                        className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-600"
                        onClick={() => handleDeleteClick(user)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Verification Modal */}
      {isVerifying && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Admin Verification Required</h2>
            <p className="text-gray-600 mb-4">
              Please enter your admin password to {verificationAction?.type === 'edit' ? 'edit' : 'delete'} this user.
            </p>
            <form onSubmit={handleVerification}>
              <input
                type="password"
                value={verificationPassword}
                onChange={(e) => setVerificationPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsVerifying(false);
                    setVerificationPassword('');
                  }}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditing && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Nom</label>
                <input
                  type="text"
                  value={editingUser.nom || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, nom: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                <select
                  value={editingUser.roles[0]?.name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, roles: [{ name: e.target.value }] })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                {errors.roles && <p className="text-red-500 text-xs mt-1">{errors.roles}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Adresse</label>
                <input
                  type="text"
                  value={editingUser.adresse || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, adresse: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.adresse && <p className="text-red-500 text-xs mt-1">{errors.adresse}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Téléphone</label>
                <PhoneInput
                  country={'fr'}
                  value={editingUser.telephone}
                  onChange={handlePhoneChange}
                  inputClass="w-full px-6 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Numéro de téléphone (facultatif)"
                />
                {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Save Changes
                </button>
              </div>
              {errors.server && <p className="text-red-500 text-xs mt-4">{errors.server}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
