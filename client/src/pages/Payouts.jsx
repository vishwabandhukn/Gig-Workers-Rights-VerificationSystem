import React, { useState, useEffect } from 'react';
import api from '../api/axios';

import toast from 'react-hot-toast';

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
                    <h2 className="card-title">Verify Payout</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Platform</span></label>
                                <select className="select select-bordered" value={formData.platform} onChange={e => setFormData({ ...formData, platform: e.target.value })}>
                                    <option>Uber</option>
                                    <option>Lyft</option>
                                    <option>DoorDash</option>
                                    <option>Instacart</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Period (e.g. 2023-W40)</span></label>
                                <input type="text" className="input input-bordered" value={formData.period} onChange={e => setFormData({ ...formData, period: e.target.value })} required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Actual Received ($)</span></label>
                                <input type="number" className="input input-bordered" value={formData.actualReceived} onChange={e => setFormData({ ...formData, actualReceived: e.target.value })} required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Expected Earnings (from Platform)</span></label>
                                <input type="number" className="input input-bordered" value={formData.expectedTotal} onChange={e => setFormData({ ...formData, expectedTotal: e.target.value })} required />
                            </div>
                        </div>
                        <button className="btn btn-primary">Verify</button>
                    </form>
                    {verificationResult && (
                        <div className={`alert ${verificationResult.verified ? 'alert-success' : 'alert-error'} mt-4`}>
                            <div>
                                <h3 className="font-bold">{verificationResult.verified ? 'Verified Match!' : 'Mismatch Detected!'}</h3>
                                <p>Expected: ${verificationResult.expected}</p>
                                <p>Delta: ${verificationResult.delta}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Payout History</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
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
                                    <tr key={item._id}>
                                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td>{item.platform}</td>
                                        <td>{item.period}</td>
                                        <td>${item.actualReceived}</td>
                                        <td>
                                            {item.verified ? <span className="badge badge-success">Verified</span> : <span className="badge badge-error">Mismatch</span>}
                                        </td>
                                        <td className={item.delta !== 0 ? 'text-error font-bold' : ''}>${item.delta}</td>
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

export default Payouts;
