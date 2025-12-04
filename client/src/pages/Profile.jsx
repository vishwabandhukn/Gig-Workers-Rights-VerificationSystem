import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [loading, setLoading] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/me');
            setFormData({ name: res.data.name, phone: res.data.phone });
        } catch (err) {
            console.error(err);
            toast.error('Failed to load profile');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/users/me', formData);
            toast.success('Profile updated successfully!');
            // Update local storage if needed, though usually we rely on API
            const user = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...user, ...res.data }));
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
            <div className="card-body">
                <h2 className="card-title">User Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Name</span></label>
                        <input type="text" className="input input-bordered" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Phone</span></label>
                        <input type="text" className="input input-bordered" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <button className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
