import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/v1.0/blogsite/user/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            // Show alert exactly as screenshot
            window.alert('User registered successfully!');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] min-h-[calc(100vh-72px)] flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md my-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#1e293b] mb-2">Create Account</h2>
                    <p className="text-gray-500">Join our blogging community today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-[#1e293b] mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#1e293b] mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#1e293b] mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#1e293b] mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-3 rounded transition shadow-md mt-2"
                    >
                        CREATE ACCOUNT
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-500">
                        Already have an account? <Link to="/login" className="text-[#6366f1] font-semibold">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
