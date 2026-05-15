import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, Gift, Star, Trophy, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import api from '../services/api';

const availableRewards = [
  { id: 1, title: 'Amazon Gift Card',     description: '₹500 Amazon voucher',         points: 100, category: 'voucher', image: '🎁' },
  { id: 2, title: 'Flipkart Voucher',     description: '₹1000 shopping voucher',       points: 200, category: 'voucher', image: '🛒' },
  { id: 3, title: 'Plant a Tree',         description: 'Plant a tree in your name',    points: 100, category: 'impact',  image: '🌱' },
  { id: 4, title: 'Eco Water Bottle',     description: 'Sustainable steel water bottle', points: 150, category: 'product', image: '🍶' },
  { id: 5, title: 'Solar Power Bank',     description: '10000mAh solar power bank',    points: 300, category: 'product', image: '🔋', unavailable: true },
  { id: 6, title: 'Organic Cotton Tote',  description: 'Eco-friendly shopping bag',    points: 75,  category: 'product', image: '👜' },
];

const achievements = [
  { icon: '🌱', title: 'First Steps',     description: 'Submit your first device',    threshold: 1 },
  { icon: '🔋', title: 'Battery Master',  description: '10 devices recycled',          threshold: 10 },
  { icon: '📱', title: 'Phone Collector', description: '5 devices recycled',           threshold: 5 },
  { icon: '💻', title: 'Tech Guru',       description: 'Earn 500 points',              threshold: 500, pointBased: true },
  { icon: '🏆', title: 'Eco Champion',    description: 'Earn 1000 points',             threshold: 1000, pointBased: true },
  { icon: '🌍', title: 'Planet Protector',description: 'Earn 2000 points',             threshold: 2000, pointBased: true },
];

// Build a human-readable message for each transaction type
const getTransactionMessage = (t) => {
  if (t.type === 'device_submission') {
    const device = [t.brand, t.model || t.deviceType].filter(Boolean).join(' ');
    return `You earned ${t.points} pts${device ? ` from ${device}` : ''}`;
  }
  if (t.type === 'redeem') {
    return t.description || `You redeemed ${Math.abs(t.points)} pts`;
  }
  if (t.type === 'bonus') {
    return t.description || `Bonus: +${t.points} pts`;
  }
  return t.description || 'Transaction';
};

const TransactionRow = ({ t }) => {
  const isEarn = t.points > 0;
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isEarn ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isEarn ? <Star className="h-5 w-5 text-green-600" /> : <Gift className="h-5 w-5 text-red-500" />}
        </div>
        <div>
          <div className="font-medium text-gray-900 text-sm">{getTransactionMessage(t)}</div>
          <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
            <span>{new Date(t.createdAt).toLocaleString()}</span>
            {t.referenceId && <span className="font-mono bg-gray-200 px-1.5 py-0.5 rounded">{t.referenceId}</span>}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3 flex-shrink-0">
        <span className={`font-bold text-sm ${isEarn ? 'text-green-600' : 'text-red-500'}`}>
          {isEarn ? '+' : ''}{t.points} pts
        </span>
        {t.status === 'completed'
          ? <CheckCircle className="h-5 w-5 text-green-500" />
          : <Clock className="h-5 w-5 text-yellow-500" />}
      </div>
    </div>
  );
};

