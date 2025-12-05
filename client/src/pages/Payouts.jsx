import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import SplineBackground from '../components/SplineBackground';
import { motion } from 'framer-motion';
import { DollarSign, CheckCircle, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';

const Payouts = () => {
    const [payouts, setPayouts] = useState([]);
    const [formData, setFormData] = useState({
        platform: 'Uber',
        period: '',
        actualReceived: '',
        expectedTotal: ''
    });
    const [verificationResult, setVerificationResult] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchPayouts = async () => {
        if (!user._id) return;
        try {
            const res = await api.get(`/payouts/${user._id}`);
            setPayouts(res.data.items);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user._id) fetchPayouts();
    }, [user._id]);

    useEffect(() => {
        if (verificationResult) {
            const timer = setTimeout(() => {
                setVerificationResult(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [verificationResult]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/payouts/submit', {
                platform: formData.platform,
                period: formData.period,
                actualReceived: Number(formData.actualReceived),
                platformStatement: { total: Number(formData.expectedTotal) }
            });

            setVerificationResult(res.data);
            toast.success('Payout verification complete!');
            setFormData({
                platform: 'Uber',
                period: '',
                actualReceived: '',
                expectedTotal: ''
            });
            fetchPayouts();
        } catch (err) {
            toast.error('Submission failed');
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
                    <div className="p-3 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30">
                        <DollarSign className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white">Verify Payouts</h1>
                        <p className="text-white">Cross-reference your platform earnings with actual deposits</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Verification Form */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <div className="glass-panel p-6 rounded-3xl border-white/10 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 h-[600px] overflow-y-auto custom-scrollbar">
                            {!user._id && (
                                <div className="alert alert-warning shadow-lg mb-6 bg-amber-500/20 text-amber-200 border-amber-500/30">
                                    <div>
                                        <AlertTriangle className="stroke-current flex-shrink-0 h-6 w-6" />
                                        <span>Please log out and log back in to sync your account data.</span>
                                    </div>
                                </div>
                            )}
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                New Verification
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">Platform</span></label>
                                    <select
                                        className="select bg-white/5 border-white/10 text-white focus:border-emerald-500/50 focus:outline-none w-full"
                                        value={formData.platform}
                                        onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                    >
                                        <option className="bg-gray-900">Uber</option>
                                        <option className="bg-gray-900">Lyft</option>
                                        <option className="bg-gray-900">DoorDash</option>
                                        <option className="bg-gray-900">Instacart</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">Period (e.g. 2023-W40)</span></label>
                                    <input
                                        type="text"
                                        className="input bg-white/5 border-white/10 text-white focus:border-emerald-500/50 focus:outline-none w-full"
                                        value={formData.period}
                                        onChange={e => setFormData({ ...formData, period: e.target.value })}
                                        required
                                        placeholder="YYYY-W##"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">Actual Received ($)</span></label>
                                    <input
                                        type="number"
                                        className="input bg-white/5 border-white/10 text-white focus:border-emerald-500/50 focus:outline-none w-full"
                                        value={formData.actualReceived}
                                        onChange={e => setFormData({ ...formData, actualReceived: e.target.value })}
                                        required
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">Expected Earnings (from Platform)</span></label>
                                    <input
                                        type="number"
                                        className="input bg-white/5 border-white/10 text-white focus:border-emerald-500/50 focus:outline-none w-full"
                                        value={formData.expectedTotal}
                                        onChange={e => setFormData({ ...formData, expectedTotal: e.target.value })}
                                        required
                                        placeholder="0.00"
                                    />
                                </div>
                                <button className="btn w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 border-none text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-900/20">
                                    Verify Match
                                </button>
                            </form>
                            {verificationResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`alert ${verificationResult.verified ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30' : 'bg-rose-500/20 text-rose-200 border-rose-500/30'} mt-6 shadow-lg backdrop-blur-md border`}
                                >
                                    <div>
                                        <h3 className="font-bold flex items-center gap-2">
                                            {verificationResult.verified ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                                            {verificationResult.verified ? 'Verified Match!' : 'Mismatch Detected!'}
                                        </h3>
                                        <div className="text-sm mt-1 opacity-90">
                                            <p>Expected: ${verificationResult.expected}</p>
                                            <p>Delta: ${verificationResult.delta}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* History Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <div className="glass-panel p-6 rounded-3xl border-white/10 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 h-[600px] overflow-y-auto custom-scrollbar">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                Payout History
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr className="text-white border-white/10">
                                            <th>Date</th>
                                            <th>Platform</th>
                                            <th>Period</th>
                                            <th>Received</th>
                                            <th>Status</th>
                                            <th>Delta</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payouts.map((item) => (
                                            <tr key={item._id} className="border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="text-white">{new Date(item.createdAt).toLocaleDateString()}</td>
                                                <td className="font-medium text-white">{item.platform}</td>
                                                <td className="text-white">{item.period}</td>
                                                <td className="font-mono text-emerald-300">${item.actualReceived}</td>
                                                <td>
                                                    {item.verified ? (
                                                        <span className="badge badge-sm bg-emerald-500/20 text-emerald-300 border-emerald-500/30 gap-1 pl-1 pr-2 h-auto py-1">
                                                            <CheckCircle className="w-3 h-3" /> Verified
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-sm bg-rose-500/20 text-rose-300 border-rose-500/30 gap-1 pl-1 pr-2 h-auto py-1">
                                                            <AlertTriangle className="w-3 h-3" /> Mismatch
                                                        </span>
                                                    )}
                                                </td>
                                                <td className={`font-mono font-bold ${item.delta !== 0 ? 'text-rose-400' : 'text-white'}`}>
                                                    ${item.delta}
                                                </td>
                                            </tr>
                                        ))}
                                        {payouts.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center py-8 text-white">
                                                    No payout history found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Payouts;
