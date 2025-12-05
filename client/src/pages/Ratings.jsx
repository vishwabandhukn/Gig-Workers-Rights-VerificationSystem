import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import SplineBackground from '../components/SplineBackground';
import { motion } from 'framer-motion';
import { Star, MessageSquare, BarChart2, History, Send, TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

import toast from 'react-hot-toast';

const Ratings = () => {
    const [platforms, setPlatforms] = useState([]);
    const [formData, setFormData] = useState({
        platform: 'Uber',
        payment: 5,
        suspension: 5,
        support: 5,
        comment: ''
    });
    const [loading, setLoading] = useState(false);

    const [userRatings, setUserRatings] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchPlatforms = async () => {
        try {
            const res = await api.get('/platforms/index');
            setPlatforms(res.data.platforms);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUserRatings = async () => {
        if (!user._id) return;
        try {
            const res = await api.get(`/platforms/user/${user._id}`);
            setUserRatings(res.data.items);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPlatforms();
        if (user._id) fetchUserRatings();
    }, [user._id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/platforms/rate', {
                platform: formData.platform,
                ratings: {
                    payment: Number(formData.payment),
                    suspension: Number(formData.suspension),
                    support: Number(formData.support)
                },
                comment: formData.comment
            });
            toast.success('Rating submitted successfully!');
            setFormData({
                platform: 'Uber',
                payment: 5,
                suspension: 5,
                support: 5,
                comment: ''
            });
            fetchPlatforms();
            fetchUserRatings();
        } catch (err) {
            toast.error('Failed to submit rating');
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: platforms.map(p => p.platform),
        datasets: [
            {
                label: 'Avg Payment Rating',
                data: platforms.map(p => p.avgPayment),
                backgroundColor: 'rgba(167, 139, 250, 0.6)', // Violet
                borderColor: 'rgba(167, 139, 250, 1)',
                borderWidth: 1,
            },
            {
                label: 'Avg Suspension Rating',
                data: platforms.map(p => p.avgSuspension),
                backgroundColor: 'rgba(244, 114, 182, 0.6)', // Pink
                borderColor: 'rgba(244, 114, 182, 1)',
                borderWidth: 1,
            },
            {
                label: 'Avg Support Rating',
                data: platforms.map(p => p.avgSupport),
                backgroundColor: 'rgba(52, 211, 153, 0.6)', // Emerald
                borderColor: 'rgba(52, 211, 153, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    font: { family: 'Inter, sans-serif' }
                }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                ticks: { color: 'rgba(255, 255, 255, 0.6)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
                ticks: { color: 'rgba(255, 255, 255, 0.6)' },
                grid: { display: false }
            }
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
                    <div className="p-3 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-500/30">
                        <Star className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white">Platform Ratings</h1>
                        <p className="text-white">Share your experience and see how platforms compare</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Rating Form */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <div className="glass-panel p-6 rounded-3xl border-white/10 bg-gradient-to-br from-amber-600/20 to-yellow-600/20 h-[600px] overflow-y-auto custom-scrollbar">
                            {!user._id && (
                                <div className="alert alert-warning shadow-lg mb-6 bg-amber-500/20 text-amber-200 border-amber-500/30">
                                    <div>
                                        <Star className="stroke-current flex-shrink-0 h-6 w-6" />
                                        <span>Please log out and log back in to sync your account data.</span>
                                    </div>
                                </div>
                            )}
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-amber-400" />
                                Rate a Platform
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">Platform</span></label>
                                    <select
                                        className="select bg-white/5 border-white/10 text-white focus:border-amber-500/50 focus:outline-none w-full"
                                        value={formData.platform}
                                        onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                    >
                                        <option className="bg-gray-900">Uber</option>
                                        <option className="bg-gray-900">Lyft</option>
                                        <option className="bg-gray-900">DoorDash</option>
                                        <option className="bg-gray-900">Instacart</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <div className="form-control">
                                        <label className="label"><span className="label-text text-white">Payment Fairness</span><span className="text-amber-400 font-bold">{formData.payment}/10</span></label>
                                        <input type="range" min="1" max="10" value={formData.payment} onChange={e => setFormData({ ...formData, payment: e.target.value })} className="range range-primary range-xs" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text text-white">Suspension Fairness</span><span className="text-rose-400 font-bold">{formData.suspension}/10</span></label>
                                        <input type="range" min="1" max="10" value={formData.suspension} onChange={e => setFormData({ ...formData, suspension: e.target.value })} className="range range-secondary range-xs" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text text-white">Support Quality</span><span className="text-emerald-400 font-bold">{formData.support}/10</span></label>
                                        <input type="range" min="1" max="10" value={formData.support} onChange={e => setFormData({ ...formData, support: e.target.value })} className="range range-accent range-xs" />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">Comment (Optional)</span></label>
                                    <textarea
                                        className="textarea bg-white/5 border-white/10 text-white focus:border-amber-500/50 focus:outline-none w-full h-24"
                                        value={formData.comment}
                                        onChange={e => setFormData({ ...formData, comment: e.target.value })}
                                        placeholder="Share your thoughts..."
                                    ></textarea>
                                </div>

                                <button className={`btn w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 border-none text-white hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-900/20 ${loading ? 'loading' : ''}`} disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit Rating'}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    <div className="lg:col-span-2 space-y-8 h-[600px] overflow-y-auto custom-scrollbar pr-2">
                        {/* Chart */}
                        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl border-white/10 bg-gradient-to-br from-amber-900/20 to-yellow-900/20">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-emerald-400" />
                                Platform Ratings Index
                            </h2>
                            {platforms.length > 0 ? (
                                <div className="h-80 w-full">
                                    <Bar data={chartData} options={chartOptions} />
                                </div>
                            ) : (
                                <div className="h-64 flex items-center justify-center text-white">
                                    <p>No aggregate data available yet.</p>
                                </div>
                            )}
                        </motion.div>

                        {/* History Table */}
                        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl border-white/10 bg-gradient-to-br from-amber-900/20 to-yellow-900/20">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <History className="w-5 h-5 text-blue-400" />
                                My Ratings History
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr className="text-white border-white/10">
                                            <th>Date</th>
                                            <th>Platform</th>
                                            <th>Scores (P/S/Q)</th>
                                            <th>Comment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userRatings.map((rating) => (
                                            <tr key={rating._id} className="border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="text-white">{new Date(rating.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <span className="font-bold text-white">{rating.platform}</span>
                                                </td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        <span className="badge badge-sm bg-purple-500/20 text-purple-300 border-none" title="Payment">{rating.ratings.payment}</span>
                                                        <span className="badge badge-sm bg-rose-500/20 text-rose-300 border-none" title="Suspension">{rating.ratings.suspension}</span>
                                                        <span className="badge badge-sm bg-emerald-500/20 text-emerald-300 border-none" title="Support">{rating.ratings.support}</span>
                                                    </div>
                                                </td>
                                                <td className="text-white text-sm max-w-xs truncate">{rating.comment || '-'}</td>
                                            </tr>
                                        ))}
                                        {userRatings.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center py-8 text-white">
                                                    You haven't submitted any ratings yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Ratings;
