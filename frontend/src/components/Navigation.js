import React, { useState } from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';

const Navigation = () => {
    const [currentPage, setCurrentPage] = useState('signUp');

    return (
        <div>
            <button onClick={() => setCurrentPage('signUp')}>Sign Up</button>
            <button onClick={() => setCurrentPage('signIn')}>Sign In</button>
            <button onClick={() => setCurrentPage('profile')}>Profile</button>

            {currentPage === 'signUp' && <SignUp />}
            {currentPage === 'signIn' && <SignIn />}
            {currentPage === 'profile' && <Profile />}
        </div>
    );
};

export default Navigation;
