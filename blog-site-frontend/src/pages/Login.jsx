import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/v1.0/blogsite/user/login', {
                email,
                password
            });
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('authInfo', JSON.stringify({ email, password }));
            toast.success('Login successful!');
            navigate('/my-blogs');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="bg-[#3b82f6] min-h-[calc(100vh-72px)] flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#1e293b] mb-2">Welcome Back</h2>
                    <p className="text-gray-500">Sign in to continue your blogging journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[#1e293b] mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-200 bg-[#f8fafc] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="user@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#1e293b] mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-200 bg-[#f8fafc] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3 rounded transition shadow-md"
                    >
                        SIGN IN
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-500 mb-2">
                        Don't have an account? <Link to="/register" className="text-blue-600 font-semibold">Create Account</Link>
                    </p>
                    <a href="#" className="text-gray-400">Forgot Password?</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
