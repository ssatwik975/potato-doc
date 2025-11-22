import React from 'react';

export const Processing = ({ image }) => {
    return (
        <div className="processing-overlay animate-fade-in">
            <div className="scanner-container">
                <img src={image} alt="Scanning" className="scanner-img" />
                <div className="scan-line"></div>
            </div>
            <p className="processing-text">Analyzing Leaf Structure...</p>
        </div>
    );
};
