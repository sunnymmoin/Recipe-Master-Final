import React, { useState, useEffect } from 'react';

// Portion Helper
const formatIngredient = (ingredient, multiplier) => {
    return ingredient.replace(/(\d+(\.\d+)?|\d+\/\d+)/g, (match) => {
        const number = parseFloat(match);
        if (!isNaN(number)) return Math.round(number * multiplier * 10) / 10;
        return match;
    });
};

const RecipeCard = ({ recipe, allRecipes, favorites, toggleFavorite, shoppingList, toggleShoppingItem }) => {
    const [showModal, setShowModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [multiplier, setMultiplier] = useState(1);
    
    // NEW STATE: Allows us to switch recipes inside the modal!
    const [activeRecipe, setActiveRecipe] = useState(recipe);

    // Sync state: When the modal opens/closes, reset to the original recipe
    useEffect(() => {
        if (!showModal) {
            setActiveRecipe(recipe);
            setMultiplier(1);
            setShowSuccess(false);
        }
    }, [showModal, recipe]);

    const handleClose = () => {
        setShowModal(false);
    };

    // Calculate if the CURRENTLY shown recipe is a favorite
    // (We use 'favorites' list directly to support related recipes switching)
    const isActiveFavorite = favorites && favorites.some(fav => fav.id === activeRecipe.id);

    // LOGIC: Find Related Recipes based on the ACTIVE recipe
    const relatedRecipes = allRecipes
        .filter(r => r.category === activeRecipe.category && r.id !== activeRecipe.id)
        .slice(0, 3);

    return (
        <>
            {/* --- CARD VIEW (Always shows the original 'recipe' prop) --- */}
            <div className="custom-card h-100 fade-in-up">
                <div className="card-img-wrapper">
                    <img src={recipe.image} className="card-img-top" alt={recipe.name} />
                </div>
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title fw-bold mb-3">{recipe.name}</h5>
                        <button 
                            className="btn btn-light rounded-circle shadow-sm"
                            onClick={() => toggleFavorite(recipe)}
                            style={{ color: favorites.some(f => f.id === recipe.id) ? '#ff6b6b' : '#ccc' }}
                        >
                            <i className={`fa-${favorites.some(f => f.id === recipe.id) ? 'solid' : 'regular'} fa-heart`}></i>
                        </button>
                    </div>
                    
                    <span className="badge bg-light text-dark border px-3 py-2 rounded-pill mb-3">
                        <i className="fas fa-utensils me-2 text-warning"></i>{recipe.category}
                    </span>

                    <button className="btn btn-warning w-100 shadow-sm mt-3" onClick={() => setShowModal(true)}>
                        Start Cooking Mode 👨‍🍳
                    </button>
                </div>
            </div>

            {/* --- MODAL VIEW (Uses 'activeRecipe' so it can switch!) --- */}
            {showModal && (
                <div className="modal-overlay" onClick={handleClose}>
                    <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
                        
                        {!showSuccess ? (
                            <>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h3 className="fw-bold mb-0" style={{ fontFamily: 'Playfair Display' }}>
                                        {activeRecipe.name}
                                    </h3>
                                    
                                    <div className='d-flex align-items-center gap-3'>
                                         {/* Favorite Button inside Modal */}
                                        <button 
                                            className="btn btn-light rounded-circle shadow-sm border"
                                            onClick={() => toggleFavorite(activeRecipe)}
                                            style={{ color: isActiveFavorite ? '#ff6b6b' : '#ccc' }}
                                        >
                                            <i className={`fa-${isActiveFavorite ? 'solid' : 'regular'} fa-heart`}></i>
                                        </button>
                                        <i className="fas fa-times close-btn position-static" onClick={handleClose}></i>
                                    </div>
                                </div>

                                <img src={activeRecipe.image} className="img-fluid rounded-3 mb-4 w-100" style={{ height: '200px', objectFit: 'cover' }} />

                                {/* --- INGREDIENTS --- */}
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="fw-bold text-dark m-0"><i className="fas fa-carrot me-2 text-warning"></i>Ingredients</h5>
                                    <div className="btn-group btn-group-sm">
                                        {[1, 2, 4].map(num => (
                                            <button key={num} className={`btn ${multiplier === num ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setMultiplier(num)}>{num}x</button>
                                        ))}
                                    </div>
                                </div>
                                <small className="text-muted d-block mb-3">Add to Shopping List:</small>

                                <ul className="mb-4 text-muted small row list-unstyled">
                                    {activeRecipe.ingredients.map((ing, i) => {
                                        const formattedIng = formatIngredient(ing, multiplier);
                                        const isInCart = shoppingList.includes(formattedIng);
                                        return (
                                            <li key={i} className="col-md-6 mb-2 d-flex align-items-center">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input me-2" 
                                                    checked={isInCart}
                                                    onChange={() => toggleShoppingItem(formattedIng)}
                                                    style={{cursor: 'pointer'}}
                                                />
                                                <span style={{ textDecoration: isInCart ? 'line-through' : 'none' }}>
                                                    {formattedIng}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* --- INSTRUCTIONS --- */}
                                <h5 className="fw-bold text-dark mb-3"><i className="fas fa-list-ol me-2 text-warning"></i>Instructions</h5>
                                <div className="bg-light p-3 rounded-3 border-start border-4 border-warning mb-4">
                                    <ol className="mb-0 text-secondary" style={{ lineHeight: '1.8' }}>
                                        {activeRecipe.steps.map((step, index) => <li key={index} className="mb-2">{step}</li>)}
                                    </ol>
                                </div>

                                <div className="text-center mb-5">
                                    <button className="btn btn-success px-5 py-2 rounded-pill shadow" onClick={() => setShowSuccess(true)}>
                                        I Finished Cooking! <i className="fas fa-check ms-2"></i>
                                    </button>
                                </div>

                                {/* --- RELATED RECIPES (CLICKABLE NOW!) --- */}
                                {relatedRecipes.length > 0 && (
                                    <div className="border-top pt-4 mt-4 bg-white">
                                        <h5 className="fw-bold mb-3">You might also like:</h5>
                                        <div className="row g-2">
                                            {relatedRecipes.map(rel => (
                                                <div className="col-4" key={rel.id}>
                                                    {/* THIS IS THE CLICKABLE CARD */}
                                                    <div 
                                                        className="card h-100 border-0 shadow-sm" 
                                                        style={{cursor: 'pointer', transition: 'transform 0.2s'}}
                                                        onClick={() => {
                                                            setActiveRecipe(rel); // 👈 Switch to new recipe
                                                            setMultiplier(1);     // Reset portions
                                                            // Scroll modal to top
                                                            document.querySelector('.modal-content-custom').scrollTop = 0;
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                    >
                                                        <img src={rel.image} className="card-img-top rounded-top" alt={rel.name} style={{height: '80px', objectFit: 'cover'}} />
                                                        <div className="card-body p-2 text-center">
                                                            <small className="fw-bold d-block text-truncate">{rel.name}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-5 fade-in-animation">
                                <div className="mb-4 text-success"><i className="fas fa-check-circle fa-5x shadow-sm rounded-circle"></i></div>
                                <h2 className="display-5 fw-bold mb-3" style={{fontFamily: 'Playfair Display'}}>Bon Appétit!</h2>
                                <p className="text-muted lead mb-5">Great job chef! We hope you enjoy your <strong>{activeRecipe.name}</strong>.</p>
                                <button className="btn btn-dark px-5 py-3 rounded-pill" onClick={handleClose}>Close</button>
                                <button className="btn btn-success px-5 py-3 rounded-pill mt-3 ms-2" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`I just cooked ${activeRecipe.name}!`)}`, '_blank')}>
                                    <i className="fab fa-whatsapp me-2"></i> Share
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default RecipeCard;