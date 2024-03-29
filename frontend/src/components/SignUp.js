// frontend/src/components/SignUp.js

import React, {useState} from 'react';
import axios from 'axios';
const PORT = window.env.BACKENDPORT
const IP = window.env.IP
const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupMessage, setSignupMessage] = useState('');

    const handleSignUp = async () => {
        try {
            const response = await axios.post(`http://${IP}:${PORT}/api/signup`, {
                username,
                email,
                password,
            });
            // Store the token in session storage
            sessionStorage.setItem('token', response.data.token);
            console.log('Sign Up Successful:', response.data.message);
            setSignupMessage(response.data.message);
            window.location.reload();

        } catch (error) {
            console.error('Error Signing Up:', error.response.data.message);
            setSignupMessage(error.response.data.message);
        }
    };

    return (
        <div className="row">
            <div className="col"></div>
            {/*Empty column*/}
            <div className="col d-flex justify-content-center">
                <div className="container">
                    <h2>Sign Up</h2>
                    <form>
                        <label>
                            <p>Username:</p>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </label>
                        <label>
                            <p>Email:</p>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </label>
                        <label>
                            <p>Password:</p>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </label>
                        <button className="button_in_cont" type="button" onClick={handleSignUp}>
                            Sign Up
                        </button>
                    </form>
                    {signupMessage && <p>{signupMessage}</p>}
                </div>
            </div>
            <div className="col"></div>
            {/*Empty column*/}
        </div>
    );
};

export default SignUp;
