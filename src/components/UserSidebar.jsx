import React from 'react';

const UserSidebar = ({ isOpen, onClose, user, onLogout, favoritesCount }) => {
    return (
        <div 
            className={`offcanvas offcanvas-end ${isOpen ? 'show' : ''}`} 
            style={{ visibility: isOpen ? 'visible' : 'hidden', zIndex: 2060 }}
        >
            {/* Header with Gradient Background */}
            <div className={`offcanvas-header text-white ${document.body.classList.contains('dark-mode') ? 'bg-dark' : 'bg-primary'}`} 
                 style={{ background: document.body.classList.contains('dark-mode') ? '#1e1e1e' : 'linear-gradient(135deg, #ff6b6b, #ff8e53)' }}>
                
                <h5 className="offcanvas-title fw-bold">
                    <i className="fas fa-user-circle me-2"></i>Chef Profile
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            
            <div className="offcanvas-body d-flex flex-column justify-content-between">
                <div>
                    <div className="text-center py-4">
                        <div className="mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold text-white shadow" 
                             style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ccc', fontSize: '2rem' }}>
                             {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <h4 className="fw-bold mb-1">Hello, {user?.username}!</h4>
                        <p className="text-muted small">Master Chef in Training 👨‍🍳</p>
                    </div>

                    <div className="card border-0 shadow-sm mb-3">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="mb-0 fw-bold text-danger"><i className="fas fa-heart me-2"></i>Favorites</h6>
                                <small className="text-muted">Recipes saved</small>
                            </div>
                            <span className="h4 fw-bold mb-0">{favoritesCount}</span>
                        </div>
                    </div>

                    <div className="alert alert-light border text-center small text-muted">
                        "Cooking is like love. It should be entered into with abandon or not at all."
                    </div>
                </div>

                <button 
                    className="btn btn-outline-danger w-100 py-2 rounded-pill fw-bold"
                    onClick={() => {
                        onLogout();
                        onClose();
                    }}
                >
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                </button>
            </div>
        </div>
    );
};

export default UserSidebar;