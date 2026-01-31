import React from 'react';

const ShoppingListSidebar = ({ isOpen, onClose, shoppingList, removeFromList }) => {
    return (
        <div 
            className={`offcanvas offcanvas-end ${isOpen ? 'show' : ''}`} 
            style={{ visibility: isOpen ? 'visible' : 'hidden', zIndex: 2055 }}
        >
            <div className="offcanvas-header bg-success text-white">
                <h5 className="offcanvas-title fw-bold">
                    <i className="fas fa-shopping-basket me-2"></i>Groceries
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            
            <div className="offcanvas-body bg-light">
                {shoppingList.length === 0 ? (
                    <div className="text-center mt-5 text-muted opacity-50">
                        <i className="fas fa-carrot fa-4x mb-3"></i>
                        <p>Your basket is empty.<br/>Add ingredients from recipes!</p>
                    </div>
                ) : (
                    <ul className="list-group shadow-sm">
                        {shoppingList.map((item, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{item}</span>
                                <button 
                                    className="btn btn-sm text-danger"
                                    onClick={() => removeFromList(item)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ShoppingListSidebar;