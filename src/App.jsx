import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from './components/RecipeCard';
import SearchBar from './components/SearchBar';
import FeedbackForm from './components/FeedbackForm';
import FavoritesSidebar from './components/FavoritesSidebar';
import ShoppingListSidebar from './components/ShoppingListSidebar';
import AuthModal from './components/AuthModal';
import UserSidebar from './components/UserSidebar'; // 1. Import New Sidebar

function App() {
    // --- STATE ---
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [shoppingList, setShoppingList] = useState([]);
    const [isLateNight, setIsLateNight] = useState(false);
    
    // Auth State
    const [user, setUser] = useState(null); 
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Sidebar States
    const [showFavSidebar, setShowFavSidebar] = useState(false);
    const [showShopSidebar, setShowShopSidebar] = useState(false);
    const [showUserSidebar, setShowUserSidebar] = useState(false); // 2. New Sidebar State

    // --- INITIAL LOAD ---
    useEffect(() => {
        fetchRecipes();
        if (token) {
            // Restore session (Simulated for now, normally you fetch profile from API)
            const savedUser = localStorage.getItem('username');
            setUser({ username: savedUser || "Chef" }); 
        }
    }, []);

    // --- SYNC FAVORITES TO DB ---
    useEffect(() => {
        if (token && favorites.length > 0) {
            axios.post('http://localhost:5000/api/user/favorites', { favorites }, {
                headers: { 'x-auth-token': token }
            }).catch(err => console.error("Sync Error", err));
        }
    }, [favorites, token]);

    const fetchRecipes = async (ingredient = '', category = 'All') => {
        try {
            const res = await axios.get('http://localhost:5000/api/search', {
                params: { ingredient, category }
            });
            setRecipes(res.data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    };

    // --- ACTIONS ---
    const handleLoginSuccess = (data) => {
        setToken(data.token);
        setUser({ username: data.username });
        setFavorites(data.favorites); 
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username); // Save name for reload
    };

    const handleLogout = () => {
        setToken(null);
        setUser(null);
        setFavorites([]);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        alert("Logged out successfully!");
    };

    // Toggle Theme
    const toggleTheme = () => {
        const newMode = !isLateNight;
        setIsLateNight(newMode);
        if (newMode) document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
    };

    const toggleFavorite = (recipe) => {
        if (!token) { setShowAuthModal(true); return; }
        if (favorites.some(fav => fav.id === recipe.id)) {
            setFavorites(favorites.filter(fav => fav.id !== recipe.id));
        } else {
            setFavorites([...favorites, recipe]);
        }
    };

    const toggleShoppingItem = (item) => {
        if (shoppingList.includes(item)) {
            setShoppingList(shoppingList.filter(i => i !== item));
        } else {
            setShoppingList([...shoppingList, item]);
        }
    };

    const displayedRecipes = isLateNight 
        ? recipes.filter(r => r.ingredients.length < 8 || ['Dessert', 'Starter', 'Breakfast', 'Miscellaneous', 'American', 'Italian'].includes(r.category))
        : recipes;

    return (
        <div>
            {/* MODALS & SIDEBARS */}
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLoginSuccess={handleLoginSuccess} />
            
            <FavoritesSidebar isOpen={showFavSidebar} onClose={() => setShowFavSidebar(false)} favorites={favorites} removeFavorite={toggleFavorite} />
            <ShoppingListSidebar isOpen={showShopSidebar} onClose={() => setShowShopSidebar(false)} shoppingList={shoppingList} removeFromList={toggleShoppingItem} />
            
            {/* 3. Add The User Sidebar */}
            <UserSidebar 
                isOpen={showUserSidebar} 
                onClose={() => setShowUserSidebar(false)} 
                user={user} 
                onLogout={handleLogout} 
                favoritesCount={favorites.length}
            />

            {/* HEADER */}
            <div className={`shadow-sm py-3 mb-5 sticky-top ${isLateNight ? 'bg-dark border-bottom border-secondary' : 'bg-white'}`} style={{zIndex: 1020, transition: 'all 0.3s'}}>
                <div className="container d-flex justify-content-between align-items-center">
                    
                    {/* LOGO */}
                    <h1 className="h4 fw-bold m-0" style={{color: isLateNight ? '#bb86fc' : '#ff6b6b', transition: 'color 0.5s'}}>
                        <i className={`fas ${isLateNight ? 'fa-moon' : 'fa-sun'} me-2`}></i>
                        {isLateNight ? 'MidnightCravings' : 'ChefMaster'}
                    </h1>
                    
                    <div className="d-flex gap-3 align-items-center">
                         
                        {/* AESTHETIC THEME TOGGLE (Icon Only) */}
                        <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Night Mode">
                            <i className={`fas ${isLateNight ? 'fa-cloud-moon' : 'fa-sun'}`}></i>
                        </button>

                         {/* Shopping List */}
                         <button className={`btn position-relative rounded-circle p-0`} 
                                 style={{width: '45px', height: '45px', border: '2px solid ' + (isLateNight ? '#666' : '#eee')}} 
                                 onClick={() => setShowShopSidebar(true)}>
                            <i className={`fas fa-shopping-basket ${isLateNight ? 'text-white' : 'text-success'}`}></i>
                            {shoppingList.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">{shoppingList.length}</span>}
                         </button>

                         {/* Favorites */}
                         <button className={`btn position-relative rounded-circle p-0`} 
                                 style={{width: '45px', height: '45px', border: '2px solid ' + (isLateNight ? '#666' : '#eee')}}
                                 onClick={() => token ? setShowFavSidebar(true) : setShowAuthModal(true)}>
                            <i className={`fas fa-heart ${isLateNight ? 'text-white' : 'text-danger'}`}></i>
                            {favorites.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{favorites.length}</span>}
                         </button>

                         {/* VERTICAL DIVIDER */}
                         <div style={{width: '1px', height: '30px', background: '#ccc'}}></div>

                         {/* USER PROFILE SECTION */}
                         {!token ? (
                             <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={() => setShowAuthModal(true)}>Log In</button>
                         ) : (
                             // 4. Aesthetic User Avatar Button
                             <button className="user-avatar-btn shadow-sm" onClick={() => setShowUserSidebar(true)}>
                                {user?.username?.charAt(0).toUpperCase()}
                             </button>
                         )}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="container" style={{ minHeight: '80vh' }}>
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {!isLateNight && <SearchBar onSearch={fetchRecipes} />}
                        
                        <div className="d-flex align-items-center mb-4 mt-5">
                            <div className="flex-grow-1 h-divider bg-light" style={{height: '2px'}}></div>
                            <span className="px-3 text-muted fw-bold text-uppercase small">
                                {isLateNight ? '🌙 Quick & Comfort Recipes' : `${displayedRecipes.length} Delicious Results`}
                            </span>
                            <div className="flex-grow-1 h-divider bg-light" style={{height: '2px'}}></div>
                        </div>

                        <div className="row g-4">
                            {displayedRecipes.map(recipe => (
                                <div className="col-md-6 col-lg-4" key={recipe.id}>
                                    <RecipeCard 
                                        recipe={recipe} 
                                        allRecipes={recipes} 
                                        favorites={favorites}
                                        toggleFavorite={toggleFavorite}
                                        shoppingList={shoppingList}
                                        toggleShoppingItem={toggleShoppingItem}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 mb-5"><FeedbackForm /></div>
                    </div>
                </div>
            </div>
            
            <footer className="text-center py-4 text-muted small mt-5 border-top bg-white">
                © 2026 ChefMaster Inc. {isLateNight && <span className="text-warning">Keep cooking, night owl! 🦉</span>}
            </footer>
        </div>
    );
}

export default App;