import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import SplineBackground from '../components/SplineBackground';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Shield, Phone } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ phone: '', password: '' });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            toast.success('Login successful!');
            navigate('/');
        } catch (err) {
            toast.error('Login failed. Please check your credentials.');
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
        <div className="relative min-h-screen text-white font-sans overflow-hidden flex items-center justify-center p-6">
            {/* Darker Premium Gradient Background Layer */}
            <div className="fixed inset-0 z-0 bg-[#2C5364] opacity-90"></div>
            <div className="fixed inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>

            <div className="fixed inset-0 z-0 opacity-40 mix-blend-screen">
                <SplineBackground />
            </div>

            <motion.div
                className="relative z-10 w-full max-w-md"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30 mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-white/60">Access your GigGuard dashboard</p>
                </motion.div>

                <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">Phone Number</span></label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Enter your phone"
                                    className="input pl-10 bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:outline-none w-full transition-all hover:bg-white/10"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">Password</span></label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    className="input pl-10 bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:outline-none w-full transition-all hover:bg-white/10"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover text-purple-300 hover:text-purple-200">Forgot password?</a>
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <button className={`btn bg-gradient-to-r from-purple-600 to-indigo-600 border-none text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-900/20 h-12 text-lg ${loading ? 'loading' : ''}`} disabled={loading}>
                                {loading ? 'Logging in...' : (
                                    <>
                                        Login
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="text-center mt-6">
                            <p className="text-white/60 text-sm">
                                Don't have an account?{' '}
                                <Link to="/register" className="link link-hover text-purple-300 hover:text-purple-200 font-medium">
                                    Register now
                                </Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
