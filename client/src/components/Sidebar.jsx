import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="drawer-side w-64 bg-base-100 shadow-xl hidden lg:block">
            <ul className="menu p-4 w-64 h-full bg-base-100 text-base-content">
                <li className="mb-4">
                    <div className="text-2xl font-bold text-primary px-4">GigGuard</div>
                </li>
                <li><Link to="/" className={isActive('/')}>Dashboard</Link></li>
                <li><Link to="/evidence" className={isActive('/evidence')}>Evidence Locker</Link></li>
                <li><Link to="/payouts" className={isActive('/payouts')}>Payout Verification</Link></li>
                <li><Link to="/disputes" className={isActive('/disputes')}>Dispute Center</Link></li>
                <li><Link to="/risk" className={isActive('/risk')}>Risk Assessment</Link></li>
                <li><Link to="/profile" className={isActive('/profile')}>Profile</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
