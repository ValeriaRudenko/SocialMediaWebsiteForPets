// frontend/src/components/SignUp.js

import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css'; // Import the CSS file


const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/signup', {
                username,
                email,
                password,
            });

            console.log('Sign Up Successful:', response.data.message);
            // Add logic to redirect the user after successful sign-up, e.g., history.push('/dashboard');
        } catch (error) {
            console.error('Error Signing Up:', error.response.data.message);
        }
    };

    return (
        <div className="container">
            <h2>Sign Up</h2>
            <form>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button type="button" onClick={handleSignUp}>
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUp;