const RewardsWallet = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null); // reward id being redeemed
  const [notification, setNotification] = useState(null); // { type, msg }
  const [filter, setFilter] = useState('all'); // 'all' | 'earn' | 'redeem'

  const [wallet, setWallet] = useState({
    availablePoints: 0,
    totalPoints: 0,
    redeemedPoints: 0,
    transactions: [],
  });

  const fetchWallet = useCallback(async () => {
    try {
      const data = await api.getWallet();
      setWallet(data);
    } catch (err) {
      console.error('Failed to fetch wallet:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWallet(); }, [fetchWallet]);

  const showNotification = (type, msg) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRedeem = async (reward) => {
    if (reward.unavailable) return;
    if (wallet.availablePoints < reward.points) {
      showNotification('error', `Insufficient points! You need ${reward.points - wallet.availablePoints} more pts.`);
      return;
    }
    setRedeeming(reward.id);
    try {
      await api.redeemReward(reward.title, reward.points);
      await fetchWallet(); // Refresh wallet live
      showNotification('success', `🎉 Redeemed "${reward.title}" for ${reward.points} pts!`);
    } catch (err) {
      showNotification('error', err.message || 'Redemption failed. Please try again.');
    } finally {
      setRedeeming(null);
    }
  };

  const filteredTransactions = wallet.transactions.filter(t => {
    if (filter === 'earn')   return t.points > 0;
    if (filter === 'redeem') return t.points < 0;
    return true;
  });

  const level = wallet.totalPoints >= 2000 ? 'Planet Protector'
    : wallet.totalPoints >= 1000 ? 'Eco Champion'
    : wallet.totalPoints >= 500  ? 'Tech Guru'
    : 'Eco Starter';

  const levelProgress = Math.min((wallet.totalPoints % 1000) / 10, 100);

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      {/* Notification toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-white transition-all ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success'
            ? <CheckCircle className="h-5 w-5" />
            : <AlertCircle className="h-5 w-5" />}
          {notification.msg}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards Wallet</h1>
        <p className="text-gray-600">Manage your eco-points and redeem exciting rewards</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <Wallet className="h-12 w-12 text-primary-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-primary-600 mb-1">{wallet.availablePoints}</div>
          <div className="text-gray-600 text-sm">Available Points</div>
        </div>
        <div className="card text-center">
          <Star className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-yellow-600 mb-1">{wallet.totalPoints}</div>
          <div className="text-gray-600 text-sm">Total Earned</div>
        </div>
        <div className="card text-center">
          <Gift className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-red-500 mb-1">{wallet.redeemedPoints}</div>
          <div className="text-gray-600 text-sm">Points Redeemed</div>
        </div>
        <div className="card text-center">
          <Trophy className="h-12 w-12 text-purple-600 mx-auto mb-3" />
          <div className="text-xl font-bold text-purple-600 mb-1">{level}</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${levelProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card mb-8">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {['wallet', 'redeem', 'achievements'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md font-medium capitalize transition-colors ${
                activeTab === tab ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Wallet Tab — Transaction History */}
      {activeTab === 'wallet' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
            <div className="flex gap-2">
              {['all', 'earn', 'redeem'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${
                    filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No transactions yet. Submit a device to earn your first points!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map(t => <TransactionRow key={t._id} t={t} />)}
            </div>
          )}
        </div>
      )}

      {/* Redeem Tab */}
      {activeTab === 'redeem' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRewards.map(reward => {
            const canRedeem = !reward.unavailable && wallet.availablePoints >= reward.points;
            return (
              <div key={reward.id} className={`card transition-all ${reward.unavailable ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{reward.image}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    reward.category === 'voucher' ? 'bg-blue-100 text-blue-800' :
                    reward.category === 'product' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>{reward.category}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{reward.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-primary-600">{reward.points} pts</div>
                  <div className={`text-xs font-medium ${canRedeem ? 'text-green-600' : 'text-red-500'}`}>
                    {reward.unavailable ? 'Coming Soon' : canRedeem ? '✓ Available' : `Need ${reward.points - wallet.availablePoints} more pts`}
                  </div>
                </div>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canRedeem || redeeming === reward.id}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    canRedeem && redeeming !== reward.id
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}>
                  {redeeming === reward.id
                    ? <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Redeeming...</>
                    : reward.unavailable ? 'Coming Soon' : 'Redeem Now'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((a, i) => {
            const unlocked = a.pointBased
              ? wallet.totalPoints >= a.threshold
              : wallet.transactions.filter(t => t.type === 'device_submission').length >= a.threshold;
            return (
              <div key={i} className={`card text-center transition-all ${
                unlocked ? 'border-2 border-primary-200 bg-primary-50' : 'opacity-60'
              }`}>
                <div className="text-6xl mb-4">{a.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{a.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{a.description}</p>
                {unlocked
                  ? <div className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                      <CheckCircle className="h-4 w-4 mr-1" /> Unlocked
                    </div>
                  : <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                      <Clock className="h-4 w-4 mr-1" /> Locked
                    </div>}
              </div>
            );
          })}
        </div>
      )}
    </UserLayout>
  );
};

export default RewardsWallet;