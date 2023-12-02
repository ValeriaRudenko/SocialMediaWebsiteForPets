import React, {useState} from 'react';
import Home from './Home';
import Subscriptions from './Subscriptions';
import Additions from './Additions';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';
// import './Navigation.css';

const Navigation = () => {
    const [currentPage, setCurrentPage] = useState('signUp');

    return (
        <body>
        <div className="wrapper">
        <header>
            <div className="row">
            <div className="col"></div> {/*Empty column*/}
            <div className="col d-flex justify-content-center">
                <button onClick={() => setCurrentPage('home')}>Home</button>
                <button onClick={() => setCurrentPage('subscriptions')}>Subscriptions</button>
                <button onClick={() => setCurrentPage('adds')}>Additions</button>
            </div>
                <div className="col d-flex justify-content-end">
                    <button onClick={() => setCurrentPage('profile')}>Profile</button>
                    <button onClick={() => setCurrentPage('signUp')}>Sign Up</button>
                    <button onClick={() => setCurrentPage('signIn')}>Sign In</button>
                </div>
            </div>
        </header>
        </div>
        <div>
            {currentPage === 'home' && <Home/>}
            {currentPage === 'subscriptions' && <Subscriptions/>}
            {currentPage === 'adds' && <Additions/>}
            {currentPage === 'signUp' && <SignUp/>}
            {currentPage === 'signIn' && <SignIn/>}
            {currentPage === 'profile' && <Profile/>}
        </div>
        </body>
    )

};

export default Navigation;
