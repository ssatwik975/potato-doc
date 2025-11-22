import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Github } from 'lucide-react';
import { useBreakpoint } from '../../hooks/useMediaQuery';

export const Footer = () => {
    const { isMobile } = useBreakpoint();

    return (
        <footer style={{
            background: 'var(--footer-bg)',
            borderTop: '1px solid var(--footer-border)',
            position: 'relative',
            overflow: 'hidden',
            paddingTop: '2rem',
            paddingBottom: isMobile ? '8rem' : '2rem', // Add padding for mobile navbar
        }}>
            {/* Grid pattern overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(var(--footer-grid) 1px, transparent 1px),
                          linear-gradient(90deg, var(--footer-grid) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                opacity: 1,
                pointerEvents: 'none',
                maskImage: 'linear-gradient(to bottom, transparent, black)',
            }} />

            {/* Neon accent line */}
            <div style={{
                height: '1px',
                background: `linear-gradient(90deg, 
          transparent 0%, 
          var(--color-primary) 50%, 
          transparent 100%)`,
                opacity: 0.3,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                {/* Main footer content */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
                    gap: isMobile ? '3rem' : '4rem',
                    padding: isMobile ? '3rem 0' : '5rem 0 3rem',
                }}>
                    {/* Column 1: Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Leaf color="var(--color-primary)" size={28} />
                            <span style={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 700,
                                fontSize: '1.5rem',
                                color: 'var(--color-text-main)'
                            }}>
                                Potato<span style={{ color: 'var(--color-primary)' }}>Doc</span>
                            </span>
                        </div>
                        <p style={{
                            color: 'var(--color-text-muted)',
                            fontSize: '0.9rem',
                            lineHeight: 1.6,
                            marginBottom: '1.5rem',
                        }}>
                            AI-powered plant pathology platform protecting global crop health.
                        </p>
                        <motion.a
                            href="https://github.com/ssatwik975/potato-doc"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--color-text-muted)',
                                transition: 'all 0.3s',
                                textDecoration: 'none',
                                width: 'fit-content',
                                background: 'var(--glass-bg)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-primary)';
                                e.currentTarget.style.color = 'var(--color-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--glass-border)';
                                e.currentTarget.style.color = 'var(--color-text-muted)';
                            }}
                        >
                            <Github size={18} />
                            <span style={{ fontWeight: 500 }}>Source Code</span>
                        </motion.a>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 style={{
                            color: 'var(--color-text-main)',
                            marginBottom: '1.5rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                        }}>
                            Quick Links
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {['Home', 'Diagnosis', 'Statistics', 'Diseases'].map((link) => (
                                <li key={link}>
                                    <a
                                        href={`#${link.toLowerCase()}`}
                                        style={{
                                            color: 'var(--color-text-muted)',
                                            fontSize: '0.9rem',
                                            transition: 'color 0.3s',
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                                        onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h4 style={{
                            color: 'var(--color-text-main)',
                            marginBottom: '1.5rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                        }}>
                            Resources
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {['Research Papers', 'API Documentation', 'About Us', 'Contact'].map((link) => (
                                <li key={link}>
                                    <a
                                        href="/"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                            fontSize: '0.9rem',
                                            transition: 'color 0.3s',
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                                        onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Creators */}
                    <div>
                        <h4 style={{
                            color: 'var(--color-text-main)',
                            marginBottom: '1.5rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                        }}>
                            Creators
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { name: 'Satwik Singh', username: 'ssatwik975', url: 'https://github.com/ssatwik975' },
                                { name: 'Arpit Raj', username: 'M1CTIAN', url: 'https://github.com/M1CTIAN' }
                            ].map((creator) => (
                                <motion.a
                                    key={creator.username}
                                    href={creator.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '0.75rem',
                                        borderRadius: '0.75rem',
                                        border: '1px solid var(--glass-border)',
                                        background: 'var(--glass-bg)',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                                        e.currentTarget.style.background = 'rgba(var(--color-primary-rgb), 0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                                        e.currentTarget.style.background = 'var(--glass-bg)';
                                    }}
                                >
                                    <img 
                                        src={`https://github.com/${creator.username}.png`} 
                                        alt={creator.name}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            border: '2px solid var(--color-primary)'
                                        }}
                                    />
                                    <div>
                                        <p style={{ 
                                            color: 'var(--color-text-main)', 
                                            fontWeight: 600, 
                                            fontSize: '0.9rem',
                                            margin: 0 
                                        }}>
                                            {creator.name}
                                        </p>
                                        <p style={{ 
                                            color: 'var(--color-text-muted)', 
                                            fontSize: '0.8rem', 
                                            margin: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <Github size={12} /> @{creator.username}
                                        </p>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid var(--glass-border)',
                    padding: isMobile ? '1.5rem 0' : '2rem 0',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '0.85rem',
                        textAlign: isMobile ? 'center' : 'left',
                    }}>
                        © 2025 PotatoDoc. All rights reserved.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}>
                        {['Privacy Policy', 'Terms of Service', 'Cookies'].map((link) => (
                            <a
                                key={link}
                                href="/"
                                style={{
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.85rem',
                                    transition: 'color 0.3s',
                                }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
