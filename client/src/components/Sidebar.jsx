import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, DollarSign, Scale, AlertTriangle, User, Shield } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path
        ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-white border-l-4 border-purple-500'
        : 'text-white/60 hover:bg-white/5 hover:text-white';

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/evidence', label: 'Evidence Locker', icon: FileText },
        { path: '/payouts', label: 'Payout Verification', icon: DollarSign },
        { path: '/disputes', label: 'Dispute Center', icon: Scale },
        { path: '/risk', label: 'Risk Assessment', icon: AlertTriangle },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="drawer-side hidden lg:block z-20">
            <div className="w-64 h-full bg-gray-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-wide">GigGuard</span>
                </div>

                <ul className="menu p-4 w-full gap-2">
                    <li className="menu-title text-white/40 text-xs font-bold uppercase tracking-wider mb-2 px-4">Main Menu</li>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.path)}`}
                            >
                                <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-purple-400' : 'text-current'}`} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="mt-auto p-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-white/10">
                        <h4 className="text-white font-bold text-sm mb-1">Need Help?</h4>
                        <p className="text-white/50 text-xs mb-3">Contact our support team for assistance.</p>
                        <button className="btn btn-xs btn-outline text-white border-white/20 w-full hover:bg-white/10 hover:border-white/40">Support</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
