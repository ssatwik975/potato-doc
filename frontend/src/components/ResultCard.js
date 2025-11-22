import React from 'react';

export const ResultCard = ({ result, onReset }) => {
    const { class: condition, confidence } = result;
    const isHealthy = condition === 'Healthy';
    const confidencePercent = (confidence * 100).toFixed(1);

    return (
        <div className="result-card animate-slide-up">
            <div className="result-header">
                <div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Analysis Result</h3>
                    <div className={`disease-tag ${isHealthy ? 'tag-healthy' : 'tag-disease'}`}>
                        {condition}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Confidence</span>
                    <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>{confidencePercent}%</div>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span>Reliability Score</span>
                </div>
                <div className="confidence-meter">
                    <div
                        className="confidence-fill"
                        style={{
                            width: `${confidencePercent}%`,
                            backgroundColor: isHealthy ? 'var(--status-healthy)' : 'var(--secondary-main)'
                        }}
                    ></div>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Recommendation</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {isHealthy
                        ? "Your plant looks healthy! Keep monitoring for any changes in leaf color or texture. Ensure proper watering and sunlight."
                        : `Signs of ${condition} detected. Isolate the affected plant immediately to prevent spread. Consult a local agricultural extension for specific fungicide treatments.`
                    }
                </p>
            </div>

            <button
                onClick={onReset}
                style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--surface-off-white)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#eee'}
                onMouseOut={(e) => e.target.style.background = 'var(--surface-off-white)'}
            >
                Analyze Another Image
            </button>
        </div>
    );
};
