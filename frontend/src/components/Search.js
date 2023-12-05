import React, { useState, useEffect } from 'react';
import axios from 'axios';
 // import './Search.css';

const Search = () => {
    return (
        <div className="container">
            <h2 className="text-center mt-5">Search Page</h2>

            <div className="row mt-3">
                <div className="col d-flex justify-content-center">
                    <form>
                        <label htmlFor="searchNickname" className="form-label">Search by Nickname:</label>
                        <input type="text" className="form-control" id="searchNickname" placeholder="Enter nickname" />
                        <button type="button" className="button">Search</button>
                    </form>
                </div>
            </div>


            {/* Additional content for search results can be added here */}
        </div>
    );
};

export default Search;