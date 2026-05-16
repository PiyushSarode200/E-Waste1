const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = this.token || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.body instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    const endpoint = userData.userType === 'company' ? '/company/register' : '/user/register';
    return this.request(endpoint, {
      method: 'POST',
      body: userData,
    });
  }

  async login(credentials) {
    const endpoint = credentials.userType === 'company' ? '/company/login' : '/user/login';
    return this.request(endpoint, {
      method: 'POST',
      body: credentials,
    });
  }

  // Device methods
  async submitDevice(deviceData) {
    return this.request('/devices', {
      method: 'POST',
      body: deviceData,
    });
  }

  async getDevices() {
    return this.request('/devices');
  }

  async getDevice(id) {
    return this.request(`/devices/${id}`);
  }

  async checkQrCode(qr) {
    return this.request(`/check-qr/${encodeURIComponent(qr)}`);
  }

  // Profile methods
  async getProfile() {
    return this.request('/profile');
  }

  async updateProfile(profileData) {
    return this.request('/profile', {
      method: 'PUT',
      body: profileData,
    });
  }

  // Stats methods
  async getStats() {
    return this.request('/stats');
  }

  async getUserStats() {
    return this.request('/user-stats');
  }

  async getPublicImpact() {
    return this.request('/public-impact');
  }

  async getPublicPartners() {
    return this.request('/public-partners');
  }

  async getCompanyStats() {
    return this.request('/company-stats');
  }

  async getTransactions() {
    return this.request('/transactions');
  }

  async getCompanyTransactions() {
    return this.request('/company/transactions');
  }

  async getReports() {
    return this.request('/reports');
  }

  async createReport(reportData) {
    return this.request('/reports', { method: 'POST', body: reportData });
  }

  async deleteReport(id) {
    return this.request(`/reports/${id}`, { method: 'DELETE' });
  }

  async getMarketplaceItems() {
    return this.request('/marketplace');
  }

  async createMarketplaceItem(itemData) {
    return this.request('/marketplace', {
      method: 'POST',
      body: itemData,
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: orderData,
    });
  }

  async getPublicImpact() {
    return this.request('/public-impact');
  }

  async getDashboardStats() {
    return this.request('/dashboard-stats');
  }

  async getImpactStats() {
    return this.request('/impact-stats');
  }

  async getWallet() {
    return this.request('/wallet');
  }

  async redeemReward(rewardTitle, points) {
    return this.request('/redeem', {
      method: 'POST',
      body: { rewardTitle, points },
    });
  }

  async getImpact() {
    return this.request('/impact');
  }

  async getLeaderboard() {
    return this.request('/leaderboard');
  }

  // Collection methods
  async scheduleCollection(collectionData) {
    return this.request('/collections', {
      method: 'POST',
      body: collectionData,
    });
  }

  // CMS Methods
  async getBlogs(category) {
    const query = category && category !== 'All Posts' ? `?category=${encodeURIComponent(category)}` : '';
    return this.request(`/blogs${query}`);
  }

  async createBlog(data) {
    return this.request('/blogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteBlog(id) {
    return this.request(`/blogs/${id}`, { method: 'DELETE' });
  }

  async getFeatures() {
    return this.request('/features');
  }

  async createFeature(data) {
    return this.request('/features', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteFeature(id) {
    return this.request(`/features/${id}`, { method: 'DELETE' });
  }
}

const apiService = new ApiService();
export default apiService;