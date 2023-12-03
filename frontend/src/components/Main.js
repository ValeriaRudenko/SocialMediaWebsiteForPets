import React from 'react';
import Home from './Home';
import Subscriptions from './Subscriptions';
import Additions from './Additions';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';
import Navigation from './Navigation';
import {PageProvider, usePageContext} from './PageContext'; // Make sure to import PageProvider
import './Main.css';

const Main = () => {
    return (
        <div className="main">
            <PageProvider>
                <Navigation/>
                <div>
                    <div>
                        <Content/>
                    </div>
                </div>
            </PageProvider>
        </div>
    );
};

const Content = () => {
    const {currentPage} = usePageContext();

    return (
        <>
            {currentPage === 'home' && <Home/>}
            {currentPage === 'subscriptions' && <Subscriptions/>}
            {currentPage === 'adds' && <Additions/>}
            {currentPage === 'signUp' && <SignUp/>}
            {currentPage === 'signIn' && <SignIn/>}
            {currentPage === 'profile' && <Profile/>}
        </>
    );
};

export default Main;
