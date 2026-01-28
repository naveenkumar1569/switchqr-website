import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import SuccessStories from './pages/SuccessStories';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import CaseStudy from './pages/CaseStudy';
import IndustryUseCase from './pages/IndustryUseCase';
import ComingSoon from './pages/ComingSoon';
import Layout from './Layout'; // Import the global Layout

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/case-studies" element={<SuccessStories />} />
                    <Route path="/case-studies/:slug" element={<CaseStudy />} />
                    <Route path="/industries/:slug" element={<IndustryUseCase />} />
                    <Route path="/coming-soon/:page" element={<ComingSoon />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
