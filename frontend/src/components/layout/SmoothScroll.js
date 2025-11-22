import React, { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export const SmoothScroll = ({ children }) => {
    // A simple smooth scroll implementation using Framer Motion
    // For a production Awwwards site, we might use Lenis, but this works for React 17

    return (
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            {children}
        </div>
    );
};
