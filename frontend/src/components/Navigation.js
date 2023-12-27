import React from 'react';
import './Navigation.css';

const axios = require('axios');

const PORT = window.env.PORT
const IP = window.env.IP
const token = sessionStorage.getItem('token');
async function isTokenValid() {
    try {
        const response = await axios.get(`http://${IP}:${PORT}/validate-token`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response);
        return response.status === 200;
    } catch (error) {
        // If the request fails or the token is invalid, return false
        return false;
    }
}

const Navigation = () => {

    const handlePageChange = (page) => {
        window.location.href = `/${page}`;
    };
    return (
        <header>
            <div className="row">
                <div className="col">
                    <img src="../logo.png" className="logo" alt="Logo"  />
                </div>
                <div className="col d-flex justify-content-center">
                    <button onClick={() => handlePageChange('')}>Home</button>
                    {token && isTokenValid ? (
                        <button onClick={() => handlePageChange('subscriptions')}>Subscriptions</button>
                    ) : null}
                    <button onClick={() => handlePageChange('adds')}>Additions</button>
                    <button onClick={() => handlePageChange('search')}>Search</button>

                    {token && isTokenValid ? (
                        <button onClick={() => handlePageChange('newpost')}>New post</button>
                    ) : null}
                </div>
                <div className="col d-flex justify-content-end">


                        {(token && isTokenValid) ? (
                            <button onClick={() => handlePageChange('profile')}>Profile</button>
                        ) : (
                            <div>
                                <button onClick={() => handlePageChange('signUp')}>Sign Up</button>
                                <button onClick={() => handlePageChange('signIn')}>Sign In</button>
                            </div>
                        )}
                    </div>

            </div>
        </header>
    );
};

export default Navigation;
