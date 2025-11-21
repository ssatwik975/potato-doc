import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, AlertTriangle, Thermometer, Droplets, DollarSign } from 'lucide-react';
import { useBreakpoint } from '../../hooks/useMediaQuery';

const ComparisonCard = ({ title, subtitle, features, isPrimary, delay }) => {
    const { isMobile } = useBreakpoint();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            style={{
                flex: 1,
                background: isPrimary
                    ? 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                    : 'transparent',
                border: isPrimary
                    ? '1px solid var(--color-primary-glow)'
                    : '1px solid var(--glass-border)',
                borderRadius: '2rem',
                padding: isMobile ? '2rem' : '3rem',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
            }}
        >
            {isPrimary && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
                    opacity: 0.5,
                }} />
            )}

            <h3 style={{
                fontSize: isMobile ? '2rem' : '2.5rem',
                fontFamily: 'serif',
                fontStyle: 'italic',
                marginBottom: '0.5rem',
                color: isPrimary ? 'var(--color-primary)' : 'var(--color-text-main)',
            }}>
                {title}
            </h3>
            <p style={{
                color: 'var(--color-text-muted)',
                marginBottom: '2rem',
                fontSize: '1.1rem',
            }}>
                {subtitle}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {features.map((feature, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{
                            background: isPrimary ? 'rgba(var(--color-primary-rgb), 0.1)' : 'rgba(255,255,255,0.05)',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '-0.2rem',
                        }}>
                            {feature.icon}
                        </div>
                        <div>
                            <h4 style={{
                                fontSize: '1rem',
                                fontWeight: 600,
                                color: 'var(--color-text-main)',
                                marginBottom: '0.2rem'
                            }}>
                                {feature.title}
                            </h4>
                            <p style={{
                                fontSize: '0.9rem',
                                color: 'var(--color-text-muted)',
                                lineHeight: 1.5
                            }}>
                                {feature.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export const DiseaseComparison = () => {
    const { isMobile } = useBreakpoint();

    const earlyBlightFeatures = [
        {
            icon: <AlertTriangle size={18} color="var(--color-warning)" />,
            title: "Symptoms",
            desc: "Concentric rings (bullseye) on lower leaves. Dark, sunken lesions on tubers."
        },
        {
            icon: <Thermometer size={18} color="var(--color-text-main)" />,
            title: "Conditions",
            desc: "Thrives in warm (24-29°C), humid conditions with alternating wet/dry periods."
        },
        {
            icon: <DollarSign size={18} color="var(--color-text-main)" />,
            title: "Economic Impact",
            desc: "Reduces yield by 20-30% annually. Requires frequent fungicide application."
        },
    ];

    const lateBlightFeatures = [
        {
            icon: <AlertTriangle size={18} color="var(--color-error)" />,
            title: "Symptoms",
            desc: "Water-soaked spots on leaves, white fungal growth. Rapid tissue necrosis."
        },
        {
            icon: <Droplets size={18} color="var(--color-text-main)" />,
            title: "Conditions",
            desc: "Favors cool (10-24°C), wet weather. Spreads rapidly via wind and water."
        },
        {
            icon: <DollarSign size={18} color="var(--color-text-main)" />,
            title: "Economic Impact",
            desc: "Most destructive potato disease. Can destroy entire fields in days. $6.7B global loss."
        },
    ];

    return (
        <section id="diseases" style={{
            padding: isMobile ? '4rem 1rem' : '8rem 2rem',
            maxWidth: '1200px',
            margin: '0 auto',
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
                <h2 style={{
                    fontSize: isMobile ? '2.5rem' : '3.5rem',
                    marginBottom: '1rem',
                    letterSpacing: '-0.03em',
                }}>
                    Know Your <span style={{
                        fontFamily: 'serif',
                        fontStyle: 'italic',
                        color: 'var(--color-primary)'
                    }}>Enemy.</span>
                </h2>
                <p style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '1.2rem',
                    maxWidth: '600px',
                    margin: '0 auto',
                }}>
                    Distinguishing between Early and Late Blight is critical for effective treatment.
                </p>
            </motion.div>

            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '2rem',
                alignItems: 'stretch',
            }}>
                <ComparisonCard
                    title="Early Blight"
                    subtitle="Alternaria solani"
                    features={earlyBlightFeatures}
                    delay={0.2}
                />
                <ComparisonCard
                    title="Late Blight"
                    subtitle="Phytophthora infestans"
                    features={lateBlightFeatures}
                    isPrimary={true}
                    delay={0.4}
                />
            </div>
        </section>
    );
};
