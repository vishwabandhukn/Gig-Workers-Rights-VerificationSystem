import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

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
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
                label: 'Avg Suspension Rating',
                data: platforms.map(p => p.avgSuspension),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Avg Support Rating',
                data: platforms.map(p => p.avgSupport),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
        ],
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
                    <h2 className="card-title">Rate a Platform</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Platform</span></label>
                            <select className="select select-bordered" value={formData.platform} onChange={e => setFormData({ ...formData, platform: e.target.value })}>
                                <option>Uber</option>
                                <option>Lyft</option>
                                <option>DoorDash</option>
                                <option>Instacart</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Payment Fairness (1-10)</span></label>
                                <input type="range" min="1" max="10" value={formData.payment} onChange={e => setFormData({ ...formData, payment: e.target.value })} className="range range-primary" />
                                <div className="w-full flex justify-between text-xs px-2"><span>1</span><span>5</span><span>10</span></div>
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Suspension Fairness (1-10)</span></label>
                                <input type="range" min="1" max="10" value={formData.suspension} onChange={e => setFormData({ ...formData, suspension: e.target.value })} className="range range-secondary" />
                                <div className="w-full flex justify-between text-xs px-2"><span>1</span><span>5</span><span>10</span></div>
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Support Quality (1-10)</span></label>
                                <input type="range" min="1" max="10" value={formData.support} onChange={e => setFormData({ ...formData, support: e.target.value })} className="range range-accent" />
                                <div className="w-full flex justify-between text-xs px-2"><span>1</span><span>5</span><span>10</span></div>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Comment (Optional)</span></label>
                            <textarea className="textarea textarea-bordered" value={formData.comment} onChange={e => setFormData({ ...formData, comment: e.target.value })}></textarea>
                        </div>

                        <button className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Rating'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">My Ratings History</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Platform</th>
                                    <th>Payment</th>
                                    <th>Suspension</th>
                                    <th>Support</th>
                                    <th>Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userRatings.map((rating) => (
                                    <tr key={rating._id}>
                                        <td>{new Date(rating.createdAt).toLocaleDateString()}</td>
                                        <td>{rating.platform}</td>
                                        <td>{rating.ratings.payment}</td>
                                        <td>{rating.ratings.suspension}</td>
                                        <td>{rating.ratings.support}</td>
                                        <td>{rating.comment}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Platform Ratings Index</h2>
                    {platforms.length > 0 ? (
                        <div className="h-64">
                            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    ) : <p>No ratings yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default Ratings;
