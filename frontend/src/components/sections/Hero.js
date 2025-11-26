import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Magnetic } from '../layout/Magnetic';
import { useBreakpoint } from '../../hooks/useMediaQuery';

export const Hero = () => {
    const { scrollY } = useScroll();
    const { isMobile } = useBreakpoint();

    // Always call hooks - React rules of hooks require this
    const yTransform = useTransform(scrollY, [0, 1000], [0, 400]);
    const opacityTransform = useTransform(scrollY, [0, 800], [1, 0]);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Wrapper for desktop scroll effects to avoid conflict with entry animation
    const ContentWrapper = ({ children }) => {
        if (isMobile) return <>{children}</>;
        return (
            <motion.div style={{ y: yTransform, opacity: opacityTransform, width: '100%' }}>
                {children}
            </motion.div>
        );
    };

    return (
        <section
            id="home"
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                padding: isMobile ? '6rem 1rem 2rem' : '0 2rem',
            }}
        >
            {/* Background Elements - Hidden on mobile */}
            {!isMobile && (
                <>
                    <div style={{
                        position: 'absolute',
                        top: '20%',
                        left: '10%',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                        opacity: 0.2,
                        zIndex: -1,
                    }} />

                    <div style={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '5%',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(255, 61, 0, 0.15) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                        opacity: 0.3,
                        zIndex: -1,
                    }} />
                </>
            )}

            <ContentWrapper>
                <motion.div
                    style={{ textAlign: 'center', zIndex: 1, width: '100%', position: 'relative' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem',
                            borderRadius: '2rem',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(255,255,255,0.03)',
                            marginBottom: isMobile ? '1.5rem' : '2rem',
                        }}
                    >
                        <span style={{
                            width: '8px',
                            height: '8px',
                            background: 'var(--color-primary)',
                            borderRadius: '50%',
                            boxShadow: '0 0 10px var(--color-primary)'
                        }}></span>
                        <span style={{
                            fontSize: isMobile ? '0.75rem' : '0.9rem',
                            color: 'var(--color-text-muted)',
                            letterSpacing: '0.05em'
                        }}>
                            All servers are <span style={{ color: 'var(--color-primary)' }}>online</span>
                        </span>
                    </motion.div>

                    <h1 style={{
                        fontSize: isMobile ? 'clamp(2.5rem, 12vw, 4rem)' : 'clamp(3rem, 8vw, 7rem)',
                        lineHeight: 0.9,
                        marginBottom: isMobile ? '1.5rem' : '2rem',
                        background: 'var(--hero-text-gradient)',
                        WebkitBackgroundClip: 'var(--hero-text-clip)',
                        WebkitTextFillColor: 'var(--hero-text-fill)',
                        color: 'var(--color-text-main)', // Fallback
                        letterSpacing: '-0.04em',
                        paddingBottom: '0.2em', // Prevent clipping of italic text
                    }}>
                        Diagnose Crops <br />
                        <span style={{ 
                            fontStyle: 'italic', 
                            fontFamily: 'serif', 
                            fontWeight: 400, 
                            background: 'var(--hero-instantly-gradient)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'var(--hero-instantly-fill)',
                            color: 'var(--color-primary)' // Fallback
                        }}>Instantly</span>
                    </h1>

                    <p style={{
                        fontSize: isMobile ? '1rem' : '1.2rem',
                        color: 'var(--color-text-muted)',
                        maxWidth: '600px',
                        margin: isMobile ? '0 auto 2rem' : '0 auto 3rem',
                        lineHeight: 1.6,
                        padding: isMobile ? '0 1rem' : '0',
                    }}>
                        Advanced computer vision to detect Early Blight and Late Blight in potato crops.
                        Protecting the $6.7B global industry with 99% accuracy.
                    </p>

                    <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: '1.5rem',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: isMobile ? '300px' : 'none',
                        margin: '0 auto',
                    }}>
                        <Magnetic disabled={isMobile}>
                            <motion.button
                                onClick={() => scrollToSection('diagnosis')}
                                whileHover={{ scale: isMobile ? 1 : 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    width: isMobile ? '100%' : 'auto',
                                    padding: isMobile ? '1rem 2rem' : '1.2rem 2.5rem',
                                    borderRadius: '3rem',
                                    background: 'var(--color-primary)',
                                    color: 'var(--button-text-color)',
                                    fontSize: isMobile ? '1rem' : '1.1rem',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                Start Diagnosis <ArrowRight size={20} />
                            </motion.button>
                        </Magnetic>

                        <Magnetic disabled={isMobile}>
                            <motion.button
                                whileHover={{ scale: isMobile ? 1 : 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => scrollToSection('assistant')}
                                style={{
                                    width: isMobile ? '100%' : 'auto',
                                    padding: isMobile ? '1rem 2rem' : '1.2rem 2.5rem',
                                    borderRadius: '3rem',
                                    background: 'transparent',
                                    color: 'var(--color-text-main)',
                                    fontSize: isMobile ? '1rem' : '1.1rem',
                                    fontWeight: 500,
                                    border: '1px solid var(--glass-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.8rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Ask AI Assistant <Sparkles size={20} />
                            </motion.button>
                        </Magnetic>
                    </div>
                </motion.div>
            </ContentWrapper>
        </section>
    );
};
