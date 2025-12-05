import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, LogOut, User, Bell, Menu } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="navbar bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg z-20 px-6 h-16">
            <div className="flex-1 gap-4">
                {location.pathname !== '/' && (
                    <button onClick={() => navigate(-1)} className="btn btn-ghost btn-circle btn-sm text-white/70 hover:bg-white/10 hover:text-white">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}
                {/* Mobile Menu Toggle (Visible on small screens if Sidebar is hidden) */}
                <label htmlFor="my-drawer-2" className="btn btn-ghost btn-circle btn-sm lg:hidden text-white/70">
                    <Menu className="w-6 h-6" />
                </label>

                <div className="flex flex-col">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        GigGuard
                    </span>
                </div>
            </div>

            <div className="flex-none gap-4">
                <button className="btn btn-ghost btn-circle btn-sm text-white/70 hover:bg-white/10 hover:text-white">
                    <div className="indicator">
                        <Bell className="w-5 h-5" />
                        <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                </button>

                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-white/10 hover:border-white/30 transition-all">
                        <div className="w-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5">
                            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{user.name ? user.name.charAt(0) : 'U'}</span>
                            </div>
                        </div>
                    </label>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-gray-900/90 backdrop-blur-xl rounded-2xl w-52 border border-white/10 text-white">
                        <li className="menu-title text-white/50 px-4 py-2">Account</li>
                        <li>
                            <a onClick={() => navigate('/profile')} className="hover:bg-white/10 hover:text-white rounded-lg py-2">
                                <User className="w-4 h-4" /> Profile
                            </a>
                        </li>
                        <div className="divider my-1 before:bg-white/10 after:bg-white/10"></div>
                        <li>
                            <a onClick={handleLogout} className="text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 rounded-lg py-2">
                                <LogOut className="w-4 h-4" /> Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
