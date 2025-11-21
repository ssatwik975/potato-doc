import React, { useRef, useEffect, useState } from 'react';
import { motion, useTransform, useViewportScroll, useSpring } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { useBreakpoint } from '../../hooks/useMediaQuery';
import { Globe, TrendingDown, Users } from 'lucide-react';

const AnimatedCounter = ({ value, duration = 2 }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const springValue = useSpring(0, { duration: duration * 1000 });
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    const suffix = value.replace(/[0-9.]/g, '');

    useEffect(() => {
        springValue.set(numericValue);
        const unsubscribe = springValue.onChange((v) => {
            setDisplayValue(v.toFixed(value.includes('.') ? 1 : 0));
        });
        return () => unsubscribe();
    }, [numericValue, springValue, value]);

    return <span>{displayValue}{suffix}</span>;
};

const StatItem = ({ icon: Icon, value, label, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref);
    const { isMobile } = useBreakpoint();

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay }}
            style={{
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                padding: '2rem',
                borderRadius: '2rem',
                backdropFilter: 'blur(10px)',
            }}
        >
            <div style={{
                display: 'inline-flex',
                padding: '1rem',
                background: 'rgba(var(--color-primary-rgb), 0.1)',
                borderRadius: '50%',
                marginBottom: '1.5rem',
                color: 'var(--color-primary)'
            }}>
                <Icon size={32} />
            </div>
            <div style={{
                fontSize: isMobile ? '2.5rem' : '3.5rem',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                fontFamily: 'var(--font-display)',
                lineHeight: 1,
                marginBottom: '0.5rem',
            }}>
                {isInView ? <AnimatedCounter value={value} /> : value}
            </div>
            <div style={{
                color: 'var(--color-text-muted)',
                fontSize: isMobile ? '0.9rem' : '1.1rem',
                lineHeight: 1.5,
            }}>
                {label}
            </div>
        </motion.div>
    );
};

export const Stats = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useViewportScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const { isMobile } = useBreakpoint();

    return (
        <section
            id="statistics"
            ref={ref}
            style={{
                padding: isMobile ? '6rem 0' : '10rem 0',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Parallax Background */}
            <motion.div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                y,
                zIndex: -1,
                opacity: 0.1,
                background: 'radial-gradient(circle at 50% 50%, var(--color-primary) 0%, transparent 50%)',
                filter: 'blur(100px)',
            }} />

            <div style={{ maxWidth: 'var(--container-width)', margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        textAlign: 'center',
                        marginBottom: isMobile ? '4rem' : '6rem',
                    }}
                >
                    <h2 style={{
                        fontSize: isMobile ? '2.5rem' : '4rem',
                        marginBottom: '1.5rem',
                        letterSpacing: '-0.03em',
                    }}>
                        Global Impact
                    </h2>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        maxWidth: '700px',
                        margin: '0 auto',
                        fontSize: isMobile ? '1rem' : '1.2rem',
                        lineHeight: 1.6,
                    }}>
                        The cost of inaction is billions. Our technology aims to secure the future of food.
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: isMobile ? '2rem' : '3rem',
                }}>
                    <StatItem
                        icon={TrendingDown}
                        value="$6.7B"
                        label="Annual losses due to Late Blight alone"
                        delay={0}
                    />
                    <StatItem
                        icon={Globe}
                        value="60%"
                        label="Yield reduction in developing regions"
                        delay={0.2}
                    />
                    <StatItem
                        icon={Users}
                        value="300M"
                        label="People rely on potatoes as a staple food"
                        delay={0.4}
                    />
                </div>
            </div>
        </section>
    );
};
