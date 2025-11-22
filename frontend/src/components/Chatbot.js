import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, User } from 'lucide-react';
import axios from 'axios';
import { useDiagnosis } from '../context/DiagnosisContext';
import { useBreakpoint } from '../hooks/useMediaQuery';

export const Chatbot = () => {
    const { diagnosis, isChatOpen, setIsChatOpen } = useDiagnosis();
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hi! I'm Potato Doc. Ask me anything about your potato crops or scan results!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { isMobile } = useBreakpoint();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            setIsChatOpen(true);
        }
    }, [diagnosis, setIsChatOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            // Determine API URL (localhost vs production)
            const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:8000/chat'
                : 'https://micti-potato-disease-classification.hf.space/chat'; // Assuming this endpoint exists on prod too

            const context = diagnosis ? (diagnosis.class || diagnosis.label || diagnosis.prediction) : null;

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

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsChatOpen(!isChatOpen)}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0, 255, 157, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    cursor: 'pointer',
                    color: 'var(--button-text-color)'
                }}
            >
                {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={{
                            position: 'fixed',
                            bottom: isMobile ? '0' : '7rem',
                            right: isMobile ? '0' : '2rem',
                            width: isMobile ? '100%' : '400px',
                            height: isMobile ? '80vh' : '600px',
                            background: 'var(--color-bg-card)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: isMobile ? '20px 20px 0 0' : '24px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 999,
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '1.5rem',
                            borderBottom: '1px solid var(--glass-border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            background: 'var(--glass-highlight)'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'rgba(0, 255, 157, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-primary)'
                            }}>
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Potato Doc AI</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)' }}></span>
                                    Online
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem'
                        }}>
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
                                        borderRadius: '50%',
                                        background: msg.role === 'user' ? 'var(--color-text-main)' : 'rgba(0, 255, 157, 0.1)',
                                        color: msg.role === 'user' ? 'var(--color-bg-main)' : 'var(--color-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                                    </div>
                                    <div style={{
                                        padding: '1rem',
                                        borderRadius: msg.role === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                                        background: msg.role === 'user' ? 'var(--color-text-main)' : 'var(--glass-bg)',
                                        color: msg.role === 'user' ? 'var(--color-bg-main)' : 'var(--color-text-main)',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.5'
                                    }}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0, 255, 157, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Sparkles size={16} color="var(--color-primary)" />
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text-muted)' }} />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text-muted)' }} />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text-muted)' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} style={{
                            padding: '1.5rem',
                            borderTop: '1px solid var(--glass-border)',
                            display: 'flex',
                            gap: '1rem'
                        }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about crop health..."
                                style={{
                                    flex: 1,
                                    background: 'var(--glass-bg)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    padding: '0.8rem 1rem',
                                    color: 'var(--color-text-main)',
                                    outline: 'none',
                                    fontSize: '0.95rem'
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                style={{
                                    background: 'var(--color-primary)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: input.trim() ? 'pointer' : 'not-allowed',
                                    opacity: input.trim() ? 1 : 0.5,
                                    color: 'var(--button-text-color)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
