import React from 'react';
import { useLocation } from 'react-router-dom';
import './layout.css';
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa';

const Layout = ({ children }) => {
    const location = useLocation();
    const footerExcludedRoutes = ['/login', '/signup', '/AuthPage', '/recursion']; 
   
    const showFooter = !footerExcludedRoutes.includes(location.pathname);

    return (
        <div id="root">
            <main>
                {children}
            </main>
            {showFooter && (
                <footer className="footer">
                    <h2>Connect with us</h2>
                    <div className="social-icons">
                        <a href="#" className="icon" aria-label="GitHub">
                            <FaGithub size={32} />
                        </a>
                        <a href="#" className="icon" aria-label="Twitter">
                            <FaTwitter size={32} />
                        </a>
                        <a href="#" className="icon" aria-label="LinkedIn">
                            <FaLinkedin size={32} />
                        </a>
                        <a href="#" className="icon" aria-label="Discord">
                            <FaDiscord size={32} />
                        </a>
                    </div>
                    <p>&copy; 2023 My React App. All rights reserved.</p>
                </footer>
            )}
        </div>
    );
};

export default Layout;