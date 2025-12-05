import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import SplineBackground from '../components/SplineBackground';
import { motion } from 'framer-motion';
import { FileText, Upload, Link as LinkIcon, Hash, Calendar } from 'lucide-react';

const Evidence = () => {
    const [file, setFile] = useState(null);
    const [tripId, setTripId] = useState('');
    const [tags, setTags] = useState('');
    const [evidenceList, setEvidenceList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchEvidence = async () => {
        try {
            const res = await api.get(`/blackbox/${user._id}`);
            setEvidenceList(res.data.items);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user._id) fetchEvidence();
    }, [user._id]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('tripId', tripId);
        formData.append('tags', tags);

        try {
            await api.post('/blackbox/upload', formData);
            setFile(null);
            setTripId('');
            setTags('');
            toast.success('Evidence uploaded successfully!');
            fetchEvidence();
        } catch (err) {
            toast.error('Upload failed. Please try again.');
        } finally {
            setUploading(false);
            setFile(null);
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
            <div className="fixed inset-0 z-0 bg-[#2c3e50] opacity-90"></div>
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
                    <div className="p-3 rounded-2xl bg-blue-500/20 backdrop-blur-md border border-blue-500/30">
                        <FileText className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white">Evidence Locker</h1>
                        <p className="text-white">Securely store and manage your trip evidence</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <div className="glass-panel p-6 rounded-3xl border-white/10 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 h-[600px] overflow-y-auto custom-scrollbar">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Upload className="w-5 h-5 text-emerald-400" />
                                New Upload
                            </h2>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">Trip ID (Optional)</span></label>
                                    <input
                                        type="text"
                                        value={tripId}
                                        onChange={(e) => setTripId(e.target.value)}
                                        className="input bg-white/5 border-white/10 text-white focus:border-blue-500/50 focus:outline-none"
                                        placeholder="e.g. TRIP-12345"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">Tags</span></label>
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        className="input bg-white/5 border-white/10 text-white focus:border-blue-500/50 focus:outline-none"
                                        placeholder="dashcam, screenshot, etc."
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">File Evidence</span></label>
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="file-input file-input-bordered w-full bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <button
                                    className={`btn w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 border-none text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-900/20 ${uploading ? 'loading' : ''}`}
                                    disabled={uploading}
                                >
                                    {uploading ? 'Encrypting & Uploading...' : 'Secure Upload'}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* List Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <div className="glass-panel p-6 rounded-3xl border-white/10 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 h-[600px] overflow-y-auto custom-scrollbar">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Hash className="w-5 h-5 text-purple-400" />
                                Stored Evidence
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr className="text-white border-white/10">
                                            <th>Date</th>
                                            <th>Trip ID</th>
                                            <th>Integrity Hash (SHA-256)</th>
                                            <th>Tags</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {evidenceList.map((item) => (
                                            <tr key={item._id} className="border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="text-white">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-white" />
                                                        {new Date(item.timestamp).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="font-mono text-white">{item.tripId || 'N/A'}</td>
                                                <td>
                                                    <div className="tooltip" data-tip={item.sha256}>
                                                        <div className="badge badge-ghost gap-2 font-mono text-xs bg-white/5 text-white border-white/10">
                                                            <Hash className="w-3 h-3" />
                                                            {item.sha256.substring(0, 8)}...
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {item.tags.map((tag, i) => (
                                                            <span key={i} className="badge badge-sm bg-blue-500/10 text-blue-300 border-none">{tag}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>
                                                    <a
                                                        href={item.s3Url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="btn btn-xs btn-ghost text-blue-400 hover:bg-blue-500/10"
                                                    >
                                                        <LinkIcon className="w-4 h-4" />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                        {evidenceList.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center py-8 text-white">
                                                    No evidence uploaded yet.
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

export default Evidence;
