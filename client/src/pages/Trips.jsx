import React, { useState, useEffect } from 'react';
import api from '../api/axios';

import toast from 'react-hot-toast';

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [formData, setFormData] = useState({
        platform: 'Uber',
        tripId: '',
        startTime: '',
        endTime: '',
        earnings: ''
    });
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchTrips = async () => {
        if (!user._id) return;
        try {
            const res = await api.get(`/trips/${user._id}`);
            setTrips(res.data.items);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user._id) fetchTrips();
    }, [user._id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/trips', {
                ...formData,
                startTime: new Date(formData.startTime),
                endTime: new Date(formData.endTime),
                meta: { earnings: Number(formData.earnings) }
            });
            setFormData({
                platform: 'Uber',
                tripId: '',
                startTime: '',
                endTime: '',
                earnings: ''
            });
            toast.success('Trip logged successfully!');
            fetchTrips();
        } catch (err) {
            toast.error('Failed to log trip');
        } finally {
            setLoading(false);
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
                    <h2 className="card-title">Log New Trip</h2>
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
                                <label className="label"><span className="label-text">Trip ID</span></label>
                                <input type="text" className="input input-bordered" value={formData.tripId} onChange={e => setFormData({ ...formData, tripId: e.target.value })} required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Start Time</span></label>
                                <input type="datetime-local" className="input input-bordered" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">End Time</span></label>
                                <input type="datetime-local" className="input input-bordered" value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Earnings ($)</span></label>
                                <input type="number" className="input input-bordered" value={formData.earnings} onChange={e => setFormData({ ...formData, earnings: e.target.value })} required />
                            </div>
                        </div>
                        <button className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                            {loading ? 'Logging...' : 'Log Trip'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Trip History</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Platform</th>
                                    <th>Trip ID</th>
                                    <th>Duration (min)</th>
                                    <th>Earnings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trips.map((trip) => {
                                    const start = new Date(trip.startTime);
                                    const end = new Date(trip.endTime);
                                    const duration = Math.round((end - start) / 60000);
                                    return (
                                        <tr key={trip._id}>
                                            <td>{start.toLocaleDateString()} {start.toLocaleTimeString()}</td>
                                            <td>{trip.platform}</td>
                                            <td>{trip.tripId}</td>
                                            <td>{duration}</td>
                                            <td>${trip.meta?.earnings || 0}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trips;
