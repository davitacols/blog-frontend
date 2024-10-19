import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import Footer from './components/Footer';
import Search from './components/Search';
import BlogPostList from './components/BlogPostList';
import BlogPostDetail from './components/BlogPostDetail';
import UserRegistration from './components/UserRegistration';
import UserLogin from './components/UserLogin';
import NotFound from './components/NotFound';
import UserProfile from './components/UserProfile';
import CreateBlogPost from './components/CreateBlogPost';
import EmailConfirmation from './components/EmailConfirmation';
import LinkedInLoginButton from './components/LinkedInLoginButton';

const App = () => {
    const googleClientId = '793694365694-n2ko02u65qfu4vo9ta3ghoumn58vm91t.apps.googleusercontent.com'; // Replace with your actual Google Client ID

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <Router>
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<BlogPostList />} />
                        <Route path="/posts/:slug" element={<BlogPostDetail />} />
                        <Route path="/profile/:username" element={<UserProfile />} />
                        <Route path="/create-post" element={<CreateBlogPost />} />
                        <Route path="/email-confirmation/:token" element={<EmailConfirmation />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/signup" element={<UserRegistration />} />
                        <Route path="/login" element={<UserLogin />} />
                        <Route path="/auth/linkedin/callback" element={<LinkedInLoginButton />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;