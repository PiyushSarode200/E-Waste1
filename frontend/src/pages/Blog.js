import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Leaf, Recycle, TrendingUp } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import api from '../services/api';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Posts');

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const posts = await api.getBlogs(selectedCategory);
        if (posts && posts.length > 0) {
          const featured = posts.find((p) => p.isFeatured) || posts[0];
          setFeaturedPost(featured);
          setBlogPosts(posts.filter((p) => p._id !== featured._id));
        } else {
          setFeaturedPost(null);
          setBlogPosts([]);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [selectedCategory]);

  const categoriesList = [
    'All Posts', 'Innovation', 'Regulation', 'Education', 'Business', 'Environment'
  ];

  const stats = [
    { icon: Leaf, label: 'Articles Published', value: '150+' },
    { icon: Recycle, label: 'Topics Covered', value: '25+' },
    { icon: TrendingUp, label: 'Monthly Readers', value: '50K+' },
  ];

  return (
    <UserLayout>
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-eco-50 section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Learning Hub
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Stay informed about the latest trends, regulations, and innovations 
            in electronic waste management and sustainability.
          </p>
        </div>
      </section>

      {/* Blog Stats */}
      <section className="bg-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="card text-center">
                <stat.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="bg-gradient-to-r from-primary-600 to-eco-600 rounded-2xl text-white p-8 mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-6xl mb-4">{featuredPost.image}</div>
                  <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                    Featured
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredPost.title}</h2>
                  <p className="text-primary-100 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center space-x-4 text-sm text-primary-200 mb-6">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span>{featuredPost.readTime || '5 min read'}</span>
                  </div>
                  <button className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="bg-gray-50 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Categories</h3>
                <div className="space-y-2">
                  {categoriesList.map((catName, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedCategory(catName)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                        selectedCategory === catName
                          ? 'bg-primary-100 text-primary-800 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{catName}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Blog Posts */}
            <div className="lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogPosts.map((post) => (
                  <article key={post._id} className="card hover:shadow-xl transition-shadow duration-300">
                    <div className="text-4xl mb-4">{post.image}</div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.category === 'Innovation' ? 'bg-blue-100 text-blue-800' :
                        post.category === 'Regulation' ? 'bg-red-100 text-red-800' :
                        post.category === 'Education' ? 'bg-green-100 text-green-800' :
                        post.category === 'Business' ? 'bg-purple-100 text-purple-800' :
                        post.category === 'Environment' ? 'bg-eco-100 text-eco-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">{post.readTime || '5 min'}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </article>
                ))}
                {!loading && blogPosts.length === 0 && !featuredPost && (
                  <div className="col-span-full py-12 text-center text-gray-500">
                    No articles found. Add some from the Admin Dashboard!
                  </div>
                )}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-12">
                <button className="btn-primary">
                  Load More Articles
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-primary-600 text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-primary-100 mb-8">
            Subscribe to our newsletter for the latest insights on e-waste management and sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>
      </div>
    </UserLayout>
  );
};

export default Blog;