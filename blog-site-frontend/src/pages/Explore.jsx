import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const Explore = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        category: 'Technology', // default
        duration: 'all'
    });

    const categories = ['Technology', 'Lifestyle', 'Health', 'Travel', 'Education'];
    const durations = [
        { label: 'All Time', value: 'all' },
        { label: 'Last 7 Days', value: 'last 7 days' },
        { label: 'Last 30 Days', value: 'last 30 days' },
        { label: 'Last 1 Year', value: 'last 1 year' }
    ];

    const handleSearch = async (e) => {
        if(e) e.preventDefault();
        setLoading(true);
        try {
            // Encode URI components just in case
            const cat = encodeURIComponent(searchParams.category);
            const dur = encodeURIComponent(searchParams.duration);
            const response = await api.get(`/user/blogs/info/${cat}/${dur}`);
            setBlogs(response.data);
        } catch (error) {
            toast.error('Failed to search blogs');
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    // Load initial data
    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-[#1e293b] mb-4">Explore Articles</h1>
                <p className="text-gray-500 text-lg">Discover amazing stories from our community.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm mb-10 border border-gray-100">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={searchParams.category}
                            onChange={(e) => setSearchParams({...searchParams, category: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#6366f1] bg-white"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <select
                            value={searchParams.duration}
                            onChange={(e) => setSearchParams({...searchParams, duration: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#6366f1] bg-white"
                        >
                            {durations.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-3 rounded font-medium flex items-center shadow-md transition w-full md:w-auto justify-center"
                    >
                        <Search size={20} className="mr-2" /> Search
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Searching...</div>
            ) : blogs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-bold text-[#1e293b] mb-2">No blogs found</h3>
                    <p className="text-gray-500">Try adjusting your search filters to find what you're looking for.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map(blog => (
                        <div key={blog.id} className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full border border-gray-100">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#6366f1] mb-2">{blog.category}</span>
                            <h3 className="text-xl font-bold text-[#1e293b] mb-3 line-clamp-2">{blog.blogname}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow">{blog.article}</p>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-sm text-gray-500">
                                <span>{new Date(blog.timestamp).toLocaleDateString()}</span>
                                <span className="font-medium text-[#1e293b]">{blog.authorName}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Explore;
