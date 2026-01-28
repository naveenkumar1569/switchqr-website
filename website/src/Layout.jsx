import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const Layout = ({ children }) => (
    <div className="flex min-h-screen flex-col bg-background-light text-text-main font-display">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
    </div>
);

export default Layout;
