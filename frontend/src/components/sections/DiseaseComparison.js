import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertOctagon, Thermometer, Droplets, Activity, Sprout, Shield } from 'lucide-react';
import { useBreakpoint } from '../../hooks/useMediaQuery';
import { useInView } from '../../hooks/useInView';

const ClassCard = ({ title, subtitle, icon: Icon, color, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay, duration: 0.5 }}
            style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1rem'
        }}
    >
        <div style={{ 
            padding: '12px', 
            borderRadius: '50%', 
            background: `${color}15`,
            color: color 
        }}>
            <Icon size={24} />
        </div>
        <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{title}</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{subtitle}</p>
        </div>
    </motion.div>
    );
};

const DiseaseColumn = ({ title, scientificName, description, features, color, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ delay, duration: 0.7 }}
            style={{
                flex: 1,
                background: `linear-gradient(180deg, ${color}08 0%, rgba(255,255,255,0.02) 100%)`,
                border: `1px solid ${color}20`,
                borderRadius: '24px',
                padding: '2.5rem',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px', 
                background: `linear-gradient(90deg, transparent, ${color}, transparent)` 
            }} />
            
            <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
                {title}
            </h3>
            <p style={{ 
                fontFamily: 'serif', fontStyle: 'italic', color: color, 
                fontSize: '1.1rem', marginBottom: '1.5rem' 
            }}>
                {scientificName}
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
                {description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ 
                            padding: '8px', borderRadius: '8px', 
                            background: 'rgba(255,255,255,0.05)', color: color 
                        }}>
                            {f.icon}
                        </div>
                        <div>
                            <h5 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>{f.title}</h5>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export const DiseaseComparison = () => {
    const { isMobile } = useBreakpoint();
    const headerRef = useRef(null);
    const headerInView = useInView(headerRef);

    return (
        <section id="diseases" style={{
            padding: isMobile ? '4rem 1rem' : '8rem 2rem',
            maxWidth: '1200px',
            margin: '0 auto',
        }}>
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <motion.h2 
                    ref={headerRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', marginBottom: '1rem', fontWeight: 700 }}
                >
                    Precision <span style={{ fontFamily: 'serif', fontStyle: 'italic', fontWeight: 400, color: 'var(--color-primary)' }}>Classification</span>
                </motion.h2>
                <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                    Our AI model is trained to distinguish between three specific states of potato leaf health with 98.8% accuracy.
                </p>
            </div>

            {/* 3 Classes Overview */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
                gap: '1.5rem', 
                marginBottom: '8rem' 
            }}>
                <ClassCard 
                    title="Healthy" 
                    subtitle="Optimal physiological state with no signs of pathogen stress."
                    icon={Sprout} 
                    color="#00ff9d" 
                    delay={0} 
                />
                <ClassCard 
                    title="Early Blight" 
                    subtitle="Fungal infection characterized by concentric ring lesions."
                    icon={AlertTriangle} 
                    color="#ff9e40" 
                    delay={0.1} 
                />
                <ClassCard 
                    title="Late Blight" 
                    subtitle="Aggressive water-mold disease causing rapid tissue necrosis."
                    icon={AlertOctagon} 
                    color="#ff3d00" 
                    delay={0.2} 
                />
            </div>

            {/* Disease Deep Dive Header */}
            <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Known Threats</h3>
            </div>

            {/* 2 Column Comparison */}
            <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row', 
                gap: '2rem',
                alignItems: 'stretch'
            }}>
                <DiseaseColumn 
                    title="Early Blight"
                    scientificName="Alternaria solani"
                    color="#ff9e40"
                    delay={0.2}
                    description="A common fungal disease that typically affects older leaves first. While less destructive than Late Blight, it can significantly reduce yields if left untreated."
                    features={[
                        { icon: <Activity size={18} />, title: "Symptoms", desc: "Dark brown spots with concentric rings (bullseye pattern)." },
                        { icon: <Thermometer size={18} />, title: "Conditions", desc: "Thrives in warm (24-29°C) temperatures with high humidity." },
                        { icon: <Shield size={18} />, title: "Management", desc: "Crop rotation, removal of infected debris, and preventative fungicides." }
                    ]}
                />
                <DiseaseColumn 
                    title="Late Blight"
                    scientificName="Phytophthora infestans"
                    color="#ff3d00"
                    delay={0.4}
                    description="The most devastating potato disease globally. It caused the Irish Potato Famine and remains a major threat to food security today."
                    features={[
                        { icon: <Droplets size={18} />, title: "Symptoms", desc: "Large, irregular water-soaked spots. White fungal growth on undersides." },
                        { icon: <Thermometer size={18} />, title: "Conditions", desc: "Favors cool, wet weather. Spreads rapidly via wind and water." },
                        { icon: <Shield size={18} />, title: "Management", desc: "Immediate fungicide application. Resistant varieties. Destruction of cull piles." }
                    ]}
                />
            </div>
        </section>
    );
};
