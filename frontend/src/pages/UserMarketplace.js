import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, Star, MapPin, Loader, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import api from '../services/api';

const UserMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('shop');
  
  // Contact Form State
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [contactProduct, setContactProduct] = useState(null);
  const [contactMessage, setContactMessage] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await api.getOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

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

  const handleBuyNow = async (product) => {
    try {
      await api.createOrder({ itemId: product._id || product.id });
      alert(`Order Placed Successfully!`);
      fetchProducts();
      fetchOrders();
      setActiveTab('orders');
    } catch (err) {
      console.error('Failed to place order:', err);
      alert(`Failed to place order: ${err.message}`);
    }
  };

  const handleContactSeller = (product) => {
    setContactProduct(product);
    setContactFormOpen(true);
  };

  const submitContactForm = (e) => {
    e.preventDefault();
    alert(`Message sent to ${contactProduct.sellerName || 'Seller'}. They will reply to your registered email soon.`);
    setContactFormOpen(false);
    setContactMessage('');
  };

  const categories = ['all', 'Electronics', 'Components', 'Materials', 'Accessories'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <UserLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
          <p className="text-gray-600">Buy refurbished electronics and recycled materials</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('shop')}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'shop' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-600 hover:text-gray-900'}`}>
            Shop
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'orders' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-600 hover:text-gray-900'}`}>
            Track Orders
          </button>
        </div>
      </div>

      {activeTab === 'shop' ? (
        <>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
          No products currently available in this category. Check back later!
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
                  <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
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

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleBuyNow(product)}
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </button>
                  <button 
                    onClick={() => handleContactSeller(product)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {contactFormOpen && contactProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Seller</h2>
            <div className="mb-4 text-sm text-gray-600">
              <p><strong>Seller:</strong> {contactProduct.sellerName || contactProduct.seller || 'Unknown'}</p>
              <p><strong>Regarding:</strong> {contactProduct.name}</p>
            </div>
            <form onSubmit={submitContactForm}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Your Message</label>
                <textarea 
                  required
                  rows="4"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary-500"
                  placeholder="Hi, I'm interested in this product..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setContactFormOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </>
      ) : (
        <div className="space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Recent Orders</h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View All History</button>
            </div>

            <div className="space-y-8">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Placed on {order.date}</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-left md:text-right">
                      <p className="font-bold text-gray-900">₹{order.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Sold by {order.seller}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl overflow-hidden">
                      {order.icon.startsWith('http') ? (
                        <img src={order.icon} alt={order.item} className="w-full h-full object-cover" />
                      ) : (
                        order.icon
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.item}</p>
                      <p className="text-sm text-gray-500">Qty: 1</p>
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className={`h-0.5 w-full ${order.status === 'Delivered' ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                    </div>
                    <div className="relative flex justify-between">
                      {order.steps.map((step, idx) => {
                        let Icon = CheckCircle;
                        if (step.label === 'Processing') Icon = Package;
                        if (step.label === 'Shipped') Icon = Truck;
                        if (step.label === 'Out for Delivery') Icon = Clock;
                        if (step.label === 'Delivered') Icon = CheckCircle;

                        const isPulse = step.label === order.status && order.status !== 'Delivered';
                        const bgColor = step.completed ? 'bg-primary-600' : 'bg-gray-200';
                        const textColor = step.completed ? 'text-white' : 'text-gray-500';

                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white ${bgColor} ${isPulse ? 'animate-pulse bg-blue-500' : ''}`}>
                              <Icon className={`h-4 w-4 ${textColor}`} />
                            </div>
                            <p className={`mt-2 text-xs font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</p>
                            <p className="text-xs text-gray-500">{step.date}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default UserMarketplace;
