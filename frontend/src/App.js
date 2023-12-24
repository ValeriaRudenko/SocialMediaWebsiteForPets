import React from 'react';
import Home from './components/Home';
import Subscriptions from './components/Subscriptions';
import Additions from './components/Additions';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import NewPost from './components/Newpost';
import Search from "./components/Search";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import UserProfile from "./components/UserProfile";
import AddAddition from "./components/NewAddition";

const App = () => {
    return (
        <div className="main">
            <Navigation/>
            <div>
                <Content/>
            </div>
        </div>
    );
};

const Content = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/subscriptions" element={<Subscriptions/>}/>
                    <Route path="/adds" element={<Additions/>}/>
                    <Route path="/signUp" element={<SignUp/>}/>
                    <Route path="/signIn" element={<SignIn/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/search" element={<Search/>}/>
                    <Route path="/newpost" element={<NewPost/>}/>
                    <Route path="/addaddition" element={<AddAddition/>}/>
                    <Route path="/user/:id" element={<UserProfile/>}/>
                </Routes>
            </Router>
        </>
    );
};

export default App;
