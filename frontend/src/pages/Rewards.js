import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Star, Gift, TrendingUp, Leaf, Users, Award, Target, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import api from '../services/api';

// ─── Rewards catalog ─────────────────────────────────────────────────────────
const REWARDS_CATALOG = [
  { id: 1, title: '$1 Eco Store Voucher',        description: 'Redeem at any eco-partner store', points: 100,  category: 'voucher',  icon: '🎁' },
  { id: 2, title: 'Reusable Water Bottle',        description: 'BPA-free stainless steel bottle',  points: 250,  category: 'product',  icon: '🍶' },
  { id: 3, title: '$5 Green Products Discount',   description: 'Valid on eco-certified products',   points: 500,  category: 'voucher',  icon: '🛒' },
  { id: 4, title: 'Bamboo Phone Case',            description: '100% biodegradable casing',         points: 750,  category: 'product',  icon: '📱' },
  { id: 5, title: 'Plant a Tree Certificate',     description: 'A tree planted in your name',       points: 1000, category: 'impact',   icon: '🌱' },
  { id: 6, title: 'Solar Power Bank',             description: '10000mAh solar charging bank',      points: 1500, category: 'product',  icon: '🔋', unavailable: true },
];

// ─── Rank medal colours ───────────────────────────────────────────────────────
const RANK_COLOURS = {
  1: 'bg-yellow-500  text-white',
  2: 'bg-gray-400    text-white',
  3: 'bg-orange-500  text-white',
};

