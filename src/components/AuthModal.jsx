import React, { useState } from 'react';
import axios from 'axios';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
        
        try {
            const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
            
            if (isLogin) {
                // Pass token and favorites back to App.jsx
                onLoginSuccess(res.data);
                onClose();
            } else {
                alert("Account created! Please log in.");
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <div className="modal-overlay" style={{zIndex: 3000}}>
            <div className="modal-content-custom bg-white p-5 text-center" style={{maxWidth: '400px'}}>
                <h2 className="fw-bold mb-4">{isLogin ? 'Welcome Back!' : 'Join ChefMaster'}</h2>
                
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input 
                            type="text" 
                            className="form-control p-3" 
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input 
                            type="password" 
                            className="form-control p-3" 
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>
                    <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow">
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-4 text-muted">
                    {isLogin ? "New here?" : "Already have an account?"} 
                    <button className="btn btn-link fw-bold" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Create Account" : "Log In"}
                    </button>
                </p>
                <button className="btn btn-sm btn-light mt-2" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AuthModal;