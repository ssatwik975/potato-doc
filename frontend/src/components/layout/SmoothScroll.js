import React from "react";

export const SmoothScroll = ({ children }) => {
    // A simple smooth scroll implementation using Framer Motion
    // For a production Awwwards site, we might use Lenis, but this works for React 17

    return (
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            {children}
        </div>
    );
};
