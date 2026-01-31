import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(null); // 'success' or 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send data to our new backend endpoint
            await axios.post('http://localhost:5000/api/feedback', formData);
            
            setStatus('success');
            setFormData({ name: '', email: '', message: '' }); // Clear form
            
            // Remove success message after 3 seconds
            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            console.error("Feedback error:", error);
            setStatus('error');
        }
    };

    return (
        <div className="card border-0 shadow-sm p-4 bg-light">
            <h4 className="fw-bold mb-3"><i className="fas fa-comment-dots me-2 text-warning"></i>We value your feedback!</h4>
            
            {status === 'success' && (
                <div className="alert alert-success rounded-pill text-center">
                    <i className="fas fa-check-circle me-2"></i>Message sent successfully!
                </div>
            )}
            
            {status === 'error' && (
                <div className="alert alert-danger rounded-pill text-center">
                    <i className="fas fa-exclamation-circle me-2"></i>Oops! Something went wrong.
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row g-2 mb-3">
                    <div className="col-md-6">
                        <input 
                            type="text" 
                            className="form-control rounded-pill px-3" 
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <input 
                            type="email" 
                            className="form-control rounded-pill px-3" 
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <textarea 
                        className="form-control rounded-3 px-3 py-2" 
                        rows="3" 
                        placeholder="What do you think about ChefMaster?"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                    ></textarea>
                </div>
                <button className="btn btn-dark rounded-pill px-4 fw-bold">
                    Send Message <i className="fas fa-paper-plane ms-2"></i>
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;