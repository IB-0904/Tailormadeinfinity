import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Trash2 } from 'lucide-react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const MyBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyBlogs = async () => {
        try {
            const response = await api.get('/user/blogs/myblogs');
            setBlogs(response.data);
        } catch (error) {
            toast.error('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyBlogs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await api.delete(`/user/blogs/delete/${id}`);
                toast.success('Blog deleted successfully');
                fetchMyBlogs();
            } catch (error) {
                toast.error('Failed to delete blog');
            }
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-[#1e293b] mb-1">My Blogs</h1>
                    <p className="text-gray-500">Manage and view all your published articles</p>
                </div>
                <Link to="/create-blog" className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-5 py-2.5 rounded-md font-medium flex items-center shadow-md transition">
                    <span className="mr-2">+</span> Create New Blog
                </Link>
            </div>

            {blogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <FileText size={80} className="text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-[#1e293b] mb-2">No Blogs Yet</h2>
                    <p className="text-gray-500 mb-6">Start sharing your thoughts and ideas with the world!</p>
                    <Link to="/create-blog" className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-2.5 rounded-md font-medium transition shadow-sm">
                        Create Your First Blog
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map(blog => (
                        <div key={blog.id} className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full border border-gray-100 relative">
                            <button
                                onClick={() => handleDelete(blog.id)}
                                className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition"
                                title="Delete Blog"
                            >
                                <Trash2 size={20} />
                            </button>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#6366f1] mb-2">{blog.category}</span>
                            <h3 className="text-xl font-bold text-[#1e293b] mb-3 line-clamp-2 pr-6">{blog.blogname}</h3>
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

export default MyBlogs;
