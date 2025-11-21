import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Processing } from './Processing';
import { ResultCard } from './ResultCard';

export const ImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);

            // Auto upload logic could go here, but let's wait for user to confirm or just show preview first
            // Actually, for better UX, let's auto-analyze on drop/select
            uploadImage(file);
        }
    };

    const uploadImage = async (file) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('http://localhost:8000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Simulate a small delay for the "scanning" effect if the API is too fast
            setTimeout(() => {
                setResult(response.data);
                setLoading(false);
            }, 1500);

        } catch (error) {
            console.error('Error uploading image:', error);
            setLoading(false);
            alert('Failed to analyze image. Please try again.');
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const reset = () => {
        setSelectedFile(null);
        setPreview(null);
        setResult(null);
        setLoading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="upload-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {loading && <Processing image={preview} />}

            {!preview ? (
                <div
                    className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                    />
                    <svg className="upload-icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        Upload Plant Photo
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Drag & drop or click to browse
                    </p>
                </div>
            ) : (
                <div className="preview-container">
                    {!result && !loading && (
                        <button className="clear-btn" onClick={reset} title="Remove image">
                            ✕
                        </button>
                    )}
                    <img src={preview} alt="Preview" className="preview-img" />
                </div>
            )}

            {result && <ResultCard result={result} onReset={reset} />}
        </div>
    );
};
