import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            toast.success('Registration successful!');
            navigate('/');
        } catch (err) {
            toast.error('Registration failed. Please try again.');
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Register</h1>
                    <p className="py-6">Join GigGuard today.</p>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Name</span></label>
                            <input type="text" name="name" placeholder="Name" className="input input-bordered" onChange={handleChange} autoComplete="name" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Phone</span></label>
                            <input type="text" name="phone" placeholder="Phone" className="input input-bordered" onChange={handleChange} autoComplete="tel" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input type="password" name="password" placeholder="Password" className="input input-bordered" onChange={handleChange} autoComplete="new-password" />
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Register</button>
                        </div>
                        <div className="text-center mt-4">
                            <Link to="/login" className="link link-hover">Already have an account? Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
