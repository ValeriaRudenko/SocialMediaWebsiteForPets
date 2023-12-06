import React from 'react';
import Home from './components/Home';
import Subscriptions from './components/Subscriptions';
import Additions from './components/Additions';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import {PageProvider, usePageContext} from './components/PageContext'; // Make sure to import PageProvider
import Search from "./components/Search";

const App = () => {
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
        {currentPage === 'search' && <Search/>}
      </>
  );
};

export default App;
