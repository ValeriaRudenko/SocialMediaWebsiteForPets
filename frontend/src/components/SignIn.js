
import React, { useState } from 'react';
import axios from 'axios';
import './SignIn.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/signin', {
                email,
                password,
            });

            console.log('Sign In Successful:', response.data.message);
            // Add logic to redirect the user after successful sign-in, e.g., history.push('/dashboard');
        } catch (error) {
            console.error('Error Signing In:', error.response.data.message);
        }
    };

    return (
        <div className="container">
            <h2>Sign In</h2>
            <form>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button type="button" onClick={handleSignIn}>
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default SignIn;