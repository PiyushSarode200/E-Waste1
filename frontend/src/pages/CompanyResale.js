import React, { useState } from 'react';
import { Search, ShoppingCart, Eye, Star, MapPin } from 'lucide-react';

const CompanyResale = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['all', 'smartphones', 'laptops', 'tablets', 'monitors', 'accessories', 'components'];
  
  const items = [
    
    {
      id: 1,
      name: 'Intel Core i7-10700K',
      category: 'components',
      condition: 'Excellent',
      price: 280,
      originalValue: 350,
      components: ['CPU Die', 'Heat Spreader', 'Gold Contacts', 'Silicon Wafer'],
      location: 'Mumbai',
      seller: 'CPURecycle',
      rating: 4.8,
      image: '🔧',
      date: '2024-03-09'
    },
    {
      id: 2,
      name: 'NVIDIA RTX 3070 GPU',
      category: 'components',
      condition: 'Good',
      price: 450,
      originalValue: 600,
      components: ['GPU Chip', 'VRAM', 'Cooling Fan', 'PCB Board'],
      location: 'Bangalore',
      seller: 'GraphicsHub',
      rating: 4.9,
      image: '🎮',
      date: '2024-03-08'
    },
    {
      id: 3,
      name: 'Samsung 32GB DDR4 RAM',
      category: 'components',
      condition: 'Excellent',
      price: 180,
      originalValue: 220,
      components: ['Memory Chips', 'PCB', 'Gold Connectors', 'Heat Spreader'],
      location: 'Delhi',
      seller: 'MemoryPro',
      rating: 4.7,
      image: '💾',
      date: '2024-03-07'
    },
    {
      id: 4,
      name: 'WD 1TB NVMe SSD',
      category: 'components',
      condition: 'Good',
      price: 95,
      originalValue: 120,
      components: ['NAND Flash', 'Controller Chip', 'Cache Memory', 'PCB'],
      location: 'Chennai',
      seller: 'StorageTech',
      rating: 4.6,
      image: '💿',
      date: '2024-03-06'
    },
    {
      id: 5,
      name: 'Corsair 750W PSU',
      category: 'components',
      condition: 'Fair',
      price: 65,
      originalValue: 90,
      components: ['Transformer', 'Capacitors', 'Cooling Fan', 'Modular Cables'],
      location: 'Pune',
      seller: 'PowerSupply',
      rating: 4.4,
      image: '⚡',
      date: '2024-03-05'
    },
    {
      id: 6,
      name: 'ASUS Z590 Motherboard',
      category: 'components',
      condition: 'Good',
      price: 150,
      originalValue: 200,
      components: ['Chipset', 'CPU Socket', 'RAM Slots', 'Capacitors'],
      location: 'Kolkata',
      seller: 'MoboRecycle',
      rating: 4.5,
      image: '🔌',
      date: '2024-03-04'
    }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return new Date(b.date) - new Date(a.date);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">E-Waste Marketplace</h1>
          <p className="text-gray-600">Purchase verified e-waste components for your business</p>
        </div>

        {/* Filters & Search */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Search devices..."
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Components' : 'Components'}
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">{filteredItems.length}</div>
            <div className="text-sm text-gray-600">Available Items</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-eco-600">₹{filteredItems.reduce((sum, item) => sum + item.price, 0)}</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{new Set(filteredItems.map(item => item.location)).size}</div>
            <div className="text-sm text-gray-600">Cities</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{new Set(filteredItems.map(item => item.seller)).size}</div>
            <div className="text-sm text-gray-600">Sellers</div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <div key={item.id} className="card hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">{item.image}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                  item.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.condition}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
              
              <div className="flex items-center space-x-2 mb-3">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{item.rating}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600">{item.seller}</span>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{item.location}</span>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Key Components:</div>
                <div className="flex flex-wrap gap-1">
                  {item.components.slice(0, 3).map((component, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {component}
                    </span>
                  ))}
                  {item.components.length > 3 && (
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      +{item.components.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-2xl font-bold text-primary-600">₹{item.price}</div>
                  <div className="text-sm text-gray-500 line-through">₹{item.originalValue}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600 font-medium">
                    {Math.round((1 - item.price / item.originalValue) * 100)}% off
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center justify-center">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </button>
                <button className="flex-1 btn-primary inline-flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Purchase
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyResale;