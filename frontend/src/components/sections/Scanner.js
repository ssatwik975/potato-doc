import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle, AlertTriangle, Loader, Scan, Image as ImageIcon, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Scanner = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
            setError(null);
            scanImage(file);
        } else {
            setError('Please upload a valid image file (JPG, PNG)');
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const scanImage = async (file) => {
        setLoading(true);
        setError(null);

        // FIX: Changed http to https to resolve Mixed Content error
        const API_URL = 'https://micti-potato-disease-classification.hf.space'; 
        
        // Debugging: This will show up in Console (F12) if the new code is running
        console.log("Attempting to connect to:", API_URL);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_URL}/predict`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data);
        } catch (err) {
            console.error("Scan failed:", err);
            
            let errorMessage = 'Failed to analyze image. Please try again.';
            
            if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
                errorMessage = `Cannot connect to backend at ${API_URL}. Please check if the server is running and supports CORS.`;
            } else if (err.response && err.response.status === 405) {
                errorMessage = 'Method Not Allowed. The backend might be rejecting the request type.';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        setSelectedFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <section id="diagnosis" style={{ 
            minHeight: '100vh', 
            background: 'var(--color-bg-primary)', 
            padding: isMobile ? '4rem 1rem' : '6rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Elements */}
            <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, #1a2e25 0%, transparent 70%)', opacity: 0.5, pointerEvents: 'none' }} />
            
            {/* FIX: Gradient masks to blend edges seamlessly into the background color */}
            <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '150px', 
                background: 'linear-gradient(to top, transparent, var(--color-bg-primary))', 
                pointerEvents: 'none', 
                zIndex: 0 
            }} />
            <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                width: '100%', 
                height: '150px', 
                background: 'linear-gradient(to bottom, transparent, var(--color-bg-primary))', 
                pointerEvents: 'none', 
                zIndex: 0 
            }} />

            <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'var(--color-primary)', filter: 'blur(150px)', opacity: 0.05, borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '200px', height: '200px', background: 'var(--color-secondary)', filter: 'blur(120px)', opacity: 0.05, borderRadius: '50%' }} />

            <div style={{ 
                width: '100%', 
                maxWidth: '1200px', 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: '4rem',
                alignItems: 'start',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Left Side - Upload Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 style={{ 
                        fontSize: isMobile ? '2.5rem' : '3.5rem', 
                        marginBottom: '1.5rem',
                        lineHeight: 1.1,
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #ffffff 0%, #a5d6a7 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        AI Plant<br />Diagnostics
                    </h2>
                    <p style={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        marginBottom: '2.5rem', 
                        fontSize: '1.1rem',
                        lineHeight: '1.6',
                        maxWidth: '90%'
                    }}>
                        Advanced computer vision to detect Early Blight, Late Blight, and assess infection severity in seconds.
                    </p>

                    <motion.div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        whileHover={{ scale: 1.01, borderColor: 'var(--color-primary)' }}
                        whileTap={{ scale: 0.99 }}
                        style={{
                            border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)'}`,
                            borderRadius: '24px',
                            padding: '0',
                            textAlign: 'center',
                            background: isDragging ? 'rgba(0, 255, 157, 0.05)' : 'rgba(255,255,255,0.03)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            minHeight: '320px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                        }}
                        onClick={() => !preview && fileInputRef.current.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleFile(e.target.files[0])}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />

                        <AnimatePresence mode='wait'>
                            {preview ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ width: '100%', height: '100%', position: 'relative' }}
                                >
                                    <img 
                                        src={preview} 
                                        alt="Preview" 
                                        style={{ 
                                            width: '100%', 
                                            height: '320px', 
                                            objectFit: 'cover',
                                            borderRadius: '22px'
                                        }} 
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)'
                                    }} />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resetScanner();
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '15px',
                                            right: '15px',
                                            background: 'rgba(0,0,0,0.6)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '50%',
                                            width: '36px',
                                            height: '36px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: 'white',
                                            backdropFilter: 'blur(4px)'
                                        }}
                                    >
                                        <X size={18} />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    style={{ padding: '2rem' }}
                                >
                                    <div style={{ 
                                        width: '80px', 
                                        height: '80px', 
                                        background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.1), rgba(0, 255, 157, 0.05))', 
                                        borderRadius: '24px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        margin: '0 auto 1.5rem',
                                        border: '1px solid rgba(0, 255, 157, 0.2)'
                                    }}>
                                        <Upload size={32} color="var(--color-primary)" />
                                    </div>
                                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                                        Upload Leaf Image
                                    </h3>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                                        Drag & drop or click to browse
                                    </p>
                                    <div style={{ 
                                        display: 'inline-flex', 
                                        alignItems: 'center', 
                                        gap: '0.5rem', 
                                        padding: '0.5rem 1rem', 
                                        background: 'rgba(255,255,255,0.05)', 
                                        borderRadius: '100px',
                                        fontSize: '0.8rem',
                                        color: 'rgba(255,255,255,0.6)'
                                    }}>
                                        <ImageIcon size={14} />
                                        <span>Supports JPG, PNG</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {loading && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(10, 10, 10, 0.85)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backdropFilter: 'blur(8px)',
                                borderRadius: '22px'
                            }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    <Scan size={56} color="var(--color-primary)" />
                                </motion.div>
                                <p style={{ marginTop: '1.5rem', color: 'var(--color-primary)', fontWeight: 600, letterSpacing: '0.05em' }}>ANALYZING...</p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>

                {/* Right Side - Results Panel */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ 
                        minHeight: '400px', 
                        display: 'flex', 
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '30px',
                        padding: '3rem',
                        position: 'relative'
                    }}
                >
                    <AnimatePresence mode='wait'>
                        {error ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ width: '100%' }}
                            >
                                <div style={{ 
                                    background: 'rgba(255, 99, 99, 0.1)', 
                                    padding: '1.5rem', 
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255, 99, 99, 0.2)',
                                    display: 'flex',
                                    alignItems: 'start',
                                    gap: '1rem'
                                }}>
                                    <AlertTriangle color="#ff6363" style={{ marginTop: '2px' }} />
                                    <div>
                                        <h3 style={{ color: '#ff6363', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Analysis Failed</h3>
                                        <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.95rem' }}>{error}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : result ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ width: '100%' }}
                            >
                                {(() => {
                                    const diagnosis = result.class || result.prediction || 'Unknown';
                                    const isHealthy = diagnosis.toLowerCase().includes('healthy');
                                    const confidence = result.confidence !== undefined ? result.confidence : 0.95;
                                    const severity = result.severity !== undefined ? result.severity : 0;
                                    const color = isHealthy ? 'var(--color-primary)' : '#ff6b6b';
                                    
                                    return (
                                        <>
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem 1rem',
                                                background: isHealthy ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                                                borderRadius: '100px',
                                                marginBottom: '2rem',
                                                border: `1px solid ${isHealthy ? 'rgba(0, 255, 157, 0.3)' : 'rgba(255, 107, 107, 0.3)'}`
                                            }}>
                                                {isHealthy ? <CheckCircle size={16} color={color} /> : <AlertTriangle size={16} color={color} />}
                                                <span style={{ color: color, fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                                    {isHealthy ? 'Healthy Crop' : 'Disease Detected'}
                                                </span>
                                            </div>

                                            <h2 style={{ 
                                                fontSize: isMobile ? '2rem' : '2.8rem', 
                                                color: 'white',
                                                marginBottom: '1rem',
                                                lineHeight: 1.1,
                                                fontWeight: 700
                                            }}>
                                                {diagnosis}
                                            </h2>
                                            
                                            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                                                {isHealthy 
                                                    ? "No signs of disease detected. The plant appears healthy and vigorous." 
                                                    : "Immediate attention recommended. Isolate affected plants to prevent spread."}
                                            </p>

                                            {/* Stats Grid */}
                                            <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                                {/* Confidence Bar */}
                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>AI Confidence</span>
                                                        <span style={{ color: color, fontWeight: 600 }}>{(confidence * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${confidence * 100}%` }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            style={{ height: '100%', background: color, borderRadius: '10px' }} 
                                                        />
                                                    </div>
                                                </div>

                                                {/* Severity Bar (Only show if diseased) */}
                                                {!isHealthy && (
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Infection Severity</span>
                                                            <span style={{ color: '#ff6b6b', fontWeight: 600 }}>{(severity * 100).toFixed(1)}%</span>
                                                        </div>
                                                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${severity * 100}%` }}
                                                                transition={{ duration: 1, ease: "easeOut" }}
                                                                style={{ height: '100%', background: '#ff6b6b', borderRadius: '10px' }} 
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <button 
                                                onClick={resetScanner}
                                                style={{
                                                    padding: '1rem 2rem',
                                                    background: 'white',
                                                    color: 'black',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    transition: 'transform 0.2s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                Scan Another Plant <ArrowRight size={18} />
                                            </button>
                                        </>
                                    );
                                })()}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0.4
                                }}
                            >
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    border: '2px dashed rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem'
                                }}>
                                    <Scan size={40} color="white" />
                                </div>
                                <h3 style={{ color: 'white', marginBottom: '0.5rem', fontWeight: 500 }}>System Ready</h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                                    Waiting for image input...
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export { Scanner };
export default Scanner;
