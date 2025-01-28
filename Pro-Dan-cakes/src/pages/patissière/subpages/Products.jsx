import React, { useState, useContext, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Upload, FileDown, Filter, ArrowUpDown } from 'lucide-react';
import { AuthContext } from '../../../Auth/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    description: '',
    category: '',
    file: null,
  });
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortField, setSortField] = useState('nom');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/produits', {
        method: 'GET',
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

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/produits/search?keyword=${searchTerm}&page=0&size=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file' && files[0]) {
      setSelectedFileName(files[0].name);
      setFormData(prev => ({ ...prev, file: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('nom', formData.nom);
    formDataToSend.append('prix', formData.prix);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    if (formData.file) {
        formDataToSend.append('file', formData.file);
    }

    try {
        let response;
        if (editingProduct) {
            formDataToSend.append('id', editingProduct.id);
            response = await fetch(`http://localhost:8081/api/produits/${editingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                body: formDataToSend,
            });
        } else {
            response = await fetch('http://localhost:8081/api/produits', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                body: formDataToSend,
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.message || 'An error occurred while saving the product.');
            return;
        }

        const data = await response.json();
        setProducts((prevProducts) =>
            editingProduct
                ? prevProducts.map((product) => (product.id === data.id ? data : product))
                : [...prevProducts, data]
        );

        resetForm();
    } catch (error) {
        console.error('Error adding/updating product:', error);
        setError('An error occurred while saving the product. Please try again.');
    }
  };


  const resetForm = () => {
    setIsModalOpen(false);
    setError('');
    setEditingProduct(null);
    setSelectedFileName('');
    setFormData({
      nom: '',
      prix: '',
      description: '',
      category: '',
      file: null,
    });
  };

  const initiateDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`http://localhost:8081/api/produits/${productToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(product => product.id !== productToDelete.id));
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      nom: product.nom,
      prix: product.prix,
      description: product.description,
      category: product.category,
      file: null,
    });
    setIsModalOpen(true);
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = (product.nom && product.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'ALL' || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'prix') {
        return direction * (a.prix - b.prix);
      }
      return direction * a[sortField].localeCompare(b[sortField]);
    });

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Price', 'Category', 'Description', 'Orders'],
      ...filteredAndSortedProducts.map(product => [
        product.nom,
        product.prix,
        product.category,
        product.description,
        product.compteurCommandes
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Card>
      <div className="bg-white shadow w-full">
        <div className="px-6 py-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Products Management</CardTitle>
            <button
              className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </button>
          </div>
        </CardHeader>
        </div>
        </div>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="ALL">All Categories</option>
                <option value="cake">Cake</option>
                <option value="gift">Gift</option>
                <option value="juice">Juice</option>
                <option value="others">Others</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <FileDown className="w-5 h-5 mr-2" />
              Export
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left cursor-pointer group"
                    onClick={() => {
                      setSortField('nom');
                      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    <div className="flex items-center">
                      Product
                      <ArrowUpDown className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left cursor-pointer group"
                    onClick={() => {
                      setSortField('prix');
                      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    <div className="flex items-center">
                      Price
                      <ArrowUpDown className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">Orders</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={`http://localhost:8081${product.image}`}
                          alt={product.nom}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="ml-3 font-medium">{product.nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">${product.prix}</td>
                    <td className="px-6 py-4">{product.compteurCommandes}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-sm rounded-full bg-gray-100">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">{product.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-3">
                        <Edit2
                          className="w-5 h-5 text-gray-400 cursor-pointer hover:text-orange-600"
                          onClick={() => openEditModal(product)}
                        />
                        <Trash2
                          className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-600"
                          onClick={() => initiateDelete(product)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto relative max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingProduct ? 'Update Product' : 'Add New Product'}
          </h2>
          <button
            onClick={resetForm}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter price"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                required
              >
                <option value="">Select a category</option>
                <option value="cake">Cake</option>
                <option value="gift">Gift</option>
                <option value="juice">Juice</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Enter product description"
                rows="3"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Product Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-orange-500 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        name="file"
                        onChange={handleChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {selectedFileName || 'PNG, JPG, GIF up to 10MB'}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="px-6 py-4 border-t bg-white">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.nom}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={cancelDelete}
            >Cancel</AlertDialogAction>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
