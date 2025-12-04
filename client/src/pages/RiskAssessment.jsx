import React, { useState, useEffect } from 'react';
import api from '../api/axios';

import toast from 'react-hot-toast';

const RiskAssessment = () => {
    const [stats, setStats] = useState({
        cancellations: 0,
        acceptRate: 95,
        avgRating: 4.8,
        penalties: 0,
        lastSuspensionDays: 365
    });
    const [history, setHistory] = useState([]);
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
                recentStats: stats
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

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <h2 className="card-title">Suspension Risk Predictor</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Cancellations (Last 30 days)</span></label>
                                <input type="number" className="input input-bordered" value={stats.cancellations} onChange={e => setStats({ ...stats, cancellations: Number(e.target.value) })} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Acceptance Rate (%)</span></label>
                                <input type="number" className="input input-bordered" value={stats.acceptRate} onChange={e => setStats({ ...stats, acceptRate: Number(e.target.value) })} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Average Rating (0-5)</span></label>
                                <input type="number" step="0.1" className="input input-bordered" value={stats.avgRating} onChange={e => setStats({ ...stats, avgRating: Number(e.target.value) })} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Penalties (Last 30 days)</span></label>
                                <input type="number" className="input input-bordered" value={stats.penalties} onChange={e => setStats({ ...stats, penalties: Number(e.target.value) })} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Days Since Last Suspension</span></label>
                                <input type="number" className="input input-bordered" value={stats.lastSuspensionDays} onChange={e => setStats({ ...stats, lastSuspensionDays: Number(e.target.value) })} />
                            </div>
                            <button className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                                {loading ? 'Analyzing...' : 'Analyze Risk'}
                            </button>
                        </form>
                    </div>
                </div>

                {prediction && (
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Risk Analysis</h2>
                            <div className="flex flex-col items-center my-4">
                                <div className={`radial-progress ${prediction.riskLevel === 'high' ? 'text-error' : prediction.riskLevel === 'medium' ? 'text-warning' : 'text-success'}`}
                                    style={{ "--value": prediction.score * 100, "--size": "10rem", "--thickness": "1rem" }}>
                                    {Math.round(prediction.score * 100)}%
                                </div>
                                <div className="text-xl font-bold mt-2 uppercase">{prediction.riskLevel} RISK</div>
                            </div>

                            <div className="divider">Reasons</div>
                            <ul className="list-disc pl-5">
                                {prediction.reasons.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>

                            <div className="divider">Mitigation</div>
                            <ul className="list-disc pl-5 text-success">
                                {prediction.mitigation.map((m, i) => <li key={i}>{m}</li>)}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Assessment History</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Risk Level</th>
                                    <th>Score</th>
                                    <th>Reasons</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item._id}>
                                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${item.prediction.riskLevel === 'high' ? 'badge-error' : item.prediction.riskLevel === 'medium' ? 'badge-warning' : 'badge-success'}`}>
                                                {item.prediction.riskLevel}
                                            </span>
                                        </td>
                                        <td>{Math.round(item.prediction.score * 100)}%</td>
                                        <td>{item.prediction.reasons.join(', ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskAssessment;
