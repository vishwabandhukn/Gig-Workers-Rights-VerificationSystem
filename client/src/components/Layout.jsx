import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex h-screen font-sans bg-transparent">
            {/* Sidebar is fixed or flex item */}
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
