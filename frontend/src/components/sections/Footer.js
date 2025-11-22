import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Mail, Github, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { useBreakpoint } from '../../hooks/useMediaQuery';

export const Footer = () => {
    const [email, setEmail] = useState('');
    const { isMobile } = useBreakpoint();

    const handleSubscribe = (e) => {
        e.preventDefault();
        alert('Newsletter subscription coming soon!');
        setEmail('');
    };

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
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {[
                                { Icon: Twitter, href: '#' },
                                { Icon: Linkedin, href: '#' },
                                { Icon: Github, href: 'https://github.com/ssatwik975/potato-doc' },
                            ].map(({ Icon, href }, i) => (
                                <motion.a
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        border: '1px solid var(--glass-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-text-muted)',
                                        transition: 'all 0.3s',
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
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
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

                    {/* Column 4: Newsletter */}
                    <div>
                        <h4 style={{
                            color: 'var(--color-text-main)',
                            marginBottom: '1.5rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                        }}>
                            Stay Updated
                        </h4>
                        <p style={{
                            color: 'var(--color-text-muted)',
                            fontSize: '0.85rem',
                            marginBottom: '1rem',
                            lineHeight: 1.6,
                        }}>
                            Subscribe for crop health insights and AI updates.
                        </p>
                        <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Mail
                                    size={18}
                                    style={{
                                        position: 'absolute',
                                        left: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--color-text-muted)',
                                    }}
                                />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem 0.8rem 3rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid var(--glass-border)',
                                        background: 'var(--glass-bg)',
                                        color: 'var(--color-text-main)',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                        transition: 'border-color 0.3s',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '0.5rem',
                                    background: 'var(--color-primary)',
                                    color: '#000',
                                    border: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                Subscribe <ArrowRight size={16} />
                            </motion.button>
                        </form>
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
