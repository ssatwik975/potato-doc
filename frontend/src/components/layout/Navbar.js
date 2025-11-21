import React, { useState, useEffect } from 'react';
import { motion, useViewportScroll } from 'framer-motion';
import { Leaf, Github, Sun, Moon } from 'lucide-react';
import { useBreakpoint } from '../../hooks/useMediaQuery';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [theme, setTheme] = useState('dark');
    const { scrollY } = useViewportScroll();
    const { isMobile } = useBreakpoint();

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsScrolled(latest > 50);
        });
    }, [scrollY]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* Logo - Fixed top-left */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    position: 'fixed',
                    top: isMobile ? '1.5rem' : '2rem',
                    left: isMobile ? '1rem' : '3rem',
                    zIndex: 101,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}
            >
                <Leaf color="var(--color-primary)" size={isMobile ? 20 : 24} />
                <span style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: isMobile ? '1.2rem' : '1.5rem',
                    letterSpacing: '-0.02em',
                    color: 'var(--color-text-main)'
                }}>
                    Potato<span style={{ color: 'var(--color-primary)' }}>Doc</span>
                </span>
            </motion.div>

            {/* Theme Toggle + GitHub - Fixed top-right */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    position: 'fixed',
                    top: isMobile ? '1.5rem' : '2rem',
                    right: isMobile ? '1rem' : '3rem',
                    zIndex: 101,
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                }}
            >
                <motion.button
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '50%',
                        width: isMobile ? '36px' : '44px',
                        height: isMobile ? '36px' : '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-main)',
                        backdropFilter: 'blur(10px)',
                        background: 'var(--glass-bg)',
                    }}
                >
                    {theme === 'dark' ? <Sun size={isMobile ? 16 : 20} /> : <Moon size={isMobile ? 16 : 20} />}
                </motion.button>

                {!isMobile && (
                    <motion.a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            padding: '0.7rem 1.3rem',
                            borderRadius: '2rem',
                            color: 'var(--color-text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Github size={18} />
                        <span>Source</span>
                    </motion.a>
                )}
            </motion.div>

            {/* Floating Pill Navbar - Center */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{
                    y: 0,
                    opacity: 1,
                }}
                transition={{ duration: 0.4, ease: [0.6, 0.05, 0.01, 0.9] }}
                style={{
                    position: 'fixed',
                    top: isMobile ? '1rem' : '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    padding: isMobile ? '0.6rem 1rem' : '0.8rem 2rem',
                    borderRadius: '3rem',
                    backdropFilter: 'blur(20px)',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--shadow-float)',
                    display: 'flex',
                    gap: isMobile ? '1.5rem' : '2.5rem',
                    alignItems: 'center',
                }}
            >
                {['Diagnosis', 'Statistics', 'Diseases'].map((item, index) => (
                    <motion.button
                        key={item}
                        onClick={() => scrollToSection(item.toLowerCase())}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            fontSize: isMobile ? '0.8rem' : '0.9rem',
                            fontWeight: 500,
                            position: 'relative',
                            transition: 'color 0.3s',
                            padding: isMobile ? '0.3rem 0' : '0.5rem 0',
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
                    >
                        {item}
                    </motion.button>
                ))}
            </motion.nav>
        </>
    );
};
