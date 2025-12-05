import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import SplineBackground from '../components/SplineBackground';
import { motion } from 'framer-motion';
import { User, Phone, Save, Camera, Mail, Shield, CreditCard, Link as LinkIcon } from 'lucide-react';

const Profile = () => {
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', role: 'Driver' });
    const [connectedAccounts, setConnectedAccounts] = useState([]);
    const [profilePic, setProfilePic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/me');
            const userData = res.data;

            setFormData({
                name: userData.name || '',
                phone: userData.phone || '',
                email: userData.email || 'user@example.com',
                role: userData.role || 'Driver'
            });
            setConnectedAccounts(userData.connectedAccounts || []);
            if (userData.profilePicture) {
                setProfilePic(userData.profilePicture);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load profile');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfilePic(res.data.imageUrl);
            toast.success('Profile picture updated!');

            // Update local storage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...user, profilePicture: res.data.imageUrl }));
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/users/me', {
                name: formData.name,
                phone: formData.phone
            });
            toast.success('Profile updated successfully!');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...user, ...res.data }));
        } catch (err) {
            toast.error('Failed to update profile');
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
                className="relative z-10 w-full max-w-4xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="glass-panel rounded-3xl overflow-hidden border-white/10 bg-white/5 shadow-2xl">
                    {/* Header / Banner */}
                    <div className="h-48 bg-gradient-to-r from-purple-600/50 to-indigo-600/50 relative">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    </div>

                    <div className="px-8 pb-8">
                        <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-16 mb-8 gap-6">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-gray-900 border-4 border-white/10 shadow-xl overflow-hidden flex items-center justify-center relative z-10">
                                    {profilePic ? (
                                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16 text-white" />
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="loading loading-spinner text-white"></div>
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 p-2 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-500 transition-colors z-20 cursor-pointer">
                                    <Camera className="w-4 h-4" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                            <div className="flex-1 text-center md:text-left mb-2">
                                <h1 className="text-3xl font-bold text-white">{formData.name || 'User Name'}</h1>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-white mt-1">
                                    <Shield className="w-4 h-4 text-emerald-400" />
                                    <span>Verified {formData.role}</span>
                                </div>
                            </div>
                            {/* Payment Methods Button Removed */}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                                    <User className="w-5 h-5 text-purple-400" />
                                    Personal Information
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-control">
                                            <label className="label"><span className="label-text text-white">Full Name</span></label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
                                                <input
                                                    type="text"
                                                    className="input pl-10 bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:outline-none w-full"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <label className="label"><span className="label-text text-white">Phone Number</span></label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
                                                <input
                                                    type="text"
                                                    className="input pl-10 bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:outline-none w-full"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-control md:col-span-2">
                                            <label className="label"><span className="label-text text-white">Email Address</span></label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
                                                <input
                                                    type="email"
                                                    className="input pl-10 bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:outline-none w-full opacity-70 cursor-not-allowed"
                                                    value={formData.email}
                                                    disabled
                                                />
                                            </div>
                                            <label className="label"><span className="label-text-alt text-white">Email cannot be changed</span></label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button className={`btn bg-gradient-to-r from-purple-600 to-indigo-600 border-none text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-900/20 px-8 ${loading ? 'loading' : ''}`} disabled={loading}>
                                            {loading ? 'Saving...' : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <h3 className="font-bold text-white mb-4">Account Status</h3>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                        <span className="text-white">Active</span>
                                    </div>
                                    <div className="text-sm text-white">
                                        Member since {new Date().getFullYear()}
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <h3 className="font-bold text-white mb-4">Connected Accounts</h3>
                                    <div className="space-y-3">
                                        {connectedAccounts.length > 0 ? connectedAccounts.map((acc, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                                                <span className="text-white">{acc.platform}</span>
                                                <span className={`text-xs font-bold ${acc.status === 'Connected' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                    {acc.status.toUpperCase()}
                                                </span>
                                            </div>
                                        )) : (
                                            <div className="text-center py-4 text-white text-sm">
                                                No accounts connected.
                                            </div>
                                        )}
                                        <button className="btn btn-sm btn-outline w-full border-white/10 text-white hover:bg-white/5 hover:text-white mt-2">
                                            <LinkIcon className="w-3 h-3 mr-1" /> Connect New
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Profile;
