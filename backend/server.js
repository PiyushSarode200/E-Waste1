const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
const upload = multer({ dest: 'uploads/' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect('mongodb+srv://EWaste:EWaste%40123@ewaste.blzsmw4.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB database: E-waste');
});

// User Schema (Individual Users Collection)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  bio: { type: String, default: '' },
  ecoPoints: { type: Number, default: 0 },
  totalDevicesRecycled: { type: Number, default: 0 },
  totalCO2Saved: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'users' });

// Company Schema (Companies Collection)
const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  description: { type: String, default: '' },
  totalCollected: { type: Number, default: 0 },
  monthlyRevenue: { type: Number, default: 0 },
  activePartners: { type: Number, default: 0 },
  recyclingRate: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'companies' });

// Device Schema
const deviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  qrCode: { type: String, unique: true, sparse: true },
  imei: { type: String, unique: true, sparse: true },
  deviceType: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String },
  condition: { type: String, required: true },
  estimatedValue: { type: Number, required: true },
  ecoPoints: { type: Number, required: true },
  status: { type: String, default: 'Approved' },
  source: { type: String, enum: ['qr_scan', 'manual'], default: 'manual' },
  image: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  type: { type: String, required: true }, // 'device_submission' | 'redeem' | 'bonus'
  points: { type: Number, required: true }, // positive = earned, negative = spent
  amount: { type: Number },
  partner: { type: String },
  referenceId: { type: String },           // TXN-XXXXXXXX
  deviceType: { type: String },
  brand: { type: String },
  model: { type: String },
  description: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String },
  author: { type: String, required: true },
  readTime: { type: String },
  category: { type: String, required: true },
  image: { type: String, default: '📝' },
  createdAt: { type: Date, default: Date.now }
});

