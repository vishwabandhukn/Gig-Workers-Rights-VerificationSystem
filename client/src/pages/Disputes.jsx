import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import SplineBackground from '../components/SplineBackground';
import { motion } from 'framer-motion';
import { Scale, FileText, Download, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Disputes = () => {
    const [disputes, setDisputes] = useState([]);
    const [evidenceList, setEvidenceList] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        evidenceIds: [],
        generateAppeal: true
    });
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchData = async () => {
        if (!user._id) return;
        try {
            const disputesRes = await api.get(`/disputes/${user._id}`);
            setDisputes(disputesRes.data.items);

            const evidenceRes = await api.get(`/blackbox/${user._id}`);
            setEvidenceList(evidenceRes.data.items);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user._id) fetchData();
    }, [user._id]);

    const handleEvidenceToggle = (id) => {
        const newIds = formData.evidenceIds.includes(id)
            ? formData.evidenceIds.filter(eid => eid !== id)
            : [...formData.evidenceIds, id];
        setFormData({ ...formData, evidenceIds: newIds });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/disputes/create', {
                ...formData,
                platform: 'Uber', // Could be dynamic
                userName: user.name
            });
            setFormData({ title: '', description: '', evidenceIds: [], generateAppeal: true });
            toast.success('Dispute created successfully!');
            fetchData();
        } catch (err) {
            toast.error('Failed to create dispute');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (disputeId) => {
        try {
            const res = await api.get(`/export/case/${disputeId}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `case_${disputeId}.pdf`);
            document.body.appendChild(link);
            link.click();
            toast.success('Download started');
        } catch (err) {
            toast.error('Download failed');
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
                    <div className="p-3 rounded-2xl bg-purple-500/20 backdrop-blur-md border border-purple-500/30">
                        <Scale className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white">Dispute Center</h1>
                        <p className="text-white">Manage your cases and generate AI-powered appeals</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Dispute Form */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <div className="glass-panel p-6 rounded-3xl border-white/10 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 h-[600px] overflow-y-auto custom-scrollbar">
                            {!user._id && (
                                <div className="alert alert-warning shadow-lg mb-6 bg-amber-500/20 text-amber-200 border-amber-500/30">
                                    <div>
                                        <AlertCircle className="stroke-current flex-shrink-0 h-6 w-6" />
                                        <span>Please log out and log back in to sync your account data.</span>
                                    </div>
                                </div>
                            )}
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-400" />
                                New Dispute
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">Title</span></label>
                                    <input
                                        type="text"
                                        className="input bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:outline-none w-full"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="e.g. Unfair Deactivation"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">Description</span></label>
                                    <textarea
                                        className="textarea bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:outline-none w-full h-32"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        placeholder="Describe the incident..."
                                    ></textarea>
                                </div>

                                <div className="form-control">
                                    <label className="label"><span className="label-text text-white">Select Evidence</span></label>
                                    <div className="max-h-40 overflow-y-auto border border-white/10 p-2 rounded-xl bg-white/5 custom-scrollbar">
                                        {evidenceList.map(ev => (
                                            <label key={ev._id} className="label cursor-pointer justify-start gap-3 hover:bg-white/5 rounded-lg p-2 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-sm checkbox-primary border-white/30"
                                                    checked={formData.evidenceIds.includes(ev._id)}
                                                    onChange={() => handleEvidenceToggle(ev._id)}
                                                />
                                                <span className="label-text text-white text-sm">{new Date(ev.timestamp).toLocaleDateString()} - {ev.tags.join(', ')}</span>
                                            </label>
                                        ))}
                                        {evidenceList.length === 0 && (
                                            <p className="text-white text-center text-sm py-4">No evidence found in locker.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label cursor-pointer justify-start gap-3 p-0 mt-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary border-white/30"
                                            checked={formData.generateAppeal}
                                            onChange={e => setFormData({ ...formData, generateAppeal: e.target.checked })}
                                        />
                                        <span className="label-text text-white font-medium">Generate Appeal Letter with AI</span>
                                    </label>
                                </div>

                                <button className={`btn w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 border-none text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-900/20 ${loading ? 'loading' : ''}`} disabled={loading}>
                                    {loading ? 'Generating Case...' : 'Create Dispute Case'}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Disputes List */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4 h-[600px] overflow-y-auto custom-scrollbar pr-2 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-3xl p-4 border border-white/5">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 px-1">
                            <Scale className="w-5 h-5 text-indigo-400" />
                            Active Cases
                        </h2>
                        {disputes.map((dispute) => (
                            <div key={dispute._id} className="collapse collapse-arrow glass-card border-white/10 bg-white/5 rounded-2xl">
                                <input type="radio" name="my-accordion-2" />
                                <div className="collapse-title text-lg font-medium text-white flex items-center gap-3">
                                    {dispute.title}
                                    <span className={`badge border-none text-white ${dispute.status === 'Open' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10'}`}>{dispute.status}</span>
                                </div>
                                <div className="collapse-content text-white">
                                    <p className="mb-4 p-4 bg-black/20 rounded-xl border border-white/5">{dispute.description}</p>
                                    {dispute.appealLetter && (
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                                                <h3 className="font-bold text-white flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                                                    AI Generated Appeal
                                                </h3>
                                                <button onClick={() => handleDownload(dispute._id)} className="btn btn-sm btn-outline text-white border-white/30 hover:bg-white/10 hover:border-white/50">
                                                    <Download className="w-4 h-4 mr-1" />
                                                    Download PDF
                                                </button>
                                            </div>
                                            {(() => {
                                                try {
                                                    const letter = JSON.parse(dispute.appealLetter);
                                                    return (
                                                        <div className="prose prose-invert max-w-none text-sm">
                                                            <p><strong className="text-purple-300">Subject:</strong> {letter.subject}</p>
                                                            <div className="divider my-2 before:bg-white/10 after:bg-white/10"></div>
                                                            <p className="whitespace-pre-wrap leading-relaxed opacity-90">{letter.body}</p>
                                                            <div className="divider my-2 before:bg-white/10 after:bg-white/10"></div>
                                                            <h4 className="text-white font-bold mt-4 mb-2">Key Arguments</h4>
                                                            <ul className="list-disc pl-5 space-y-1 text-white">
                                                                {letter.summaryPoints && letter.summaryPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                                                            </ul>
                                                        </div>
                                                    );
                                                } catch (e) {
                                                    return <pre className="whitespace-pre-wrap text-xs font-mono bg-black/30 p-4 rounded-lg">{dispute.appealLetter}</pre>;
                                                }
                                            })()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {disputes.length === 0 && (
                            <div className="text-center py-12 glass-panel rounded-3xl border-white/10 bg-white/5">
                                <div className="p-4 rounded-full bg-white/5 inline-block mb-4">
                                    <CheckCircle className="w-12 h-12 text-white" />
                                </div>
                                <p className="text-white text-lg">No active disputes.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Disputes;
