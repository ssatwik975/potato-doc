import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, User, Sprout, AlertCircle, ThermometerSun } from 'lucide-react';
import axios from 'axios';
import { useDiagnosis } from '../../context/DiagnosisContext';
import { useInView } from '../../hooks/useInView';

export const Assistant = () => {
    const { diagnosis } = useDiagnosis();
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hi! I'm Potato Doc. Ask me anything about your potato crops or scan results!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesContainerRef = useRef(null);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { threshold: 0.1 });

    const scrollToBottom = () => {
        // Only scroll if we have more than the initial message or if it's a user interaction
        if (messages.length > 1 && messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Simple Markdown Renderer
    const renderMessage = (text) => {
        // Split by newlines to handle paragraphs/lists
        const lines = text.split('\n');
        
        return lines.map((line, i) => {
            // Handle bold text (**text**)
            const parts = line.split(/(\*\*.*?\*\*)/g);
            
            const content = parts.map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={j} style={{ color: 'var(--color-primary)', background: 'var(--color-primary-dim)', padding: '0 4px', borderRadius: '4px' }}>{part.slice(2, -2)}</strong>;
                }
                return part;
            });

            // Handle bullet points
            if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                // Remove the bullet marker from the content
                const cleanContent = content.map(c => 
                    typeof c === 'string' ? c.replace(/^[\*\-]\s+/, '') : c
                );
                
                return (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
                        <span style={{ color: 'var(--color-primary)' }}>•</span>
                        <span>{cleanContent}</span>
                    </div>
                );
            }
            
            // Handle numbered lists
            if (/^\d+\./.test(line.trim())) {
                 return (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
                        <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{line.trim().split('.')[0]}.</span>
                        <span>{line.replace(/^\d+\.\s*/, '')}</span>
                    </div>
                );
            }

            // Regular paragraph
            return line.trim() ? <p key={i} style={{ margin: 0 }}>{content}</p> : null;
        });
    };

    useEffect(() => {
        if (diagnosis) {
            const diagnosisName = diagnosis.class || diagnosis.label || diagnosis.prediction;
            const confidence = diagnosis.confidence || diagnosis.score || 0.98;
            const confidenceText = (confidence * 100).toFixed(1) + '%';
            
            setMessages(prev => [
                ...prev,
                { 
                    role: 'bot', 
                    text: `I see you've just scanned a plant. The result is **${diagnosisName}** with ${confidenceText} confidence. How can I help you with this?` 
                }
            ]);
        }
    }, [diagnosis]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const context = diagnosis 
                ? `User just scanned a plant. Diagnosis: ${diagnosis.class} (Confidence: ${(diagnosis.confidence * 100).toFixed(1)}%).` 
                : null;

            // Use relative path for production (Vercel) and absolute for local dev
            const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:8000/api/chat'
                : '/api/chat';

            const response = await axios.post(API_URL, {
                message: userMessage,
                context: context
            });

            setMessages(prev => [...prev, { role: 'bot', text: response.data.response }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestions = [
        { icon: <Sprout size={14} />, text: "How to prevent Early Blight?" },
        { icon: <AlertCircle size={14} />, text: "Signs of Late Blight?" },
        { icon: <ThermometerSun size={14} />, text: "Best temperature for potatoes?" },
    ];

    return (
        <section 
            id="assistant" 
            ref={containerRef}
            style={{ 
                padding: 'var(--section-spacing) 0',
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div style={{ 
                maxWidth: '850px', 
                width: '95%', 
                display: 'flex',
                flexDirection: 'column',
                height: 'min(80vh, 700px)',
                position: 'relative'
            }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    style={{ marginBottom: '1.5rem', textAlign: 'center' }}
                >
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.6rem',
                        marginBottom: '0.8rem',
                        padding: '0.4rem 0.8rem',
                        background: 'rgba(0, 255, 157, 0.08)',
                        borderRadius: '50px',
                        border: '1px solid rgba(0, 255, 157, 0.15)'
                    }}>
                        <Sparkles size={16} color="var(--color-primary)" />
                        <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.05em' }}>AI ASSISTANT</span>
                    </div>
                    <h2 style={{ 
                        fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', 
                        fontWeight: 700,
                        margin: 0,
                        background: 'var(--hero-text-gradient)',
                        WebkitBackgroundClip: 'var(--hero-text-clip)',
                        WebkitTextFillColor: 'var(--hero-text-fill)',
                        letterSpacing: '-0.02em'
                    }}>
                        Potato Doc AI
                    </h2>
                </motion.div>

                {/* Chat Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{
                        flex: 1,
                        background: 'var(--color-bg-card)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
                        position: 'relative'
                    }}
                >
                    {/* Messages Area */}
                    <div 
                        ref={messagesContainerRef}
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '2rem 2rem 8rem 2rem', // Extra padding at bottom for input
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.2rem',
                            scrollBehavior: 'smooth'
                        }}
                    >
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    display: 'flex',
                                    gap: '0.8rem',
                                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                                }}
                            >
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '10px',
                                    background: msg.role === 'user' ? 'var(--color-text-main)' : 'rgba(0, 255, 157, 0.1)',
                                    color: msg.role === 'user' ? 'var(--color-bg-main)' : 'var(--color-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                }}>
                                    {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                                </div >
                                <div style={{
                                    padding: '0.75rem 1.2rem',
                                    borderRadius: '24px',
                                    background: msg.role === 'user' ? 'var(--color-text-main)' : 'var(--glass-bg)',
                                    color: msg.role === 'user' ? 'var(--color-bg-main)' : 'var(--color-text-main)',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.5',
                                    border: msg.role === 'user' ? 'none' : '1px solid var(--glass-border)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem'
                                }}>
                                    {renderMessage(msg.text)}
                                </div>
                            </motion.div>
                        ))}
                        {isLoading && (
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(0, 255, 157, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Sparkles size={16} color="var(--color-primary)" />
                                </div>
                                <div style={{ display: 'flex', gap: '4px', padding: '0.8rem' }}>
                                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text-muted)' }} />
                                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text-muted)' }} />
                                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text-muted)' }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Floating Input Area */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '1.5rem',
                        background: 'linear-gradient(to top, var(--color-bg-card) 80%, transparent)',
                        zIndex: 10
                    }}>
                        {/* Suggestions */}
                        {messages.length < 3 && (
                            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.2rem', justifyContent: 'center' }}>
                                {suggestions.map((s, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.05, background: 'var(--glass-highlight)' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setInput(s.text)}
                                        style={{
                                            background: 'var(--glass-bg)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '50px',
                                            padding: '0.4rem 0.8rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            color: 'var(--color-text-muted)',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            fontSize: '0.8rem',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        {s.icon}
                                        {s.text}
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSend} style={{ position: 'relative', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask anything about potatoes..."
                                style={{
                                    width: '100%',
                                    background: 'var(--glass-bg)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '50px',
                                    padding: '1rem 3.5rem 1rem 1.5rem',
                                    color: 'var(--color-text-main)',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                style={{
                                    position: 'absolute',
                                    right: '0.5rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: input.trim() ? 'var(--color-primary)' : 'rgba(150,150,150,0.1)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: input.trim() ? 'pointer' : 'default',
                                    transition: 'all 0.3s ease',
                                    color: input.trim() ? 'var(--button-text-color)' : 'var(--color-text-muted)'
                                }}
                            >
                                <Send size={18} />
                            </button>
                        </form>
                        <div style={{ textAlign: 'center', marginTop: '0.6rem', fontSize: '0.7rem', color: 'var(--color-text-muted)', opacity: 0.7 }}>
                            Potato Doc AI can make mistakes. Always verify important information.
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};