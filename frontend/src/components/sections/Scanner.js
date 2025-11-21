import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Scan, CheckCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useInView } from '../../hooks/useInView';
import { useBreakpoint } from '../../hooks/useMediaQuery';

export const Scanner = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    const containerRef = useRef(null);
    const isInView = useInView(containerRef);
    const { isMobile } = useBreakpoint();

    const handleFile = (selectedFile) => {
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            scanImage(selectedFile);
        }
    };

    const scanImage = async (imageFile) => {
        setScanning(true);

        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const formData = new FormData();
            formData.append('file', imageFile);

            const response = await axios.post('http://localhost:8000/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setResult(response.data);
        } catch (error) {
            console.error("Scan failed:", error);
            alert("Scan failed. Please ensure the backend is running on port 8000.");
        } finally {
            setScanning(false);
        }
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setScanning(false);
    };

    return (
        <section
            id="diagnosis"
            style={{
                padding: isMobile ? '4rem 0' : 'var(--section-spacing) 0',
                minHeight: isMobile ? 'auto' : '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div style={{ width: '100%', maxWidth: '800px', padding: isMobile ? '0 1rem' : '0 2rem' }}>
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    style={{
                        background: 'var(--color-bg-card)',
                        border: '1px solid var(--color-primary-dim)',
                        borderRadius: isMobile ? '16px' : '24px',
                        padding: '4px',
                        boxShadow: '0 0 40px rgba(0, 255, 157, 0.1)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Holographic Corners */}
                    {!isMobile && (
                        <>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', borderTop: '2px solid var(--color-primary)', borderLeft: '2px solid var(--color-primary)', borderTopLeftRadius: '20px' }} />
                            <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', borderTop: '2px solid var(--color-primary)', borderRight: '2px solid var(--color-primary)', borderTopRightRadius: '20px' }} />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '40px', borderBottom: '2px solid var(--color-primary)', borderLeft: '2px solid var(--color-primary)', borderBottomLeftRadius: '20px' }} />
                            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px', borderBottom: '2px solid var(--color-primary)', borderRight: '2px solid var(--color-primary)', borderBottomRightRadius: '20px' }} />
                        </>
                    )}

                    <div style={{
                        background: 'var(--color-bg-dark)',
                        borderRadius: isMobile ? '12px' : '20px',
                        padding: isMobile ? '2rem 1.5rem' : '3rem',
                        minHeight: isMobile ? '400px' : '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>

                        <AnimatePresence>
                            {!file ? (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ textAlign: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
                                    }}
                                >
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Upload size={isMobile ? 48 : 64} color="var(--color-primary)" style={{ opacity: 0.8, marginBottom: '2rem' }} />
                                    </motion.div>

                                    <h3 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '1rem' }}>Initiate Scan</h3>
                                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                        {isMobile ? 'Tap to upload sample' : 'Drag & drop biological sample or click to browse'}
                                    </p>

                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        style={{
                                            padding: isMobile ? '0.8rem 2rem' : '1rem 3rem',
                                            background: 'rgba(0, 255, 157, 0.1)',
                                            border: '1px solid var(--color-primary)',
                                            color: 'var(--color-primary)',
                                            borderRadius: '2rem',
                                            fontSize: isMobile ? '0.9rem' : '1rem',
                                            fontWeight: 600,
                                            transition: 'all 0.3s',
                                        }}
                                    >
                                        Select File
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files[0])} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                >
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        maxWidth: isMobile ? '300px' : '400px',
                                        aspectRatio: '1',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        marginBottom: '2rem',
                                        border: '1px solid var(--glass-border)'
                                    }}>
                                        <img src={preview} alt="Sample" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                                        {scanning && (
                                            <motion.div
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '4px',
                                                    background: 'var(--color-primary)',
                                                    boxShadow: '0 0 20px var(--color-primary)',
                                                    zIndex: 10,
                                                }}
                                                animate={{ top: ['0%', '100%', '0%'] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            />
                                        )}

                                        {!isMobile && (
                                            <div style={{
                                                position: 'absolute', inset: 0,
                                                backgroundImage: 'linear-gradient(var(--glass-border) 1px, transparent 1px), linear-gradient(90deg, var(--glass-border) 1px, transparent 1px)',
                                                backgroundSize: '40px 40px',
                                                opacity: 0.3,
                                                pointerEvents: 'none',
                                            }} />
                                        )}
                                    </div>

                                    {scanning ? (
                                        <div style={{ textAlign: 'center' }}>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                style={{ display: 'inline-block', marginBottom: '1rem' }}
                                            >
                                                <Scan size={32} color="var(--color-primary)" />
                                            </motion.div>
                                            <h4 style={{ color: 'var(--color-primary)', letterSpacing: '0.1em', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                                ANALYZING TISSUE STRUCTURE...
                                            </h4>
                                        </div>
                                    ) : result && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{ textAlign: 'center', width: '100%' }}
                                        >
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                padding: isMobile ? '0.8rem 1.5rem' : '1rem 2rem',
                                                background: result.class === 'Healthy' ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 61, 0, 0.1)',
                                                border: `1px solid ${result.class === 'Healthy' ? 'var(--color-primary)' : 'var(--color-secondary)'}`,
                                                borderRadius: '16px',
                                                marginBottom: '2rem',
                                                flexWrap: 'wrap',
                                                justifyContent: 'center',
                                            }}>
                                                {result.class === 'Healthy' ? <CheckCircle color="var(--color-primary)" size={isMobile ? 20 : 24} /> : <AlertTriangle color="var(--color-secondary)" size={isMobile ? 20 : 24} />}
                                                <span style={{
                                                    fontSize: isMobile ? '1.2rem' : '1.5rem',
                                                    fontWeight: 700,
                                                    color: result.class === 'Healthy' ? 'var(--color-primary)' : 'var(--color-secondary)'
                                                }}>
                                                    {result.class.toUpperCase()}
                                                </span>
                                                <span style={{
                                                    fontSize: isMobile ? '0.85rem' : '1rem',
                                                    color: 'var(--color-text-muted)',
                                                    borderLeft: isMobile ? 'none' : '1px solid var(--glass-border)',
                                                    paddingLeft: isMobile ? '0' : '1rem',
                                                    width: isMobile ? '100%' : 'auto',
                                                    marginTop: isMobile ? '0.5rem' : '0',
                                                }}>
                                                    {(result.confidence * 100).toFixed(1)}% CONFIDENCE
                                                </span>
                                            </div>

                                            <button
                                                onClick={reset}
                                                style={{
                                                    padding: isMobile ? '0.7rem 1.5rem' : '0.8rem 2rem',
                                                    background: 'var(--glass-highlight)',
                                                    border: 'none',
                                                    borderRadius: '2rem',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    fontSize: isMobile ? '0.9rem' : '1rem',
                                                }}
                                            >
                                                New Scan
                                            </button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
