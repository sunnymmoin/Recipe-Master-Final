import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [input, setInput] = useState('');
    const [category, setCategory] = useState('All');

    // This runs when you click the button OR press Enter
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents the page from refreshing
        onSearch(input, category);
    };

    return (
        <div className="bg-white p-5 rounded-4 shadow-lg text-center position-relative overflow-hidden mb-5">
            <div style={{
                position: 'absolute', top: '-20px', left: '-20px', 
                width: '100px', height: '100px', background: '#ff9f43', 
                borderRadius: '50%', opacity: '0.1'
            }}></div>

            <h2 className="mb-4 display-6 fw-bold">What are you craving?</h2>
            
            <div className="row g-2 justify-content-center">
                <div className="col-md-8">
                    {/* WRAPPED IN FORM FOR ENTER KEY SUPPORT */}
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 rounded-start-pill ps-3">
                                <i className="fas fa-search text-muted"></i>
                            </span>
                            <input 
                                type="text" 
                                className="form-control border-start-0 rounded-end-pill py-3"
                                placeholder="Try 'chicken, garlic, lemon'..." 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                // We don't need onKeyPress anymore because <form> handles it!
                            />
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-4 d-flex justify-content-center gap-2 flex-wrap">
                {/* Updated Categories to match our new Backend Groups */}
                {['All', 'Asian', 'European', 'American', 'Mexican'].map(cat => (
                    <button 
                        key={cat}
                        className={`btn px-4 py-2 rounded-pill ${category === cat ? 'btn-dark' : 'btn-outline-secondary'}`}
                        onClick={() => setCategory(cat)} // React updates state...
                        style={{borderWidth: '2px'}}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            
            <div className="mt-4">
                 <button className="btn btn-primary px-5 py-3 shadow" onClick={handleSubmit}>
                    Find Recipes <i className="fas fa-arrow-right ms-2"></i>
                </button>
            </div>
        </div>
    );
};
export default SearchBar;