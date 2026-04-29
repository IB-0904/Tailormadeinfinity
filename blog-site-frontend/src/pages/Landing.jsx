import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="flex flex-col min-h-[calc(100vh-70px)]">
            <div className="flex-grow flex flex-col items-center pt-24 px-4">
                <h1 className="text-5xl font-bold text-[#1e293b] mb-4">Welcome to BlogSite</h1>
                <p className="text-gray-500 mb-8 text-lg">Your place to read, write, and share amazing stories with the world.</p>

                <Link to="/explore" className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-8 py-3 rounded text-lg font-medium shadow-md transition mb-20">
                    Explore Articles
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                        <h3 className="font-bold text-[#1e293b] text-xl mb-3">Write Your Stories</h3>
                        <p className="text-gray-500">Create and publish your own blogs easily.</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                        <h3 className="font-bold text-[#1e293b] text-xl mb-3">Discover New Ideas</h3>
                        <p className="text-gray-500">Read articles from writers across the world.</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                        <h3 className="font-bold text-[#1e293b] text-xl mb-3">Join Our Community</h3>
                        <p className="text-gray-500">Engage and connect with readers and creators.</p>
                    </div>
                </div>
            </div>

            <footer className="bg-[#1e293b] text-gray-300 py-4 text-center mt-auto">
                <p>&copy; 2025 BlogSite — Crafted for creators and storytellers.</p>
            </footer>
        </div>
    );
};

export default Landing;
