import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { useBreakpoint } from '../../hooks/useMediaQuery';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

const DiseaseCard = ({ title, symptoms, treatment, color, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref);
    const { isMobile } = useBreakpoint();

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: isMobile ? delay / 2 : delay }}
            whileHover={{ y: -5, boxShadow: `0 20px 40px -10px ${color}20` }}
            style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px',
                padding: '0',
                minWidth: isMobile ? '100%' : '380px',
                maxWidth: isMobile ? '100%' : '400px',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div style={{
                padding: '2rem',
                background: `linear-gradient(180deg, ${color}10 0%, transparent 100%)`,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                }}>
                    <div style={{
                        padding: '0.5rem',
                        borderRadius: '12px',
                        background: `${color}20`,
                        color: color,
                    }}>
                        <Activity size={24} />
                    </div>
                    <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: color,
                        border: `1px solid ${color}40`,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '100px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    }}>
                        Detected
                    </div>
                </div>
                <h3 style={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: 'var(--color-text-main)',
                    marginBottom: '0.5rem',
                }}>
                    {title}
                </h3>
            </div>

            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                    <h4 style={{
                        color: 'var(--color-text-muted)',
                        marginBottom: '1rem',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        <AlertCircle size={14} /> Symptoms
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {symptoms.map((s, i) => (
                            <li key={i} style={{ 
                                display: 'flex', 
                                gap: '0.75rem', 
                                fontSize: '0.95rem',
                                color: 'var(--color-text-main)',
                                lineHeight: 1.5,
                            }}>
                                <span style={{ color: color, marginTop: '0.25rem' }}>•</span> {s}
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <h4 style={{
                        color: 'var(--color-text-muted)',
                        marginBottom: '1rem',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        <CheckCircle size={14} /> Treatment
                    </h4>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.6,
                        fontSize: '0.95rem',
                        background: 'rgba(255,255,255,0.02)',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.03)',
                    }}>
                        {treatment}
                    </p>
                </div>
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
