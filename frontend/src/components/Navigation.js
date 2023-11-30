import React, { useState } from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';

const Navigation = () => {
    const [currentPage, setCurrentPage] = useState('signUp');

    return (
        <div>
            <button onClick={() => setCurrentPage('signUp')}>Sign Up</button>
            <button onClick={() => setCurrentPage('signIn')}>Sign In</button>

            {currentPage === 'signUp' && <SignUp />}
            {currentPage === 'signIn' && <SignIn />}
        </div>
    );
};

export default Navigation;
