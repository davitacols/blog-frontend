import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import Header from './components/Header'; // Header component
import Footer from './components/Footer'; // Footer component
import Search from './components/Search'; // Search component
import BlogPostList from './components/BlogPostList'; // List component
import BlogPostDetail from './components/BlogPostDetail'; // Detail component
import UserRegistration from './components/UserRegistration'; // User registration component
import UserLogin from './components/UserLogin'; // User login component
import NotFound from './components/NotFound'; // 404 component
import UserProfile from './components/UserProfile'; // User profile component
import CreateBlogPost from './components/CreateBlogPost'; // Create blog post component
import EmailConfirmation from './components/EmailConfirmation'; // Email confirmation component

const App = () => {
    const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual Google Client ID

    return (
        <GoogleOAuthProvider clientId={clientId}> {/* Wrap the Router with GoogleOAuthProvider */}
            <Router>
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<BlogPostList />} />
                        <Route path="/post/:id" element={<BlogPostDetail />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/create-post" element={<CreateBlogPost />} />
                        <Route path="/email-confirmation/:token" element={<EmailConfirmation />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/signup" element={<UserRegistration />} /> {/* User signup route */}
                        <Route path="/login" element={<UserLogin />} /> {/* User login route */}
                        <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
                    </Routes>
                </main>
                <Footer />
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;
