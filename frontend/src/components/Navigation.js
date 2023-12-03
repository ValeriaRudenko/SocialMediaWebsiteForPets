import React from 'react';
import { usePageContext } from './PageContext';
import './Navigation.css';
const Navigation = () => {
    const { handlePageChange } = usePageContext();
    return (
        <header>
            <div className="row">
                <div className="col">
                    <img src="../logo.jpg" className="logo" alt="Logo"  />
                </div>
                <div className="col d-flex justify-content-center">
                    <button onClick={() => handlePageChange('home')}>Home</button>
                    <button onClick={() => handlePageChange('subscriptions')}>Subscriptions</button>
                    <button onClick={() => handlePageChange('adds')}>Additions</button>
                    <button onClick={() => handlePageChange('search')}>Search</button>
                </div>
                <div className="col d-flex justify-content-end">
                    <button onClick={() => handlePageChange('profile')}>Profile</button>
                    <button onClick={() => handlePageChange('signUp')}>Sign Up</button>
                    <button onClick={() => handlePageChange('signIn')}>Sign In</button>
                </div>
            </div>
        </header>
    );
};

export default Navigation;
