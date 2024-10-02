import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Search from './components/Search';
import BlogPostList from './components/BlogPostList'; // Placeholder for the list component
import BlogPostDetail from './components/BlogPostDetail'; // Placeholder for the detail component
import UserRegistration from './components/UserRegistration'; // Add the UserRegistration component
import UserLogin from './components/UserLogin'; // Add the UserLogin component

const App = () => {
    return (
        <Router>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<BlogPostList />} />
                    <Route path="/post/:id" element={<BlogPostDetail />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/signup" element={<UserRegistration />} /> {/* Added signup route */}
                    <Route path="/login" element={<UserLogin />} /> {/* Added signup route */}
                </Routes>
            </main>
            <Footer />
        </Router>
    );
};

export default App;
