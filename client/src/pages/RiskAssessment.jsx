import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import SplineBackground from '../components/SplineBackground';
import { motion } from 'framer-motion';
import { AlertTriangle, Activity, Shield, History, TrendingDown, CheckCircle } from 'lucide-react';

const RiskAssessment = () => {
    const [stats, setStats] = useState({
        cancellations: '',
        acceptRate: '',
        avgRating: '',
        penalties: '',
        lastSuspensionDays: ''
    });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchHistory = async () => {
        if (!user._id) return;
        try {
            const res = await api.get(`/predict/history/${user._id}`);
            setHistory(res.data.items);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user._id) fetchHistory();
    }, [user._id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user._id) {
            toast.error('Please log in again to sync your account.');
            return;
        }
        setLoading(true);
        try {
            const res = await api.post('/predict/suspension', {
                recentStats: {
                    cancellations: Number(stats.cancellations),
                    acceptRate: Number(stats.acceptRate),
                    avgRating: Number(stats.avgRating),
                    penalties: Number(stats.penalties),
                    lastSuspensionDays: Number(stats.lastSuspensionDays)
                }
            });
            setPrediction(res.data);
            toast.success('Risk assessment completed!');
            fetchHistory();
        } catch (err) {
            toast.error('Prediction failed');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="relative min-h-screen text-white font-sans overflow-hidden">
            {/* Darker Premium Gradient Background Layer */}
            <div className="fixed inset-0 z-0 bg-[#2C5364] opacity-90"></div>
            <div className="fixed inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>

            <div className="fixed inset-0 z-0 opacity-40 mix-blend-screen">
                <SplineBackground />
            </div>

            <motion.div
                className="relative z-10 p-6 space-y-8 max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-rose-500/20 backdrop-blur-md border border-rose-500/30">
                        <Activity className="w-8 h-8 text-rose-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white">Risk Assessment</h1>
                        <p className="text-white">Analyze your account health and predict suspension risks</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border-white/10 bg-gradient-to-br from-rose-600/20 to-orange-600/20 h-[600px] overflow-y-auto custom-scrollbar">
                        {!user._id && (
                            <div className="alert alert-warning shadow-lg mb-6 bg-amber-500/20 text-amber-200 border-amber-500/30">
                                <div>
                                    <AlertTriangle className="stroke-current flex-shrink-0 h-6 w-6" />
                                    <span>Please log out and log back in to sync your account data.</span>
                                </div>
                            </div>
                        )}
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-rose-400" />
                            Suspension Risk Predictor
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">Cancellations (30d)</span></label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 2"
                                        className="input bg-white/5 border-white/10 text-white focus:border-rose-500/50 focus:outline-none w-full"
                                        value={stats.cancellations}
                                        onChange={e => setStats({ ...stats, cancellations: e.target.value })}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">Acceptance Rate (%)</span></label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 95"
                                        className="input bg-white/5 border-white/10 text-white focus:border-rose-500/50 focus:outline-none w-full"
                                        value={stats.acceptRate}
                                        onChange={e => setStats({ ...stats, acceptRate: e.target.value })}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">Average Rating (0-5)</span></label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="e.g. 4.8"
                                        className="input bg-white/5 border-white/10 text-white focus:border-rose-500/50 focus:outline-none w-full"
                                        value={stats.avgRating}
                                        onChange={e => setStats({ ...stats, avgRating: e.target.value })}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">Penalties (30d)</span></label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 0"
                                        className="input bg-white/5 border-white/10 text-white focus:border-rose-500/50 focus:outline-none w-full"
                                        value={stats.penalties}
                                        onChange={e => setStats({ ...stats, penalties: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text text-white">Days Since Last Suspension</span></label>
                                <input
                                    type="number"
                                    placeholder="e.g. 365"
                                    className="input bg-white/5 border-white/10 text-white focus:border-rose-500/50 focus:outline-none w-full"
                                    value={stats.lastSuspensionDays}
                                    onChange={e => setStats({ ...stats, lastSuspensionDays: e.target.value })}
                                />
                            </div>
                            <button className={`btn w-full mt-4 bg-gradient-to-r from-rose-600 to-pink-600 border-none text-white hover:from-rose-700 hover:to-pink-700 shadow-lg shadow-rose-900/20 ${loading ? 'loading' : ''}`} disabled={loading}>
                                {loading ? 'Analyzing Risk Profile...' : 'Analyze Risk'}
                            </button>
                        </form>
                    </motion.div>

                    {/* Prediction Result */}
                    <motion.div variants={itemVariants}>
                        {prediction ? (
                            <div className="glass-panel p-8 rounded-3xl border-white/10 bg-gradient-to-br from-rose-900/20 to-orange-900/20 h-[600px] overflow-y-auto custom-scrollbar">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5 text-rose-400" />
                                    Risk Analysis Result
                                </h2>
                                <div className="flex flex-col items-center my-8 relative">
                                    <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full opacity-20"></div>
                                    <div className={`radial-progress ${prediction.riskLevel === 'high' ? 'text-rose-500' : prediction.riskLevel === 'medium' ? 'text-amber-400' : 'text-emerald-400'} drop-shadow-lg`}
                                        style={{ "--value": prediction.score * 100, "--size": "12rem", "--thickness": "1rem" }}>
                                        <span className="text-4xl font-black text-white">{Math.round(prediction.score * 100)}%</span>
                                    </div>
                                    <div className={`text-2xl font-black mt-6 uppercase tracking-widest ${prediction.riskLevel === 'high' ? 'text-rose-400' : prediction.riskLevel === 'medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                        {prediction.riskLevel} RISK
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider opacity-70">Risk Factors</h3>
                                        <ul className="space-y-2">
                                            {prediction.reasons.map((r, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-white">
                                                    <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                                                    {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                                        <h3 className="font-bold text-emerald-300 mb-3 text-sm uppercase tracking-wider opacity-90">Mitigation Strategy</h3>
                                        <ul className="space-y-2">
                                            {prediction.mitigation.map((m, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-emerald-100/80">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                    {m}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="glass-panel p-8 rounded-3xl border-white/10 bg-gradient-to-br from-rose-900/20 to-orange-900/20 h-[600px] flex flex-col items-center justify-center text-center opacity-60">
                                <Activity className="w-24 h-24 text-white mb-4" />
                                <p className="text-lg font-medium">Enter your stats to generate a risk assessment.</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* History Table */}
                <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl border-white/10 bg-gradient-to-br from-rose-900/10 to-orange-900/10">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <History className="w-5 h-5 text-blue-400" />
                        Assessment History
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="text-white border-white/10">
                                    <th>Date</th>
                                    <th>Risk Level</th>
                                    <th>Score</th>
                                    <th>Key Factors</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item._id} className="border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="text-white">{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge border-none text-white ${item.prediction.riskLevel === 'high' ? 'bg-rose-500/20 text-rose-300' : item.prediction.riskLevel === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                                {item.prediction.riskLevel.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="font-bold text-white">{Math.round(item.prediction.score * 100)}%</td>
                                        <td className="text-white text-sm max-w-md truncate">{item.prediction.reasons.join(', ')}</td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-white">
                                            No assessment history found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default RiskAssessment;
