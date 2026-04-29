import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';

const CreateBlog = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [formData, setFormData] = useState({
        blogname: '',
        category: '',
        article: '',
        authorName: user?.username || ''
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/user/blogs/add', formData);
            toast.success('Blog created successfully!');
            navigate('/my-blogs');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create blog');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 my-8 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-3xl font-bold text-[#1e293b] mb-6">Create New Blog</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-[#1e293b] mb-1">Blog Title</label>
                    <input
                        type="text"
                        name="blogname"
                        required
                        value={formData.blogname}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                        placeholder="Enter an engaging title..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#1e293b] mb-1">Category</label>
                    <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#6366f1] bg-white"
                    >
                        <option value="" disabled>Select a category</option>
                        <option value="Technology">Technology</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Health">Health</option>
                        <option value="Travel">Travel</option>
                        <option value="Education">Education</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#1e293b] mb-1">Article Content</label>
                    <textarea
                        name="article"
                        required
                        rows="8"
                        value={formData.article}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                        placeholder="Write your article here..."
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#1e293b] mb-1">Author Name</label>
                    <input
                        type="text"
                        name="authorName"
                        required
                        value={formData.authorName}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                    />
                </div>
                <div className="pt-4 flex space-x-4">
                    <button
                        type="submit"
                        className="bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold py-3 px-8 rounded transition shadow-md"
                    >
                        Publish Blog
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/my-blogs')}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBlog;
