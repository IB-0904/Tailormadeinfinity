import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBlogs from './pages/MyBlogs';
import Explore from './pages/Explore';
import CreateBlog from './pages/CreateBlog';

function App() {
  const isAuthenticated = () => {
    return !!localStorage.getItem('user');
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#f4f7fe]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-blogs" element={<PrivateRoute><MyBlogs /></PrivateRoute>} />
            <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
            <Route path="/create-blog" element={<PrivateRoute><CreateBlog /></PrivateRoute>} />
          </Routes>
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
