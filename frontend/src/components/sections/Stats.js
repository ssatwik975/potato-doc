import React, { useRef, useState, useEffect } from 'react';
import { motion, useViewportScroll, useTransform, useSpring } from 'framer-motion';
import { TrendingUp, Zap, ShieldCheck, Database } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { useBreakpoint } from '../../hooks/useMediaQuery';

const AnimatedNumber = ({ value, suffix = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref);
    const [display, setDisplay] = useState(0);
    const spring = useSpring(0, { duration: 2000, bounce: 0 });
    
    useEffect(() => {
        if (isInView) {
            spring.set(value);
        }
    }, [isInView, value, spring]);

    useEffect(() => {
        return spring.on("change", latest => {
            setDisplay(latest.toFixed(value % 1 !== 0 ? 1 : 0));
        });
    }, [spring, value]);

    return <span ref={ref}>{display}{suffix}</span>;
};

const BentoCard = ({ children, className, style, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay }}
            className={className}
            style={{
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '24px',
            padding: '2rem',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'default',
            ...style
        }}
    >
        {children}
    </motion.div>
    );
};

export const Stats = () => {
    const { scrollYProgress } = useViewportScroll();
    
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const { isMobile } = useBreakpoint();
    
    const headerRef = useRef(null);
    const headerInView = useInView(headerRef);

    return (
        <section 
            id="statistics" 
            style={{ 
                padding: isMobile ? '4rem 1rem' : '8rem 2rem', 
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Parallax Background Elements */}
            <motion.div style={{ 
                position: 'absolute', top: '10%', left: '-10%', width: '500px', height: '500px', 
                background: 'radial-gradient(circle, rgba(0,255,157,0.05) 0%, transparent 70%)', 
                y: y1, zIndex: -1 
            }} />
            <motion.div style={{ 
                position: 'absolute', bottom: '10%', right: '-5%', width: '600px', height: '600px', 
                background: 'radial-gradient(circle, rgba(255,61,0,0.03) 0%, transparent 70%)', 
                y: y2, zIndex: -1 
            }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <motion.h2 
                        ref={headerRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        style={{ fontSize: isMobile ? '2.5rem' : '4rem', fontWeight: 700, marginBottom: '1rem' }}
                    >
                        Global <span style={{ fontFamily: 'serif', fontStyle: 'italic', fontWeight: 400, color: 'var(--color-primary)' }}>Impact</span>
                    </motion.h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Securing the future of food through intelligent disease prevention.
                    </p>
                </div>

                {/* Bento Grid Layout */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', 
                    gridTemplateRows: isMobile ? 'auto' : 'repeat(2, 280px)', 
                    gap: '1.5rem' 
                }}>
                    {/* Main Stat - Large Card */}
                    <BentoCard style={{ gridColumn: isMobile ? '1' : 'span 2', gridRow: isMobile ? 'auto' : 'span 2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-secondary)' }}>
                                <TrendingUp size={20} />
                                <span style={{ fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em' }}>ECONOMIC LOSS</span>
                            </div>
                            <h3 style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1, marginBottom: '0.5rem' }}>
                                $<AnimatedNumber value={6.7} />B
                            </h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                                Annual global yield loss due to Late Blight alone.
                            </p>
                        </div>
                        
                        {/* Animated Bar Graph Background */}
                        <div style={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            left: 0, 
                            right: 0, 
                            height: '60%', 
                            display: 'flex', 
                            alignItems: 'flex-end', 
                            justifyContent: 'space-around',
                            padding: '0 2rem',
                            opacity: 0.3,
                            zIndex: 1
                        }}>
                            {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ 
                                        duration: 1.5, 
                                        delay: i * 0.1, 
                                        ease: "easeOut",
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        repeatDelay: 2
                                    }}
                                    style={{
                                        width: '12%',
                                        background: 'linear-gradient(180deg, var(--color-secondary) 0%, transparent 100%)',
                                        borderRadius: '4px 4px 0 0',
                                    }}
                                />
                            ))}
                        </div>
                    </BentoCard>

                    {/* Accuracy Stat */}
                    <BentoCard style={{ gridColumn: isMobile ? '1' : 'span 1', background: 'rgba(0,255,157,0.05)', borderColor: 'rgba(0,255,157,0.1)' }} delay={0.1}>
                        <ShieldCheck size={32} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            <AnimatedNumber value={99} suffix="%" />
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Model Accuracy on Validation Set</p>
                    </BentoCard>

                    {/* Speed Stat */}
                    <BentoCard style={{ gridColumn: isMobile ? '1' : 'span 1' }} delay={0.2}>
                        <Zap size={32} color="#FFD700" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            &lt;<AnimatedNumber value={2} suffix="s" />
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Average Inference Time</p>
                    </BentoCard>

                    {/* Dataset Stat */}
                    <BentoCard style={{ gridColumn: isMobile ? '1' : 'span 2', display: 'flex', alignItems: 'center', gap: '2rem', overflow: 'hidden', border: '1px solid var(--glass-border)' }} delay={0.3}>
                        {/* Background Pattern */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(8, 1fr)',
                            gap: '4px',
                            opacity: 0.1,
                            zIndex: 0,
                            transform: 'rotate(-10deg) scale(1.5)'
                        }}>
                            {Array.from({ length: 32 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0.3 }}
                                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                                    transition={{
                                        duration: 3,
                                        delay: Math.random() * 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    style={{
                                        background: 'var(--color-text-main)',
                                        borderRadius: '2px',
                                        aspectRatio: '1'
                                    }}
                                />
                            ))}
                        </div>

                        <div style={{ 
                            width: '60px', height: '60px', borderRadius: '50%', 
                            background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            zIndex: 1,
                            backdropFilter: 'blur(5px)'
                        }}>
                            <Database size={24} />
                        </div>
                        <div style={{ zIndex: 1 }}>
                            <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>
                                <AnimatedNumber value={2150} suffix="+" />
                            </h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>Labeled images in training dataset</p>
                        </div>
                    </BentoCard>
                </div>
            </div>
        </section>
    );
};