const Rewards = () => {
  // ── state ────────────────────────────────────────────────────────────────
  const [impact, setImpact]           = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [wallet, setWallet]           = useState({ availablePoints: 0 });
  const [loadingImpact, setLoadingImpact]   = useState(true);
  const [loadingBoard, setLoadingBoard]     = useState(true);
  const [redeeming, setRedeeming]           = useState(null); // reward id
  const [notification, setNotification]     = useState(null);

  // ── fetchers ─────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      const [impactData, boardData, walletData] = await Promise.all([
        api.getImpact(),
        api.getLeaderboard(),
        api.getWallet(),
      ]);
      setImpact(impactData);
      setLeaderboard(boardData);
      setWallet(walletData);
    } catch (err) {
      console.error('Failed to fetch rewards data:', err);
    } finally {
      setLoadingImpact(false);
      setLoadingBoard(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── toast helper ──────────────────────────────────────────────────────────
  const toast = (type, msg) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3500);
  };

  // ── redeem handler ────────────────────────────────────────────────────────
  const handleRedeem = async (reward) => {
    if (reward.unavailable) return;
    if (wallet.availablePoints < reward.points) {
      toast('error', `Need ${reward.points - wallet.availablePoints} more pts for "${reward.title}"`);
      return;
    }
    setRedeeming(reward.id);
    try {
      await api.redeemReward(reward.title, reward.points);
      const updated = await api.getWallet();
      setWallet(updated);
      toast('success', `🎉 "${reward.title}" redeemed for ${reward.points} pts!`);
    } catch (err) {
      toast('error', err.message || 'Redemption failed.');
    } finally {
      setRedeeming(null);
    }
  };

  // ── impact stat cards ─────────────────────────────────────────────────────
  const impactCards = impact
    ? [
        { Icon: Leaf,   label: 'CO₂ Saved',           value: `${impact.totalCO2} kg`,  color: 'text-green-600' },
        { Icon: Users,  label: 'Active Users',          value: impact.totalUsers,         color: 'text-blue-600'  },
        { Icon: Award,  label: 'Devices Recycled',      value: impact.totalDevices,       color: 'text-purple-600'},
        { Icon: Target, label: 'Materials Recovered',   value: `${impact.totalMaterials} kg`, color: 'text-orange-600' },
      ]
    : [];

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <UserLayout>
      {/* Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-white ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success'
            ? <CheckCircle className="h-5 w-5" />
            : <AlertCircle className="h-5 w-5" />}
          {notification.msg}
        </div>
      )}

      <div className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-50 to-eco-50 section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Rewards &amp; Impact</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Track your environmental impact, compete with others, and earn rewards
              for your contributions to sustainable e-waste management.
            </p>
          </div>
        </section>

        {/* ── Community Impact ──────────────────────────────────────────── */}
        <section className="bg-white section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Community Impact</h2>
              <p className="text-xl text-gray-600">Together, we're making a real difference</p>
            </div>
            {loadingImpact ? (
              <div className="flex justify-center py-12">
                <Loader className="h-10 w-10 animate-spin text-primary-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {impactCards.map(({ Icon, label, value, color }, i) => (
                  <div key={i} className="card text-center">
                    <Icon className={`h-12 w-12 ${color} mx-auto mb-4`} />
                    <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
                    <div className="text-gray-600">{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Leaderboard ──────────────────────────────────────────────── */}
        <section className="bg-gray-50 section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leaderboard</h2>
              <p className="text-xl text-gray-600">Top contributors — real data from MongoDB</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-primary-600 text-white p-6 flex items-center justify-center space-x-2">
                  <Trophy className="h-6 w-6" />
                  <h3 className="text-xl font-bold">All-Time Champions</h3>
                </div>

                {loadingBoard ? (
                  <div className="flex justify-center py-12">
                    <Loader className="h-8 w-8 animate-spin text-primary-500" />
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No users yet. Submit devices to appear on the leaderboard!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {leaderboard.map((user) => (
                      <div key={user.rank} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            RANK_COLOURS[user.rank] || 'bg-gray-200 text-gray-600'
                          }`}>
                            {user.rank}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">
                              {user.devicesRecycled} device{user.devicesRecycled !== 1 ? 's' : ''} recycled
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary-600">{user.totalPoints} pts</div>
                          <div className="text-sm text-gray-500">{user.co2Saved} kg CO₂ saved</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Rewards Store ─────────────────────────────────────────────── */}
        <section className="bg-white section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Rewards Store</h2>
              <p className="text-xl text-gray-600">
                Redeem your points — you have&nbsp;
                <span className="font-bold text-primary-600">{wallet.availablePoints} pts</span> available
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {REWARDS_CATALOG.map(reward => {
                const canAfford = wallet.availablePoints >= reward.points;
                const isProcessing = redeeming === reward.id;
                return (
                  <div key={reward.id} className={`card transition-all ${reward.unavailable ? 'opacity-60' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl">{reward.icon}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        reward.category === 'voucher' ? 'bg-blue-100 text-blue-800' :
                        reward.category === 'product' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>{reward.category}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{reward.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-primary-600">{reward.points} pts</span>
                      <span className={`text-xs font-medium ${
                        reward.unavailable ? 'text-gray-400' :
                        canAfford ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {reward.unavailable ? 'Coming Soon' : canAfford ? '✓ Affordable' : `Need ${reward.points - wallet.availablePoints} more`}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={reward.unavailable || !canAfford || isProcessing}
                      className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        !reward.unavailable && canAfford && !isProcessing
                          ? 'bg-primary-600 hover:bg-primary-700 text-white'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isProcessing
                        ? <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Redeeming...</>
                        : reward.unavailable ? 'Coming Soon' : 'Redeem'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Personal Impact Banner ─────────────────────────────────────── */}
        <section className="bg-primary-600 text-white section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Environmental Impact</h2>
            <p className="text-xl text-primary-100 mb-8">See the real-world results of your recycling efforts</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white bg-opacity-10 rounded-xl p-6">
                <Leaf className="h-12 w-12 text-primary-200 mx-auto mb-4" />
                <div className="text-2xl font-bold mb-2">{impact?.totalCO2 ?? '—'} kg</div>
                <div className="text-primary-100">CO₂ Emissions Prevented</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-6">
                <TrendingUp className="h-12 w-12 text-primary-200 mx-auto mb-4" />
                <div className="text-2xl font-bold mb-2">{impact?.totalMaterials ?? '—'} kg</div>
                <div className="text-primary-100">Materials Recovered</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-6">
                <Star className="h-12 w-12 text-primary-200 mx-auto mb-4" />
                <div className="text-2xl font-bold mb-2">{wallet.totalPoints ?? wallet.availablePoints}</div>
                <div className="text-primary-100">Total Points Earned</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </UserLayout>
  );
};

export default Rewards;