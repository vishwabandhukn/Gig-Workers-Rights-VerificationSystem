import React, { useState, useEffect } from 'react';
import api from '../api/axios';

import toast from 'react-hot-toast';

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

    return (
        <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    {!user._id && (
                        <div className="alert alert-warning shadow-lg mb-4">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span>Please log out and log back in to sync your account data.</span>
                            </div>
                        </div>
                    )}
                    <h2 className="card-title">Create Dispute & Generate Appeal</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Title</span></label>
                            <input type="text" className="input input-bordered" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Description</span></label>
                            <textarea className="textarea textarea-bordered" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required></textarea>
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Select Evidence</span></label>
                            <div className="max-h-40 overflow-y-auto border p-2 rounded">
                                {evidenceList.map(ev => (
                                    <label key={ev._id} className="label cursor-pointer justify-start gap-2">
                                        <input type="checkbox" className="checkbox checkbox-sm" checked={formData.evidenceIds.includes(ev._id)} onChange={() => handleEvidenceToggle(ev._id)} />
                                        <span className="label-text">{new Date(ev.timestamp).toLocaleDateString()} - {ev.tags.join(', ')}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-2">
                                <input type="checkbox" className="checkbox" checked={formData.generateAppeal} onChange={e => setFormData({ ...formData, generateAppeal: e.target.checked })} />
                                <span className="label-text">Generate Appeal Letter with AI</span>
                            </label>
                        </div>

                        <button className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                            {loading ? 'Generating...' : 'Create Dispute'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {disputes.map((dispute) => (
                    <div key={dispute._id} className="collapse collapse-arrow bg-base-100 shadow-xl">
                        <input type="radio" name="my-accordion-2" />
                        <div className="collapse-title text-xl font-medium">
                            {dispute.title} <span className="badge badge-sm">{dispute.status}</span>
                        </div>
                        <div className="collapse-content">
                            <p className="mb-2">{dispute.description}</p>
                            {dispute.appealLetter && (
                                <div className="bg-base-200 p-4 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold">AI Generated Appeal</h3>
                                        <button onClick={() => handleDownload(dispute._id)} className="btn btn-sm btn-outline">
                                            Download PDF
                                        </button>
                                    </div>
                                    {(() => {
                                        try {
                                            const letter = JSON.parse(dispute.appealLetter);
                                            return (
                                                <>
                                                    <p><strong>Subject:</strong> {letter.subject}</p>
                                                    <div className="divider"></div>
                                                    <p className="whitespace-pre-wrap">{letter.body}</p>
                                                    <div className="divider"></div>
                                                    <ul className="list-disc pl-5">
                                                        {letter.summaryPoints && letter.summaryPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                                                    </ul>
                                                </>
                                            );
                                        } catch (e) {
                                            return <pre>{dispute.appealLetter}</pre>;
                                        }
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Disputes;
