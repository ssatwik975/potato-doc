import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Github, Sun, Moon, Activity, BarChart2, Scan } from 'lucide-react';
import { useBreakpoint } from '../../hooks/useMediaQuery';

export const Navbar = () => {
    const [theme, setTheme] = useState('dark');
    const [activeSection, setActiveSection] = useState('diagnosis');
    const { isMobile } = useBreakpoint();
    const [isFooterVisible, setIsFooterVisible] = useState(false);

    useEffect(() => {
        if (!isMobile) return; // only observe on mobile
        const footer = document.querySelector('footer');
        if (!footer) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                // when footer intersects viewport, hide the mobile dock
                setIsFooterVisible(entry.isIntersecting);
            });
        }, { root: null, threshold: 0 });

        obs.observe(footer);
        return () => obs.disconnect();
    }, [isMobile]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['diagnosis', 'diseases', 'statistics'];
            const scrollPosition = window.scrollY + 300; // Offset for better triggering

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-main)',
                        backdropFilter: 'blur(10px)',
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '50%',
                        width: isMobile ? '32px' : '40px',
                        height: isMobile ? '32px' : '40px',
                        cursor: 'pointer',
                        outline: 'none',
                    }}
                >
                    {theme === 'dark' ? <Sun size={isMobile ? 16 : 20} /> : <Moon size={isMobile ? 16 : 20} />}
                </motion.button>

                {!isMobile && (
                    <motion.a
                        href="https://github.com/ssatwik975/potato-doc"
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
            {!isMobile ? (
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{
                        y: 0,
                        opacity: 1,
                    }}
                    transition={{ duration: 0.4, ease: [0.6, 0.05, 0.01, 0.9] }}
                    style={{
                        position: 'fixed',
                        top: '2rem',
                        left: '50%',
                        x: '-50%',
                        zIndex: 100,
                        padding: '0.4rem',
                        borderRadius: '100px',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        boxShadow: 'var(--shadow-float)',
                        display: 'flex',
                        gap: '0.3rem',
                        alignItems: 'center',
                    }}
                >
                    {['Diagnosis', 'Diseases', 'Statistics'].map((item) => {
                        const isActive = activeSection === item.toLowerCase();
                        return (
                            <motion.button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase())}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    background: isActive ? 'var(--nav-active-bg)' : 'transparent',
                                    border: 'none',
                                    color: isActive ? 'var(--nav-active-text)' : 'var(--color-text-muted)',
                                    fontSize: '0.9rem',
                                    fontWeight: isActive ? 600 : 500,
                                    position: 'relative',
                                    transition: 'all 0.3s',
                                    padding: '0.6rem 1.4rem',
                                    cursor: 'pointer',
                                    borderRadius: '100px',
                                }}
                            >
                                {item}
                            </motion.button>
                        );
                    })}
                </motion.nav>
            ) : (
                /* Mobile Bottom Dock */
                <motion.nav
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={{
                        position: 'fixed',
                        bottom: 'calc(2rem + env(safe-area-inset-bottom))',
                        left: '50%',
                        x: '-50%',
                        zIndex: 100,
                        padding: '0.8rem 1.25rem',
                        borderRadius: '24px',
                        backdropFilter: 'blur(20px)',
                        background: 'var(--color-bg-card)',
                        border: '1px solid var(--glass-border)',
                        boxShadow: 'var(--shadow-float)',
                        display: 'flex',
                        gap: '1.25rem',
                        alignItems: 'center',
                        transform: isFooterVisible ? 'translateY(80px)' : 'translateY(0)',
                        opacity: isFooterVisible ? 0 : 1,
                        pointerEvents: isFooterVisible ? 'none' : 'auto',
                        transition: 'transform 0.28s var(--ease-smooth), opacity 0.24s var(--ease-smooth)',
                    }}
                >
                    {['Diagnosis', 'Diseases', 'Statistics'].map((item) => {
                        const isActive = activeSection === item.toLowerCase();
                        return (
                            <motion.button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase())}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    background: isActive ? 'var(--color-primary)' : 'transparent',
                                    border: 'none',
                                    color: isActive ? '#000' : 'var(--color-text-muted)',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                }}
                            >
                                {item === 'Diagnosis' && <Scan size={20} />}
                                {item === 'Diseases' && <Activity size={20} />}
                                {item === 'Statistics' && <BarChart2 size={20} />}
                            </motion.button>
                        );
                    })}
                </motion.nav>
            )}
        </>
    );
};
