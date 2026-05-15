import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, Star, MapPin, Plus, Loader } from 'lucide-react';
import CompanyLayout from '../components/CompanyLayout';
import api from '../services/api';

const CompanyMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSellForm, setShowSellForm] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);

  const [newItem, setNewItem] = useState({
    name: '', category: 'Electronics', price: '', condition: 'Good', location: '', description: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const items = await api.getMarketplaceItems();
      setProducts(items);
    } catch (err) {
      console.error('Failed to load marketplace items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSellSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please upload a product image');
      return;
    }
    setSellLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', newItem.name);
      formData.append('category', newItem.category);
      formData.append('price', Number(newItem.price));
      formData.append('condition', newItem.condition);
      formData.append('location', newItem.location);
      formData.append('description', newItem.description);
      formData.append('image', imageFile);

      await api.createMarketplaceItem(formData);
      setShowSellForm(false);
      setNewItem({ name: '', category: 'Electronics', price: '', condition: 'Good', location: '', description: '' });
      setImageFile(null);
      fetchProducts(); // Refresh
      alert('Product successfully listed!');
    } catch (err) {
      alert('Error listing product: ' + err.message);
    } finally {
      setSellLoading(false);
    }
  };

  const categories = ['all', 'Electronics', 'Components', 'Materials', 'Accessories'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <CompanyLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
          <p className="text-gray-600">Sell Refurbished Electronics and Recycled Materials</p>
        </div>
        <button
          onClick={() => setShowSellForm(!showSellForm)}
          className="bg-eco-600 text-white px-4 py-2 rounded-lg hover:bg-eco-700 flex items-center transition-colors"
        >
          {showSellForm ? 'Close Form' : <><Plus className="h-5 w-5 mr-1" /> Sell Item</>}
        </button>
      </div>

      {showSellForm && (
        <div className="card mb-8 bg-green-50 border border-green-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">List a New Product</h2>
          <form onSubmit={handleSellSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input required value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="w-full p-2 border rounded" placeholder="e.g. Refurbished Laptop" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="w-full p-2 border rounded">
                  {categories.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                <input required type="number" min="1" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} className="w-full p-2 border rounded" placeholder="39999" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Condition</label>
                <select value={newItem.condition} onChange={e => setNewItem({ ...newItem, condition: e.target.value })} className="w-full p-2 border rounded">
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Pure">Pure (Materials)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input required value={newItem.location} onChange={e => setNewItem({ ...newItem, location: e.target.value })} className="w-full p-2 border rounded" placeholder="e.g. Mumbai, Pune" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Product Image</label>
              <input required type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full p-2 border rounded bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea required value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} className="w-full p-2 border rounded" rows="2" placeholder="Describe the item..."></textarea>
            </div>
            <button type="submit" disabled={sellLoading} className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 disabled:opacity-50">
              {sellLoading ? 'Listing...' : 'Publish to Marketplace'}
            </button>
          </form>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-eco-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-primary-600"><Loader className="animate-spin h-8 w-8 mr-2" /> Loading Marketplace...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg text-gray-500 border border-gray-200">
          No products currently available in this category. Be the first to sell!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id || product.id} className="card hover:shadow-lg transition-shadow flex flex-col justify-between">
              <div>
                <div className="text-center mb-4 h-32 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                  {product.image && product.image !== '📦' ? (
                    <img src={`http://localhost:5000/${product.image}`} alt={product.name} className="object-cover h-full w-full" />
                  ) : (
                    <div className="text-6xl mb-2">📦</div>
                  )}
                </div>
                <div className="text-center mb-2">
                  <span className="px-2 py-1 text-xs font-medium bg-eco-100 text-eco-800 rounded-full">
                    {product.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{product.rating || 'New'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {product.location}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Condition:</span>
                  <span className="text-sm font-medium text-green-600">{product.condition}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <span className="text-sm font-medium text-green-600">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  Sold by: <span className="font-medium">{product.sellerName || product.seller}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CompanyLayout>
  );
};

export default CompanyMarketplace;