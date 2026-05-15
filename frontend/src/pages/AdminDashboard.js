import React, { useState } from 'react';
import UserLayout from '../components/UserLayout';
import api from '../services/api';

const AdminDashboard = () => {
  const [blogForm, setBlogForm] = useState({ title: '', excerpt: '', author: '', category: 'General' });
  const [featureForm, setFeatureForm] = useState({ type: 'main', title: '', description: '', icon: 'Star', color: 'bg-primary-500' });
  const [message, setMessage] = useState('');

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createBlog(blogForm);
      setMessage('Blog post created successfully!');
      setBlogForm({ title: '', excerpt: '', author: '', category: 'General' });
    } catch (err) {
      setMessage('Error creating blog post.');
      console.error(err);
    }
  };

  const handleFeatureSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createFeature({
        ...featureForm,
        benefits: ['Real-time tracking', 'Automated reports'] // Simplified dummy mock
      });
      setMessage('Feature created successfully!');
      setFeatureForm({ type: 'main', title: '', description: '', icon: 'Star', color: 'bg-primary-500' });
    } catch (err) {
      setMessage('Error creating feature.');
      console.error(err);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Admin CMS Dashboard</h1>
        {message && <div className="p-4 mb-6 bg-green-100 text-green-700 rounded-md border border-green-200">{message}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Blog Form */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Create Blog Post</h2>
            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full p-2 border border-gray-300 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} className="w-full p-2 border border-gray-300 rounded h-24" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input type="text" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} className="w-full p-2 border border-gray-300 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category (e.g. Innovation, Regulation)</label>
                <input type="text" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})} className="w-full p-2 border border-gray-300 rounded" required />
              </div>
              <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded transition-colors">Submit Blog</button>
            </form>
          </div>

          {/* Feature Form */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Create Feature Component</h2>
            <form onSubmit={handleFeatureSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feature Scope</label>
                <select value={featureForm.type} onChange={e => setFeatureForm({...featureForm, type: e.target.value})} className="w-full p-2 border border-gray-300 rounded">
                  <option value="main">Main Feature</option>
                  <option value="technical">Technical Feature</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={featureForm.title} onChange={e => setFeatureForm({...featureForm, title: e.target.value})} className="w-full p-2 border border-gray-300 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={featureForm.description} onChange={e => setFeatureForm({...featureForm, description: e.target.value})} className="w-full p-2 border border-gray-300 rounded h-24" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name (QrCode, Shield, Globe etc)</label>
                <input type="text" value={featureForm.icon} onChange={e => setFeatureForm({...featureForm, icon: e.target.value})} className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Color Class (e.g. bg-blue-500)</label>
                <input type="text" value={featureForm.color} onChange={e => setFeatureForm({...featureForm, color: e.target.value})} className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">Submit Feature</button>
            </form>
          </div>

        </div>
      </div>
    </UserLayout>
  );
};

export default AdminDashboard;
