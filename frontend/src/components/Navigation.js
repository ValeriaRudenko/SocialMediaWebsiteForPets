import React, { useState } from 'react';
import Home from './Home';
import Subscriptions from './Subscriptions';
import Additions from './Additions';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';

const Navigation = () => {
    const [currentPage, setCurrentPage] = useState('signUp');

    return (
        <div>
            <button onClick={() => setCurrentPage('home')}>Home</button>
            <button onClick={() => setCurrentPage('subscriptions')}>Subscriptions</button>
            <button onClick={() => setCurrentPage('adds')}>Additions</button>

            <button onClick={() => setCurrentPage('profile')}>Profile</button>
            <button onClick={() => setCurrentPage('signUp')}>Sign Up</button>
            <button onClick={() => setCurrentPage('signIn')}>Sign In</button>


            {currentPage === 'home' && <Home />}
            {currentPage === 'subscriptions' && <Subscriptions />}
            {currentPage === 'adds' && <Additions />}
            {currentPage === 'signUp' && <SignUp />}
            {currentPage === 'signIn' && <SignIn />}
            {currentPage === 'profile' && <Profile />}
        </div>
    );
};

export default Navigation;