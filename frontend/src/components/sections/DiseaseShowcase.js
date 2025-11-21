import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { useBreakpoint } from '../../hooks/useMediaQuery';

const DiseaseCard = ({ title, symptoms, treatment, color, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref);
    const { isMobile } = useBreakpoint();

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 30 : 0 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 30 : 0 }}
            transition={{ duration: 0.8, delay: isMobile ? delay / 2 : delay }}
            whileHover={isMobile ? {} : { y: -10 }}
            style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--glass-border)',
                borderRadius: isMobile ? '16px' : '24px',
                padding: isMobile ? '2rem' : '3rem',
                minWidth: isMobile ? '100%' : '350px',
                maxWidth: isMobile ? '100%' : '400px',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
            }}
        >
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: isMobile ? '100px' : '150px',
                height: isMobile ? '100px' : '150px',
                background: `radial-gradient(circle at top right, ${color} 0%, transparent 70%)`,
                opacity: 0.2,
                filter: 'blur(20px)',
            }} />

            <h3 style={{
                fontSize: isMobile ? '1.5rem' : '2rem',
                marginBottom: isMobile ? '1.5rem' : '2rem',
                color: 'var(--color-text-main)'
            }}>
                {title}
            </h3>

            <div style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
                <h4 style={{
                    color: 'var(--color-text-muted)',
                    marginBottom: '1rem',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>
                    Symptoms
                </h4>
                <ul style={{ listStyle: 'none', color: 'var(--color-text-main)', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    {symptoms.map((s, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                            <span style={{ color }}>•</span> {s}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 style={{
                    color: 'var(--color-text-muted)',
                    marginBottom: '1rem',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>
                    Treatment
                </h4>
                <p style={{
                    color: 'var(--color-text-main)',
                    lineHeight: 1.6,
                    fontSize: isMobile ? '0.9rem' : '1rem',
                }}>
                    {treatment}
                </p>
            </div>
        </motion.div>
    );
};

export const DiseaseShowcase = () => {
    const { isMobile } = useBreakpoint();

    return (
        <section
            id="diseases"
            style={{
                padding: isMobile ? '4rem 0' : 'var(--section-spacing) 0',
                overflow: 'hidden',
            }}
        >
            <div style={{ padding: isMobile ? '0 1rem' : '0 4rem', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: isMobile ? '2rem' : '3rem' }}>Known Threats</h2>
                <p style={{
                    color: 'var(--color-text-muted)',
                    marginTop: '1rem',
                    fontSize: isMobile ? '0.9rem' : '1.1rem',
                }}>
                    Understanding the diseases we detect
                </p>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: '2rem',
                    paddingLeft: isMobile ? '1rem' : '4rem',
                    paddingRight: isMobile ? '1rem' : '4rem',
                    paddingBottom: '2rem',
                    overflowX: isMobile ? 'visible' : 'auto',
                    WebkitOverflowScrolling: 'touch',
                    scrollSnapType: isMobile ? 'none' : 'x mandatory',
                }}
            >
                <DiseaseCard
                    title="Early Blight"
                    color="#ff9e40"
                    symptoms={["Dark, concentric spots on leaves", "Yellowing of lower leaves", "Stem lesions and decay"]}
                    treatment="Apply fungicides (chlorothalonil) early. Practice crop rotation and remove infected debris to prevent spread."
                    delay={0}
                />
                <DiseaseCard
                    title="Late Blight"
                    color="#ff3d00"
                    symptoms={["Water-soaked spots on leaves", "White fungal growth underneath", "Tuber rot and spoilage"]}
                    treatment="Immediate fungicide application required. Destroy infected plants. Use resistant potato varieties when possible."
                    delay={0.2}
                />
                <DiseaseCard
                    title="Healthy Plant"
                    color="#00ff9d"
                    symptoms={["Vibrant green foliage", "Firm, upright stems", "No discoloration or spots"]}
                    treatment="Continue regular watering schedule and nutrient management. Monitor regularly for early pest or disease detection."
                    delay={0.4}
                />
            </div>
        </section>
    );
};
