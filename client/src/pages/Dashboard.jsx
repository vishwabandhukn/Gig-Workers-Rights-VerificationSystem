import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import SplineBackground from '../components/SplineBackground';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, FileText, DollarSign, Star, Activity, CheckCircle } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [fairness, setFairness] = useState({
        score: 100,
        components: {
            payment: 100,
            suspension: 100,
            rating: 100,
            disputes: 100
        }
    });
    const [anomalies, setAnomalies] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                const fairnessRes = await api.get(`/fairness/${user._id}`);
                setFairness(fairnessRes.data);

                const anomaliesRes = await api.get(`/anomalies/${user._id}`);
                setAnomalies(anomaliesRes.data.items);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError("Failed to load dashboard data. Please try again.");
            }
        };
        if (user._id) fetchData();
    }, [user._id]);

    const handleAcknowledge = async (id) => {
        try {
            await api.post('/anomalies/acknowledge', { anomalyId: id });
            toast.success('Anomaly acknowledged');
            setAnomalies(anomalies.filter(a => a._id !== id));
        } catch (err) {
            toast.error('Failed to acknowledge');
        }
    };

    const chartData = fairness ? {
        labels: ['Payment', 'Suspension', 'Rating', 'Disputes'],
        datasets: [
            {
                label: 'Fairness Components',
                data: [
                    fairness.components.payment,
                    fairness.components.suspension,
                    fairness.components.rating,
                    fairness.components.disputes,
                ],
                backgroundColor: [
                    'rgba(52, 211, 153, 0.6)',  // Emerald 400
                    'rgba(248, 113, 113, 0.6)', // Red 400
                    'rgba(251, 191, 36, 0.6)',  // Amber 400
                    'rgba(96, 165, 250, 0.6)',  // Blue 400
                ],
                borderColor: [
                    'rgba(52, 211, 153, 1)',
                    'rgba(248, 113, 113, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(96, 165, 250, 1)',
                ],
                borderWidth: 0,
            },
        ],
    } : null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="relative min-h-screen text-white font-sans overflow-hidden">
            {/* Darker Premium Gradient Background Layer */}
            <div className="fixed inset-0 z-0 bg-[#2C5364] opacity-90"></div>
            <div className="fixed inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>

            {/* Spline Background (Optional - can be kept or removed if gradient is preferred) */}
            <div className="fixed inset-0 z-0 opacity-40 mix-blend-screen">
                <SplineBackground />
            </div>

            <motion.div
                className="relative z-10 p-6 space-y-8 max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.header variants={itemVariants} className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-rose-100 drop-shadow-lg">
                            Welcome back, {user.name || 'Driver'}
                        </h1>
                        <p className="text-xl text-white mt-2 font-medium">Here's your fairness overview.</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-white">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            System Operational
                        </div>
                    </div>
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Quick Actions Section */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                            <div className="p-2 rounded-lg bg-emerald-500/20 backdrop-blur-md">
                                <Activity className="w-6 h-6 text-emerald-300" />
                            </div>
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[350px] overflow-y-auto custom-scrollbar pr-2 content-start">
                            <Link to="/evidence" className="glass-card p-6 rounded-3xl flex flex-col items-center text-center group border-white/20 bg-[#2c3e50] hover:bg-[#34495e] h-full">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white/10">
                                    <FileText className="w-8 h-8 text-blue-200" />
                                </div>
                                <h3 className="text-lg font-bold mb-1 text-white">Evidence Locker</h3>
                                <p className="text-sm text-white font-medium">Securely upload & manage evidence</p>
                            </Link>

                            <Link to="/payouts" className="glass-card p-6 rounded-3xl flex flex-col items-center text-center group border-white/20 bg-[#2c3e50] hover:bg-[#34495e] h-full">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white/10">
                                    <DollarSign className="w-8 h-8 text-emerald-200" />
                                </div>
                                <h3 className="text-lg font-bold mb-1 text-white">Verify Payouts</h3>
                                <p className="text-sm text-white font-medium">Check for payment discrepancies</p>
                            </Link>

                            <Link to="/ratings" className="glass-card p-6 rounded-3xl flex flex-col items-center text-center group sm:col-span-2 border-white/20 bg-[#2c3e50] hover:bg-[#34495e] h-full">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white/10">
                                    <Star className="w-8 h-8 text-amber-200" />
                                </div>
                                <h3 className="text-lg font-bold mb-1 text-white">Rate Platform</h3>
                                <p className="text-sm text-white font-medium">Share your experience & feedback</p>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Risk & Disputes Section */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                            <div className="p-2 rounded-lg bg-rose-500/20 backdrop-blur-md">
                                <Shield className="w-6 h-6 text-rose-300" />
                            </div>
                            Risk & Disputes
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[350px] overflow-y-auto custom-scrollbar pr-2 content-start">
                            <Link to="/disputes" className="glass-card p-6 rounded-3xl flex flex-col items-center text-center group border-white/20 bg-[#2c3e50] hover:bg-[#34495e] h-full">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-400/20 to-purple-600/20 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white/10">
                                    <FileText className="w-8 h-8 text-purple-200" />
                                </div>
                                <h3 className="text-lg font-bold mb-1 text-white">Dispute Center</h3>
                                <p className="text-sm text-white font-medium">Generate appeals & manage cases</p>
                            </Link>

                            <Link to="/risk" className="glass-card p-6 rounded-3xl flex flex-col items-center text-center group border-white/20 bg-[#2c3e50] hover:bg-[#34495e] h-full">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-400/20 to-rose-600/20 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white/10">
                                    <AlertTriangle className="w-8 h-8 text-rose-200" />
                                </div>
                                <h3 className="text-lg font-bold mb-1 text-white">Risk Assessment</h3>
                                <p className="text-sm text-white font-medium">Predict & mitigate suspension risk</p>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Stats & Anomalies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {/* Fairness Score Card */}
                    <motion.div variants={itemVariants} className="glass-panel p-8 rounded-[2rem] relative overflow-hidden border-white/30 bg-gradient-to-br from-white/10 to-white/5">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Activity className="w-32 h-32 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-6 relative z-10 text-white">Fairness Score</h2>
                        {error ? (
                            <div className="alert alert-error bg-rose-500/20 border-rose-500/50 text-rose-200 backdrop-blur-md">
                                <AlertTriangle className="w-5 h-5" />
                                <span>{error}</span>
                            </div>
                        ) : fairness ? (
                            <div className="flex flex-col items-center relative z-10">
                                <div className="relative mb-8 transform hover:scale-105 transition-transform duration-500">
                                    <div className="text-6xl font-black absolute inset-0 flex items-center justify-center text-white drop-shadow-xl">
                                        {fairness.score}%
                                    </div>
                                    <div className="w-56 h-56 filter drop-shadow-2xl">
                                        <Doughnut
                                            data={chartData}
                                            options={{
                                                cutout: '85%',
                                                plugins: { legend: { display: false } },
                                                elements: { arc: { borderWidth: 0, hoverOffset: 10 } },
                                                animation: { animateScale: true, animateRotate: true }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full text-sm font-medium">
                                    <div className="flex items-center gap-3 text-emerald-100"><div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>Payment</div>
                                    <div className="flex items-center gap-3 text-rose-100"><div className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]"></div>Suspension</div>
                                    <div className="flex items-center gap-3 text-amber-100"><div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div>Rating</div>
                                    <div className="flex items-center gap-3 text-blue-100"><div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>Disputes</div>
                                </div>
                            </div>
                        ) : <div className="loading loading-spinner loading-lg text-white"></div>}
                    </motion.div>

                    {/* Anomalies Card */}
                    <motion.div variants={itemVariants} className="glass-panel p-8 rounded-[2rem] border-white/30 bg-gradient-to-br from-white/10 to-white/5">
                        <h2 className="text-2xl font-bold mb-6 flex items-center justify-between text-white">
                            Anomalies Detected
                            {anomalies.length > 0 && <span className="badge badge-error bg-rose-500 text-white border-none shadow-lg">{anomalies.length} New</span>}
                        </h2>

                        {anomalies.length > 0 ? (
                            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {anomalies.map((anomaly) => (
                                    <div key={anomaly._id} className="bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-lg group">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="badge badge-error bg-rose-500/20 text-rose-200 border-rose-500/30 gap-2 px-3 py-3 h-auto">
                                                <AlertTriangle className="w-4 h-4" />
                                                <span className="font-bold">{anomaly.type}</span>
                                            </div>
                                            <span className="text-xs text-white font-medium bg-black/20 px-2 py-1 rounded-full">{new Date().toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-white mb-5 leading-relaxed font-medium">
                                            {anomaly.details && JSON.stringify(anomaly.details).replace(/[{}"]/g, '').replace(/:/g, ': ')}
                                        </p>
                                        <div className="flex gap-3 opacity-90 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                to="/disputes"
                                                state={{ anomaly: anomaly }}
                                                className="flex-1 btn btn-sm bg-amber-500 hover:bg-amber-400 text-white border-none shadow-lg hover:shadow-amber-500/30 normal-case font-bold"
                                            >
                                                Raise Dispute
                                            </Link>
                                            <button
                                                onClick={() => handleAcknowledge(anomaly._id)}
                                                className="flex-1 btn btn-sm bg-emerald-500 hover:bg-emerald-400 text-white border-none shadow-lg hover:shadow-emerald-500/30 normal-case font-bold"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Acknowledge
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center text-white">
                                <div className="p-6 rounded-full bg-emerald-500/20 mb-6 animate-bounce">
                                    <CheckCircle className="w-16 h-16 text-emerald-300" />
                                </div>
                                <p className="text-xl font-bold text-white">No anomalies detected.</p>
                                <p className="text-base mt-2 text-emerald-100">Your account is in excellent standing!</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
