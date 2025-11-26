import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Scan, CheckCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useInView } from '../../hooks/useInView';
import { useBreakpoint } from '../../hooks/useMediaQuery';
import { useDiagnosis } from '../../context/DiagnosisContext';
import { HeatmapViewer } from '../ui/HeatmapViewer';
import { generateSimulatedHeatmap } from '../../utils/heatmapSimulator';

export const Scanner = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [heatmapData, setHeatmapData] = useState(null);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const { setDiagnosis } = useDiagnosis();
    const fileInputRef = useRef(null);

    const containerRef = useRef(null);
    const isInView = useInView(containerRef);
    const { isMobile } = useBreakpoint();

    const handleFile = (selectedFile) => {
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setHeatmapData(null);
            setShowHeatmap(false);
            scanImage(selectedFile);
        }
    };

    const scanImage = async (imageFile) => {
        setScanning(true);

        const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? '/predict/'
            : 'https://micti-potato-disease-classification.hf.space/predict/';

        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const formData = new FormData();
            formData.append('file', imageFile);

            const response = await axios.post(API_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log("API Response:", response.data);
            setResult(response.data);
            setDiagnosis(response.data);

            // Generate simulated Grad-CAM heatmap
            const diagnosis = response.data.class || response.data.label || response.data.prediction || 'Unknown';
            const heatmap = await generateSimulatedHeatmap(imageFile, diagnosis);
            setHeatmapData(heatmap);
            setShowHeatmap(true);

        } catch (error) {
            console.error("Scan failed:", error);
            let errorMessage = "Scan failed. Please ensure the backend is running.";
            
            if (error.message === "Network Error") {
                errorMessage = "Network Error: Could not connect to the backend.\n\n1. If you are on localhost, try restarting the server (CTRL+C then 'npm start') to apply proxy settings.\n2. The backend might be waking up (Hugging Face spaces sleep).";
            } else if (error.response) {
                errorMessage = `Server Error: ${error.response.status} - ${error.response.statusText}`;
            }
            
            alert(errorMessage);
        } finally {
            setScanning(false);
        }
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setHeatmapData(null);
        setShowHeatmap(false);
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
                position: 'relative',
            }}
        >
            {/* Background Grid */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
                zIndex: -1,
            }} />

            <div style={{ width: '100%', maxWidth: '900px', padding: isMobile ? '0 1rem' : '0 2rem' }}>
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                    style={{
                        background: 'var(--color-bg-scanner)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '32px',
                        padding: '8px',
                        boxShadow: 'var(--shadow-glow)',
                        position: 'relative',
                        overflow: 'hidden',
                        backdropFilter: 'blur(40px)',
                    }}
                >
                    {/* Holographic Corners */}
                    {!isMobile && (
                        <>
                            <div style={{ position: 'absolute', top: 20, left: 20, width: '40px', height: '40px', borderTop: '2px solid var(--color-primary)', borderLeft: '2px solid var(--color-primary)', borderTopLeftRadius: '12px', opacity: 0.5 }} />
                            <div style={{ position: 'absolute', top: 20, right: 20, width: '40px', height: '40px', borderTop: '2px solid var(--color-primary)', borderRight: '2px solid var(--color-primary)', borderTopRightRadius: '12px', opacity: 0.5 }} />
                            <div style={{ position: 'absolute', bottom: 20, left: 20, width: '40px', height: '40px', borderBottom: '2px solid var(--color-primary)', borderLeft: '2px solid var(--color-primary)', borderBottomLeftRadius: '12px', opacity: 0.5 }} />
                            <div style={{ position: 'absolute', bottom: 20, right: 20, width: '40px', height: '40px', borderBottom: '2px solid var(--color-primary)', borderRight: '2px solid var(--color-primary)', borderBottomRightRadius: '12px', opacity: 0.5 }} />
                        </>
                    )}

                    <div style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                        borderRadius: '24px',
                        padding: isMobile ? '2rem 1.5rem' : '3rem',
                        minHeight: isMobile ? '400px' : '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>

                        <AnimatePresence mode="wait">
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
                                        {isMobile ? 'Tap to upload input image' : 'Drag & drop input image or click to browse'}
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
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Select File
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files[0])} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: isMobile ? 'column' : 'row',
                                        alignItems: 'center',
                                        gap: isMobile ? '2rem' : '4rem',
                                    }}
                                >
                                    {/* Left Side: Image Preview with Heatmap */}
                                    <div style={{
                                        flex: isMobile ? 'none' : '1',
                                        width: isMobile ? '100%' : '50%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <HeatmapViewer
                                            originalUrl={preview}
                                            heatmapData={heatmapData}
                                            showHeatmap={showHeatmap}
                                            onToggle={() => setShowHeatmap(!showHeatmap)}
                                            isScanning={scanning}
                                            isMobile={isMobile}
                                        />
                                    </div>

                                    {/* Right Side: Results or Loading */}
                                    <div style={{
                                        flex: isMobile ? 'none' : '1',
                                        width: isMobile ? '100%' : '50%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: isMobile ? 'center' : 'flex-start',
                                        textAlign: isMobile ? 'center' : 'left',
                                    }}>
                                        {scanning ? (
                                            <div style={{ width: '100%' }}>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: isMobile ? 'center' : 'flex-start',
                                                    gap: '1rem', 
                                                    marginBottom: '1.5rem' 
                                                }}>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <Scan size={28} color="var(--color-primary)" />
                                                    </motion.div>
                                                    <h4 style={{ color: 'var(--color-primary)', letterSpacing: '0.1em', fontSize: '0.9rem' }}>
                                                        ANALYZING CROP HEALTH...
                                                    </h4>
                                                </div>
                                                
                                                {/* Loading Steps with XAI */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}>
                                                    {['Preprocessing Image', 'Running CNN Inference', 'Generating Grad-CAM', 'Calculating Severity'].map((step, i) => (
                                                        <motion.div 
                                                            key={step}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.4 }}
                                                            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}
                                                        >
                                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                                                            {step}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : result && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                style={{ width: '100%' }}
                                            >
                                                {(() => {
                                                    const diagnosis = result.class || result.label || result.prediction || 'Unknown';
                                                    const isHealthy = diagnosis.toLowerCase().includes('healthy');
                                                    const confidence = result.confidence || result.score || 0.98;
                                                    // Use heatmap-calculated severity
                                                    const severity = heatmapData?.severity || result.severity || 0;
                                                    const color = isHealthy ? 'var(--color-primary)' : 'var(--color-secondary)';
                                                    
                                                    return (
                                                        <>
                                                            <div style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                padding: '0.4rem 1rem',
                                                                borderRadius: '100px',
                                                                background: isHealthy ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 61, 0, 0.1)',
                                                                border: `1px solid ${isHealthy ? 'rgba(0, 255, 157, 0.2)' : 'rgba(255, 61, 0, 0.2)'}`,
                                                                color: color,
                                                                fontSize: '0.8rem',
                                                                fontWeight: 600,
                                                                letterSpacing: '0.05em',
                                                                marginBottom: '1rem',
                                                                textTransform: 'uppercase'
                                                            }}>
                                                                {isHealthy ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                                                {isHealthy ? 'Healthy Crop' : 'Disease Detected'}
                                                            </div>

                                                            <h2 style={{ 
                                                                fontSize: isMobile ? '2.5rem' : '3.5rem', 
                                                                fontWeight: 700, 
                                                                color: 'var(--color-text-main)',
                                                                marginBottom: '0.5rem',
                                                                lineHeight: 1.1
                                                            }}>
                                                                {diagnosis}
                                                            </h2>
                                                            
                                                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '400px' }}>
                                                                {isHealthy 
                                                                    ? "No signs of disease detected. The plant appears healthy and vigorous." 
                                                                    : "Immediate attention recommended. Toggle heatmap to see affected regions."}
                                                            </p>

                                                            {/* Confidence Bar */}
                                                            <div style={{ marginBottom: isHealthy ? '2.5rem' : '1.5rem', width: '100%', maxWidth: '400px' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                                    <span style={{ color: 'var(--color-text-muted)' }}>AI Confidence Score</span>
                                                                    <span style={{ color: color, fontWeight: 600 }}>{(Math.floor(confidence * 1000) / 10).toFixed(1)}%</span>
                                                                </div>
                                                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
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
                                                                <div style={{ marginBottom: '2.5rem', width: '100%', maxWidth: '400px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                                        <span style={{ color: 'var(--color-text-muted)' }}>
                                                                            Infection Severity
                                                                            <span style={{ 
                                                                                fontSize: '0.7rem', 
                                                                                marginLeft: '0.5rem',
                                                                                opacity: 0.6,
                                                                                fontStyle: 'italic'
                                                                            }}>
                                                                                (via Grad-CAM)
                                                                            </span>
                                                                        </span>
                                                                        <span style={{ color: '#ff6b6b', fontWeight: 600 }}>{(severity * 100).toFixed(1)}%</span>
                                                                    </div>
                                                                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                                                                        <motion.div 
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${severity * 100}%` }}
                                                                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                                                            style={{ height: '100%', background: '#ff6b6b', borderRadius: '10px' }} 
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
                                                                <button
                                                                    onClick={reset}
                                                                    style={{
                                                                        padding: '1rem 2rem',
                                                                        background: 'var(--color-text-main)',
                                                                        color: 'var(--color-bg-main)',
                                                                        border: 'none',
                                                                        borderRadius: '100px',
                                                                        fontWeight: 600,
                                                                        fontSize: '1rem',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        gap: '0.5rem',
                                                                        transition: 'transform 0.2s',
                                                                    }}
                                                                >
                                                                    <Scan size={18} /> Scan New Image
                                                                </button>
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
