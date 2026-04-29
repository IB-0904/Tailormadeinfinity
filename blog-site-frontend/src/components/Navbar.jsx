import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('authInfo');
        navigate('/login');
    };

    return (
        <nav className="bg-[#1e293b] text-white p-4 shadow-md flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold tracking-wide">
                BlogSite
            </Link>

            <div className="flex space-x-4">
                {user ? (
                    <>
                        <Link to="/explore" className="bg-transparent hover:bg-white/10 px-4 py-2 rounded transition">
                            Explore
                        </Link>
                        <Link to="/my-blogs" className="bg-[#8b5cf6] hover:bg-[#7c3aed] px-4 py-2 rounded text-sm font-medium transition">
                            My Blogs
                        </Link>
                        <button onClick={handleLogout} className="bg-[#ef4444] hover:bg-[#dc2626] px-4 py-2 rounded text-sm font-medium transition">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="bg-[#3b82f6] hover:bg-[#2563eb] px-6 py-2 rounded text-sm font-medium transition">
                            Login
                        </Link>
                        <Link to="/register" className="bg-[#10b981] hover:bg-[#059669] px-6 py-2 rounded text-sm font-medium transition">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
