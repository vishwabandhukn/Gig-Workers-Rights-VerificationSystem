import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ phone: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            toast.success('Login successful!');
            navigate('/');
        } catch (err) {
            toast.error('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">Access your gig worker rights dashboard.</p>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Phone</span></label>
                            <input type="text" name="phone" placeholder="phone" className="input input-bordered" onChange={handleChange} />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input type="password" name="password" placeholder="password" className="input input-bordered" onChange={handleChange} />
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Login</button>
                        </div>
                        <div className="text-center mt-4">
                            <Link to="/register" className="link link-hover">Don't have an account? Register</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
