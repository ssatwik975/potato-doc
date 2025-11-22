import React from 'react';

export const Footer = () => {
    return (
        <footer className="footer">
            <p>
                &copy; {new Date().getFullYear()} Potato Doc. AI-powered Plant Disease Detection.
            </p>
        </footer>
    );
};
