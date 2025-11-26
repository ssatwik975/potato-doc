import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

export const HeatmapViewer = ({ 
    originalUrl, 
    heatmapData, 
    showHeatmap, 
    onToggle, 
    isScanning,
    isMobile 
}) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            width: '100%',
        }}>
            {/* Image Container */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '350px',
                aspectRatio: '1',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid var(--glass-border)',
                boxShadow: isScanning 
                    ? '0 0 40px -10px var(--color-primary-dim)' 
                    : '0 8px 32px rgba(0,0,0,0.3)',
                transition: 'all 0.5s ease',
                background: '#000',
            }}>
                {showHeatmap && heatmapData ? (
                    <ReactCompareSlider
                        itemOne={<ReactCompareSliderImage src={originalUrl} alt="Original Image" />}
                        itemTwo={<ReactCompareSliderImage src={heatmapData.heatmapUrl} alt="Heatmap Analysis" />}
                        style={{ width: '100%', height: '100%' }}
                    />
                ) : (
                    <img 
                        src={originalUrl} 
                        alt="Original" 
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover', 
                            display: 'block'
                        }} 
                    />
                )}

                {/* Scanning Line Animation */}
                {isScanning && (
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
                            boxShadow: '0 0 20px var(--color-primary)',
                            zIndex: 10,
                        }}
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    />
                )}
                
                {/* Grid Overlay */}
                <div style={{
                    position: 'absolute', 
                    inset: 0,
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '25px 25px',
                    pointerEvents: 'none',
                    zIndex: 5
                }} />

                {/* Color Scale Legend */}
                <AnimatePresence>
                    {showHeatmap && heatmapData && !isMobile && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '3px',
                                background: 'rgba(0,0,0,0.8)',
                                backdropFilter: 'blur(10px)',
                                padding: '8px 6px',
                                borderRadius: '6px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                zIndex: 25
                            }}
                        >
                            <span style={{ fontSize: '0.55rem', color: '#ff4444', fontWeight: 700 }}>HIGH</span>
                            <div style={{
                                width: '10px',
                                height: '60px',
                                borderRadius: '3px',
                                background: 'linear-gradient(to bottom, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff)',
                            }} />
                            <span style={{ fontSize: '0.55rem', color: '#4444ff', fontWeight: 700 }}>LOW</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Toggle Button */}
            {heatmapData && !isScanning && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={onToggle}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1.2rem',
                        background: showHeatmap 
                            ? 'linear-gradient(135deg, var(--color-primary), #00cc7a)' 
                            : 'rgba(255,255,255,0.08)',
                        border: `1px solid ${showHeatmap ? 'transparent' : 'var(--color-primary)'}`,
                        color: showHeatmap ? '#0a0a0a' : 'var(--color-primary)',
                        borderRadius: '100px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: showHeatmap ? '0 4px 20px rgba(0, 255, 157, 0.3)' : 'none',
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    {showHeatmap ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
                </motion.button>
            )}
        </div>
    );
};

export default HeatmapViewer;