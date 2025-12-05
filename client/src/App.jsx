import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Evidence from './pages/Evidence';
import Payouts from './pages/Payouts';
import Disputes from './pages/Disputes';
import RiskAssessment from './pages/RiskAssessment';
import Login from './pages/Login';
import Register from './pages/Register';
// import Trips from './pages/Trips';
import Ratings from './pages/Ratings';
import Profile from './pages/Profile';

import ProtectedRoute from './components/ProtectedRoute';

import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        {/* <Route path="trips" element={<Trips />} /> */}
                        <Route path="ratings" element={<Ratings />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="evidence" element={<Evidence />} />
                        <Route path="payouts" element={<Payouts />} />
                        <Route path="disputes" element={<Disputes />} />
                        <Route path="risk" element={<RiskAssessment />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
