import React from 'react';

const FavoritesSidebar = ({ isOpen, onClose, favorites, removeFavorite }) => {
    return (
        <div 
            className={`offcanvas offcanvas-end ${isOpen ? 'show' : ''}`} 
            style={{ visibility: isOpen ? 'visible' : 'hidden' }}
            tabIndex="-1"
        >
            <div className="offcanvas-header bg-warning">
                <h5 className="offcanvas-title fw-bold text-white">
                    <i className="fas fa-heart me-2"></i>Saved Recipes ({favorites.length})
                </h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            
            <div className="offcanvas-body bg-light">
                {favorites.length === 0 ? (
                    <div className="text-center mt-5 text-muted opacity-50">
                        <i className="far fa-heart fa-4x mb-3"></i>
                        <p>No favorites yet.<br/>Start exploring!</p>
                    </div>
                ) : (
                    <ul className="list-group list-group-flush rounded-3 shadow-sm">
                        {favorites.map(recipe => (
                            <li key={recipe.id} className="list-group-item d-flex align-items-center p-3">
                                <img 
                                    src={recipe.image} 
                                    alt={recipe.name} 
                                    className="rounded-circle me-3 border border-2 border-white shadow-sm"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                                <div className="flex-grow-1">
                                    <h6 className="mb-0 fw-bold">{recipe.name}</h6>
                                    <small className="text-muted">{recipe.category}</small>
                                </div>
                                <button 
                                    className="btn btn-sm btn-outline-danger border-0"
                                    onClick={() => removeFavorite(recipe)}
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FavoritesSidebar;