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
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserProfile from "./components/UserProfile";

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
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/adds" element={<Additions />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/signIn" element={<SignIn />} />
               <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<Search />} />

              <Route path="/user/:id" currentPage={<UserProfile />} />
          </Routes>
      </Router>

          </>
      // <>
      //     <Router>
      //         <Routes>
      //     <Route path="/user" currentPage = 'userProfile' />
      //         </Routes>
      //     </Router>
      //   {currentPage === 'home' && <Home/>}
      //   {currentPage === 'subscriptions' && <Subscriptions/>}
      //   {currentPage === 'adds' && <Additions/>}
      //   {currentPage === 'signUp' && <SignUp/>}
      //   {currentPage === 'signIn' && <SignIn/>}
      //   {currentPage === 'profile' && <Profile/>}
      //   {currentPage === 'search' && <Search/>}
      //     {currentPage === 'userProfile' && <UserProfile/>}
      // </>
  );
};

export default App;
