import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex h-screen bg-base-200 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-200 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