// Feature Schema
const featureSchema = new mongoose.Schema({
  type: { type: String, enum: ['main', 'technical'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  color: { type: String },
  benefits: [{ type: String }],
  details: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// MarketplaceItem Schema
const marketplaceItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  condition: { type: String, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  sellerName: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['available', 'sold'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketplaceItem', required: true },
  orderId: { type: String, required: true, unique: true },
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  sellerName: { type: String, required: true },
  status: { type: String, enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'], default: 'Processing' },
  icon: { type: String },
  steps: [{
    label: { type: String },
    completed: { type: Boolean },
    date: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Report Schema
const reportSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  type: { type: String, default: 'Analysis' },
  period: { type: String, default: 'monthly' },
  status: { type: String, default: 'Ready' },
  size: { type: String, default: '1.0 MB' },
  metrics: {
    totalCollected: { type: Number, default: 0 },
    totalRecycled: { type: Number, default: 0 },
    carbonSaved: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Company = mongoose.model('Company', companySchema);
const Device = mongoose.model('Device', deviceSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Blog = mongoose.model('Blog', blogSchema);
const Feature = mongoose.model('Feature', featureSchema);
const MarketplaceItem = mongoose.model('MarketplaceItem', marketplaceItemSchema);
const Order = mongoose.model('Order', orderSchema);
const Report = mongoose.model('Report', reportSchema);

// User Register endpoint
app.post('/api/user/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, userType: 'user' });
    await user.save();

    const token = jwt.sign({ userId: user._id, userType: 'user' }, 'your-secret-key', { expiresIn: '24h' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, userType: 'user' }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Company Register endpoint
app.post('/api/company/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const company = new Company({ name, email, password: hashedPassword, userType: 'company' });
    await company.save();

    const token = jwt.sign({ userId: company._id, userType: 'company' }, 'your-secret-key', { expiresIn: '24h' });

    res.status(201).json({
      message: 'Company created successfully',
      token,
      user: { id: company._id, name: company.name, email: company.email, userType: 'company' }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Legacy register endpoint (for backward compatibility)
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, userType = 'user' } = req.body;

    if (userType === 'company') {
      const existingCompany = await Company.findOne({ email });
      if (existingCompany) {
        return res.status(400).json({ message: 'Company already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const company = new Company({ name, email, password: hashedPassword, userType: 'company' });
      await company.save();
      const token = jwt.sign({ userId: company._id, userType: 'company' }, 'your-secret-key', { expiresIn: '24h' });
      res.status(201).json({
        message: 'Company created successfully',
        token,
        user: { id: company._id, name: company.name, email: company.email, userType: 'company' }
      });
    } else {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, userType: 'user' });
      await user.save();
      const token = jwt.sign({ userId: user._id, userType: 'user' }, 'your-secret-key', { expiresIn: '24h' });
      res.status(201).json({
        message: 'User created successfully',
        token,
        user: { id: user._id, name: user.name, email: user.email, userType: 'user' }
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User Login endpoint
app.post('/api/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, userType: 'user' }, 'your-secret-key', { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        ecoPoints: user.ecoPoints,
        totalDevicesRecycled: user.totalDevicesRecycled,
        totalCO2Saved: user.totalCO2Saved,
        userType: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Company Login endpoint
app.post('/api/company/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: company._id, userType: 'company' }, 'your-secret-key', { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: company._id,
        name: company.name,
        email: company.email,
        phone: company.phone,
        address: company.address,
        description: company.description,
        totalCollected: company.totalCollected,
        monthlyRevenue: company.monthlyRevenue,
        activePartners: company.activePartners,
        recyclingRate: company.recyclingRate,
        userType: 'company'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update profile endpoint
app.put('/api/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'your-secret-key');
    const { name, email, phone, address, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { name, email, phone, address, bio },
      { new: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        ecoPoints: user.ecoPoints,
        totalDevicesRecycled: user.totalDevicesRecycled,
        totalCO2Saved: user.totalCO2Saved
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users endpoint (for debugging)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Check if a QR code is already registered
app.get('/api/check-qr/:qr', verifyToken, async (req, res) => {
  try {
    const { qr } = req.params;
    const device = await Device.findOne({ qrCode: qr });
    if (device) {
      return res.json({ exists: true, device });
    }
    res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit device endpoint
app.post('/api/devices', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { deviceType, brand, model, condition, estimatedValue, qrCode, imei, source, lat, lng } = req.body;

    console.log('[POST /api/devices] Received payload:', { deviceType, brand, model, condition, source, qrCode, imei, lat, lng, file: !!req.file });

    if (!req.file) {
      return res.status(400).json({ message: 'Device image proof is required' });
    }

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Geolocation (lat/lng) is required' });
    }

    if (!imei || !/^\d{15}$/.test(imei)) {
      return res.status(400).json({ message: 'IMEI must be exactly 15 numeric digits' });
    }

    // Enforce required fields
    if (!deviceType) {
      return res.status(400).json({ message: 'Device type is required' });
    }

    // Validate IMEI uniqueness if provided
    const existingImei = await Device.findOne({ imei });
    if (existingImei) {
      return res.status(400).json({ message: 'A device with this IMEI is already registered.' });
    }

    const resolvedSource = source || 'manual';

    // Base Points Calculation
    let basePoints = 0;
    if (deviceType === 'Smartphone') basePoints = 50;
    else if (deviceType === 'Tablet') basePoints = 60;
    else if (deviceType === 'Laptop') basePoints = 80;
    else if (deviceType === 'TV') basePoints = 100;
    else basePoints = 30; // fallback

    let finalPoints = basePoints;
    let qrBonusApplied = false;

    if (resolvedSource === 'qr_scan') {
      finalPoints += 20;
      qrBonusApplied = true;
    }

    const resolvedQrCode = qrCode || `${resolvedSource === 'qr_scan' ? 'EWASTE' : 'MANUAL'}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const device = new Device({
      userId: req.userId,
      deviceType,
      brand,
      model,
      imei,
      condition,
      estimatedValue: estimatedValue || 0,
      ecoPoints: finalPoints,
      source: resolvedSource,
      qrCode: resolvedQrCode,
      status: 'Approved',
      image: req.file.path,
      location: { lat: parseFloat(lat), lng: parseFloat(lng) }
    });

    await device.save();

    // Update user stats
    await User.findByIdAndUpdate(req.userId, {
      $inc: {
        ecoPoints: finalPoints,
        totalDevicesRecycled: 1,
        totalCO2Saved: Math.round((estimatedValue || 0) * 0.01) // Rough CO2 calculation, keeping existing logic
      }
    });

    const description = `Earned ${finalPoints} pts from ${brand || ''} ${model || deviceType}${qrBonusApplied ? ' (QR Bonus Applied 🎉)' : ''}`.trim();

    // Create transaction record
    const transaction = new Transaction({
      userId: req.userId,
      deviceId: device._id,
      type: 'device_submission',
      points: finalPoints,
      amount: estimatedValue || 0,
      referenceId: `TXN-${Date.now().toString().slice(-8)}`,
      deviceType,
      brand,
      model,
      description,
      status: 'completed'
    });

    await transaction.save();

    res.status(201).json({ message: 'Device submitted successfully', device, transaction });
  } catch (error) {
    console.error('Device submission error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'QR already used' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get wallet summary (points breakdown + transaction history)
app.get('/api/wallet', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId, 'ecoPoints');
    const transactions = await Transaction.find({ userId: req.userId }).sort({ createdAt: -1 });

    const totalEarned = transactions
      .filter(t => t.points > 0)
      .reduce((sum, t) => sum + t.points, 0);

    const totalRedeemed = transactions
      .filter(t => t.points < 0)
      .reduce((sum, t) => sum + Math.abs(t.points), 0);

    res.json({
      availablePoints: user?.ecoPoints || 0,
      totalPoints: totalEarned,
      redeemedPoints: totalRedeemed,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dashboard stats endpoint
app.get('/api/dashboard-stats', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Calculate dynamic rank
    const higherRankCount = await User.countDocuments({ ecoPoints: { $gt: user.ecoPoints || 0 } });
    const rank = higherRankCount + 1;

    res.json({
      totalPoints: user.ecoPoints || 0,
      availablePoints: user.ecoPoints || 0,
      carbonSaved: user.totalCO2Saved || 0,
      rank
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Impact dashboard chart stats endpoint
app.get('/api/impact-stats', verifyToken, async (req, res) => {
  try {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthIndex = new Date().getMonth();

    // Ensure we start from 6 months ago up to current month for the labels
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      let m = currentMonthIndex - i;
      if (m < 0) m += 12;
      last6Months.push(monthNames[m]);
    }

    // A. Fetch all devices for Logged-In User
    const userDevices = await Device.find({ userId: req.userId });

    // B. Default Types (Ensuring all categories exist)
    const defaultDistribution = {
      Smartphone: 0,
      Laptop: 0,
      Tablet: 0,
      TV: 0,
      Others: 0
    };

    const monthlyMap = {};
    last6Months.forEach(m => {
      monthlyMap[m] = { month: m, devices: 0, co2Saved: 0 };
    });

    // C. Calculation Constants
    // CO2 (kg): Smartphone: 2, Tablet: 3, Laptop: 5, TV: 8
    // Weight (kg): Smartphone: 0.2, Tablet: 0.5, Laptop: 2, TV: 8

    let totalDevices = 0;
    let totalCO2 = 0;
    let totalWeight = 0;

    const mapType = (type) => {
      if (!type) return "Others";
      const t = type.toLowerCase();
      if (t.includes("smart") || t.includes("phone")) return "Smartphone";
      if (t.includes("laptop") || t.includes("mac") || t.includes("pc")) return "Laptop";
      if (t.includes("tablet") || t.includes("ipad")) return "Tablet";
      if (t.includes("tv") || t.includes("television") || t.includes("monitor")) return "TV";
      return "Others";
    };

    userDevices.forEach(device => {
      // Normalize and Map Device Type
      const normalizedType = mapType(device.deviceType);
      
      // Update distribution
      defaultDistribution[normalizedType] += 1;
      totalDevices += 1;

      // Calculate multipliers
      let co2Multiplier = 0;
      let weightMultiplier = 0;
      
      if (normalizedType === 'Smartphone') { co2Multiplier = 2; weightMultiplier = 0.2; }
      else if (normalizedType === 'Tablet') { co2Multiplier = 3; weightMultiplier = 0.5; }
      else if (normalizedType === 'Laptop') { co2Multiplier = 5; weightMultiplier = 2.0; }
      else if (normalizedType === 'TV') { co2Multiplier = 8; weightMultiplier = 8.0; }

      totalCO2 += co2Multiplier;
      totalWeight += weightMultiplier;

      // Group by Month
      const dDate = new Date(device.createdAt);
      const mName = monthNames[dDate.getMonth()];
      
      // If the device is within our 6 months array, add it.
      if (monthlyMap[mName]) {
        monthlyMap[mName].devices += 1;
        monthlyMap[mName].co2Saved += co2Multiplier;
      }
    });

    const monthlyData = Object.values(monthlyMap);
    
    const deviceDistribution = Object.keys(defaultDistribution).map(key => ({
      name: key,
      value: defaultDistribution[key]
    }));

    const co2Trend = monthlyData.map(m => ({
      month: m.month,
      co2: m.co2Saved
    }));

    // D. Build Rewards Data (Global for all users)
    const rewardsMap = {};
    last6Months.forEach(m => {
      rewardsMap[m] = { month: m, earned: 0, redeemed: 0 };
    });

    const allTransactions = await Transaction.find({ status: 'completed' });
    allTransactions.forEach(t => {
      const tDate = new Date(t.createdAt);
      const mName = monthNames[tDate.getMonth()];
      
      if (rewardsMap[mName]) {
         if (t.points > 0) rewardsMap[mName].earned += t.points;
         else if (t.points < 0) rewardsMap[mName].redeemed += Math.abs(t.points);
      }
    });

    const rewardsData = Object.values(rewardsMap);

    res.json({
      totalDevices,
      totalCO2,
      totalWeight,
      monthlyData,
      deviceDistribution,
      co2Trend,
      rewardsData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Redeem a reward
app.post('/api/redeem', verifyToken, async (req, res) => {
  try {
    const { rewardTitle, points } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.ecoPoints < points) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // Deduct points from user balance
    await User.findByIdAndUpdate(req.userId, { $inc: { ecoPoints: -points } });

    // Create a redeem transaction
    const transaction = new Transaction({
      userId: req.userId,
      type: 'redeem',
      points: -points,  // negative = deducted
      amount: 0,
      referenceId: `TXN-${Date.now().toString().slice(-8)}`,
      description: `Redeemed ${points} pts for ${rewardTitle}`,
      status: 'completed'
    });
    await transaction.save();

    const updatedUser = await User.findById(req.userId, 'ecoPoints');
    res.json({ message: 'Redeemed successfully', transaction, availablePoints: updatedUser.ecoPoints });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user devices
app.get('/api/devices', verifyToken, async (req, res) => {
  try {
    const devices = await Device.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user transactions
app.get('/api/transactions', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .populate('deviceId', 'deviceType brand')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user stats
app.get('/api/user-stats', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId, 'ecoPoints totalDevicesRecycled totalCO2Saved');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create test user endpoint
app.post('/api/create-test-user', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      userType: 'user'
    });
    await testUser.save();
    res.json({ message: 'Test user created', email: 'test@example.com', password: '123456' });
  } catch (error) {
    if (error.code === 11000) {
      res.json({ message: 'Test user already exists', email: 'test@example.com', password: '123456' });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

// Create test company endpoint
app.post('/api/create-test-company', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const testCompany = new Company({
      name: 'Test Company',
      email: 'company@example.com',
      password: hashedPassword,
      userType: 'company',
      totalCollected: 15420,
      monthlyRevenue: 125000,
      activePartners: 45,
      recyclingRate: 94.5
    });
    await testCompany.save();
    res.json({ message: 'Test company created', email: 'company@example.com', password: '123456' });
  } catch (error) {
    if (error.code === 11000) {
      res.json({ message: 'Test company already exists', email: 'company@example.com', password: '123456' });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

// Get company stats
app.get('/api/company-stats', verifyToken, async (req, res) => {
  try {
    if (req.userType !== 'company') return res.status(403).json({ message: 'Access denied' });
    const company = await Company.findById(req.userId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    // Same device type → weight mapping used in /api/impact-stats
    const mapType = (type) => {
      if (!type) return 'Others';
      const t = type.toLowerCase();
      if (t.includes('smart') || t.includes('phone')) return 'Smartphone';
      if (t.includes('laptop') || t.includes('mac') || t.includes('pc')) return 'Laptop';
      if (t.includes('tablet') || t.includes('ipad')) return 'Tablet';
      if (t.includes('tv') || t.includes('television') || t.includes('monitor')) return 'TV';
      return 'Others';
    };
    const weightMap = { Smartphone: 0.2, Tablet: 0.5, Laptop: 2.0, TV: 8.0, Others: 1.0 };

    // totalCollected = total weight of ALL submitted devices (system-wide, same source as Impact Dashboard)
    const allDevices = await Device.find({});
    let totalCollected = 0;
    allDevices.forEach(d => {
      totalCollected += weightMap[mapType(d.deviceType)] || 1.0;
    });

    // totalRecycled = weight of items this company has successfully sold
    const soldItems = await MarketplaceItem.find({ sellerId: req.userId, status: 'sold' });
    const categoryWeights = { Electronics: 1.5, Components: 0.3, Materials: 5.0, Accessories: 0.2 };
    let totalRecycled = soldItems.reduce((sum, item) => sum + (categoryWeights[item.category] || 1.0), 0);

    // Monthly revenue: sum of all sale transactions for this company
    const transactions = await Transaction.find({ companyId: req.userId });
    const saleTransactions = transactions.filter(t => t.type === 'sale');
    const monthlyRevenue = saleTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    // Unique buyers from orders
    const orders = await Order.find({ sellerId: req.userId });
    const uniqueBuyerIds = new Set(orders.map(o => o.userId?.toString()).filter(Boolean));
    const activePartners = uniqueBuyerIds.size;

    // Recycling rate: % by weight that has been recycled vs collected
    const recyclingRate = totalCollected > 0
      ? Math.round((totalRecycled / totalCollected) * 100)
      : 0;

    res.json({
      totalCollected: Math.round(totalCollected * 10) / 10,
      totalRecycled: Math.round(totalRecycled * 10) / 10,
      monthlyRevenue,
      activePartners,
      recyclingRate
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get company transactions
app.get('/api/company/transactions', verifyToken, async (req, res) => {
  try {
    if (req.userType !== 'company') return res.status(403).json({ message: 'Access denied' });
    const transactions = await Transaction.find({ companyId: req.userId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get public impact stats
app.get('/api/public-impact', async (req, res) => {
  try {
    const users = await User.aggregate([{ $group: { _id: null, totalCO2: { $sum: '$totalCO2Saved' }, totalDevices: { $sum: '$totalDevicesRecycled' } } }]);
    const companies = await Company.aggregate([{ $group: { _id: null, totalCollected: { $sum: '$totalCollected' } } }]);

    res.json({
      totalCO2Saved: users[0]?.totalCO2 || 0,
      totalDevicesRecycled: users[0]?.totalDevices || 0,
      totalCollected: companies[0]?.totalCollected || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Community impact — CO2 by device type, materials recovered
app.get('/api/impact', async (req, res) => {
  try {
    const CO2_BY_TYPE = { Smartphone: 2, Tablet: 3, Laptop: 5, TV: 8 };
    const MATERIALS_BY_TYPE = { Smartphone: 0.1, Tablet: 0.15, Laptop: 0.3, TV: 0.5 };

    const devices = await Device.find({}, 'deviceType');
    const totalUsers = await User.countDocuments();

    let totalCO2 = 0;
    let totalMaterials = 0;
    devices.forEach(d => {
      totalCO2 += CO2_BY_TYPE[d.deviceType] || 1;
      totalMaterials += MATERIALS_BY_TYPE[d.deviceType] || 0.1;
    });

    res.json({
      totalDevices: devices.length,
      totalUsers,
      totalCO2: parseFloat(totalCO2.toFixed(1)),
      totalMaterials: parseFloat(totalMaterials.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Leaderboard — top 10 users sorted by ecoPoints
app.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await User.find({}, 'name ecoPoints totalDevicesRecycled totalCO2Saved')
      .sort({ ecoPoints: -1 })
      .limit(10);
    res.json(users.map((u, i) => ({
      rank: i + 1,
      name: u.name || 'Anonymous',
      totalPoints: u.ecoPoints || 0,
      devicesRecycled: u.totalDevicesRecycled || 0,
      co2Saved: u.totalCO2Saved || 0,
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Blogs CRUD
app.get('/api/blogs', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All Posts' ? { category } : {};
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Features CRUD
app.get('/api/features', async (req, res) => {
  try {
    const features = await Feature.find().sort({ createdAt: 1 });
    res.json(features);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/features', async (req, res) => {
  try {
    const feature = new Feature(req.body);
    await feature.save();
    res.status(201).json(feature);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/features/:id', async (req, res) => {
  try {
    await Feature.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feature deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Company Portal Endpoints
app.get('/api/company-stats', verifyToken, async (req, res) => {
  try {
    const company = await Company.findById(req.userId);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    
    res.json({
      totalCollected: company.totalCollected || 0,
      monthlyRevenue: company.monthlyRevenue || 0,
      activePartners: company.activePartners || 0,
      recyclingRate: company.recyclingRate || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/company/transactions', verifyToken, async (req, res) => {
  try {
    // Return all transactions to allow frontend to build charts
    const transactions = await Transaction.find({ companyId: req.userId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/marketplace', async (req, res) => {
  try {
    const items = await MarketplaceItem.find({ status: 'available' }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/marketplace', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const company = await Company.findById(req.userId);
    if (!company) return res.status(403).json({ message: 'Only companies can list items' });

    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    const item = new MarketplaceItem({
      ...req.body,
      image: req.file.path.replace(/\\/g, '/'),
      sellerId: company._id,
      sellerName: company.name
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/orders', verifyToken, async (req, res) => {
  try {
    const { itemId } = req.body;
    const item = await MarketplaceItem.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.status === 'sold') return res.status(400).json({ message: 'Item already sold' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update item status
    item.status = 'sold';
    await item.save();

    // Update company monthlyRevenue and totalCollected logic if needed
    // Assuming we just increment monthlyRevenue for the seller
    await Company.findByIdAndUpdate(item.sellerId, {
      $inc: { monthlyRevenue: item.price }
    });

    // Create order
    const newOrderId = 'ORD-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    const order = new Order({
      userId: req.userId,
      sellerId: item.sellerId,
      itemId: item._id,
      orderId: newOrderId,
      itemName: item.name,
      price: item.price,
      sellerName: item.sellerName,
      status: 'Processing',
      icon: item.image,
      steps: [
        { label: 'Order Placed', completed: true, date: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
        { label: 'Processing', completed: false, date: 'Pending' },
        { label: 'Shipped', completed: false, date: 'Pending' },
        { label: 'Out for Delivery', completed: false, date: 'Pending' },
        { label: 'Delivered', completed: false, date: 'Pending' },
      ]
    });
    await order.save();

    // Create a transaction for the company so it appears on their dashboard
    const transaction = new Transaction({
      userId: req.userId,
      companyId: item.sellerId,
      type: 'sale',
      points: 0,
      amount: item.price,
      partner: user.name,
      referenceId: newOrderId,
      description: `Sold ${item.name}`,
      status: 'completed'
    });
    await transaction.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    // Transform order for frontend compatibility
    const formattedOrders = orders.map(order => ({
      id: order.orderId,
      date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      item: order.itemName,
      price: order.price,
      seller: order.sellerName,
      status: order.status,
      icon: order.icon !== '📦' && order.icon ? `http://localhost:5000/${order.icon}` : '📦',
      steps: order.steps
    }));
    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

// GET company reports
app.get('/api/reports', verifyToken, async (req, res) => {
  try {
    if (req.userType !== 'company') return res.status(403).json({ message: 'Access denied' });
    const reports = await Report.find({ companyId: req.userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create a new report
app.post('/api/reports', verifyToken, async (req, res) => {
  try {
    if (req.userType !== 'company') return res.status(403).json({ message: 'Access denied' });
    const { title, type, period, metrics } = req.body;
    const sizeKB = (Math.random() * 3 + 1).toFixed(1);
    const report = new Report({
      companyId: req.userId,
      title,
      type: type || 'Analysis',
      period: period || 'monthly',
      status: 'Ready',
      size: `${sizeKB} MB`,
      metrics: metrics || {}
    });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE a report
app.delete('/api/reports/:id', verifyToken, async (req, res) => {
  try {
    await Report.findOneAndDelete({ _id: req.params.id, companyId: req.userId });
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Separate collections: users, companies');
});