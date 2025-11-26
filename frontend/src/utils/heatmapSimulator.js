/**
 * Enhanced Grad-CAM Simulation v4
 * Full heatmap overlay with blue for healthy regions, red for diseased
 */

export const generateSimulatedHeatmap = (imageFile, diagnosis) => {
    return new Promise((resolve, reject) => {
        try {
            const img = new Image();
            
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    const maxSize = 600;
                    const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
                    canvas.width = Math.floor(img.width * scale);
                    canvas.height = Math.floor(img.height * scale);
                    
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    const width = canvas.width;
                    const height = canvas.height;
                    
                    const isHealthy = diagnosis.toLowerCase().includes('healthy');
                    
                    const leafMask = detectLeafRegionAdvanced(data, width, height);
                    
                    let heatmapValues;
                    if (isHealthy) {
                        heatmapValues = generateHealthyHeatmap(leafMask, width, height);
                    } else {
                        const healthyBaseline = analyzeHealthyTissue(data, leafMask, width, height);
                        
                        const colorDeviation = detectColorDeviation(data, leafMask, width, height, healthyBaseline);
                        const spotDetection = detectDiseasedSpots(data, leafMask, width, height, diagnosis);
                        const contrastMap = detectLocalContrast(data, leafMask, width, height);
                        const clusterMap = detectDiseaseCluster(data, leafMask, width, height, healthyBaseline);
                        
                        heatmapValues = combineSignalsWeighted(
                            [colorDeviation, spotDetection, contrastMap, clusterMap],
                            [0.25, 0.35, 0.15, 0.25],
                            leafMask,
                            width, height
                        );
                        
                        heatmapValues = suppressFalsePositives(heatmapValues, data, leafMask, width, height);
                    }
                    
                    heatmapValues = multiScaleSmooth(heatmapValues, width, height);
                    heatmapValues = normalizeAndEnhance(heatmapValues, leafMask);
                    
                    // Create full overlay with blue for healthy regions
                    const heatmapCanvas = createFullHeatmapOverlay(img, heatmapValues, leafMask, width, height);
                    
                    const severity = calculateSeverity(heatmapValues, leafMask, isHealthy);
                    
                    resolve({
                        heatmapUrl: heatmapCanvas.toDataURL('image/png'),
                        severity: severity,
                    });
                    
                } catch (err) {
                    console.error('Heatmap generation error:', err);
                    reject(err);
                }
            };
            
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(imageFile);
            
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * Create FULL heatmap overlay - Blue for healthy, Red for diseased
 * Similar to medical imaging Grad-CAM visualizations
 */
const createFullHeatmapOverlay = (originalImg, heatmapData, leafMask, width, height) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(originalImg, 0, 0, width, height);
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    
    for (let i = 0; i < heatmapData.length; i++) {
        const pixelIndex = i * 4;
        
        // Only apply heatmap on leaf region
        if (leafMask[i] > 0.3) {
            const activation = heatmapData[i];
            
            // Get jet/thermal colormap color (blue -> cyan -> green -> yellow -> red)
            const color = valueToJetColor(activation);
            
            // Blend with original image
            // Higher alpha for more visible heatmap
            const alpha = 0.55; // Consistent overlay strength
            
            pixels[pixelIndex] = Math.round(pixels[pixelIndex] * (1 - alpha) + color.r * alpha);
            pixels[pixelIndex + 1] = Math.round(pixels[pixelIndex + 1] * (1 - alpha) + color.g * alpha);
            pixels[pixelIndex + 2] = Math.round(pixels[pixelIndex + 2] * (1 - alpha) + color.b * alpha);
        } else {
            // Darken background slightly for contrast
            pixels[pixelIndex] = Math.round(pixels[pixelIndex] * 0.3);
            pixels[pixelIndex + 1] = Math.round(pixels[pixelIndex + 1] * 0.3);
            pixels[pixelIndex + 2] = Math.round(pixels[pixelIndex + 2] * 0.4);
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas;
};

/**
 * Jet/Thermal colormap - Blue (low) -> Cyan -> Green -> Yellow -> Red (high)
 * This matches the medical imaging style heatmaps
 */
const valueToJetColor = (value) => {
    const v = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
    
    let r, g, b;
    
    if (v < 0.125) {
        // Dark blue to blue
        const t = v / 0.125;
        r = 0;
        g = 0;
        b = 0.5 + t * 0.5;
    } else if (v < 0.375) {
        // Blue to cyan
        const t = (v - 0.125) / 0.25;
        r = 0;
        g = t;
        b = 1;
    } else if (v < 0.625) {
        // Cyan to green to yellow
        const t = (v - 0.375) / 0.25;
        r = t;
        g = 1;
        b = 1 - t;
    } else if (v < 0.875) {
        // Yellow to red
        const t = (v - 0.625) / 0.25;
        r = 1;
        g = 1 - t;
        b = 0;
    } else {
        // Red to dark red
        const t = (v - 0.875) / 0.125;
        r = 1 - t * 0.3;
        g = 0;
        b = 0;
    }
    
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};

/**
 * Advanced leaf detection using multiple color spaces
 */
const detectLeafRegionAdvanced = (data, width, height) => {
    const mask = new Float32Array(width * height);
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const pixelIndex = i / 4;
        
        const hsv = rgbToHsv(r, g, b);
        const lab = rgbToLab(r, g, b);
        
        let leafScore = 0;
        
        if (hsv.h >= 40 && hsv.h <= 160) {
            leafScore += 0.4;
            if (hsv.s > 0.15) leafScore += 0.2;
            if (hsv.v > 0.15 && hsv.v < 0.95) leafScore += 0.2;
        }
        
        if (hsv.h >= 5 && hsv.h <= 55 && hsv.s > 0.15) {
            leafScore += 0.5;
            if (hsv.v > 0.1 && hsv.v < 0.8) leafScore += 0.2;
        }
        
        if (hsv.h >= 50 && hsv.h <= 85 && hsv.s > 0.2) {
            leafScore += 0.4;
        }
        
        if (lab.a < 25 && lab.a > -50) {
            leafScore += 0.3;
        }
        
        if (hsv.v < 0.08 || hsv.v > 0.97) {
            leafScore *= 0.1;
        }
        
        if (hsv.s < 0.08 && (hsv.v < 0.3 || hsv.v > 0.7)) {
            leafScore *= 0.2;
        }
        
        mask[pixelIndex] = leafScore > 0.4 ? 1.0 : 0.0;
    }
    
    let cleaned = morphologicalOpen(mask, width, height, 2);
    cleaned = morphologicalClose(cleaned, width, height, 5);
    cleaned = fillSmallHoles(cleaned, width, height, 100);
    
    return cleaned;
};

/**
 * Analyze healthy tissue to establish baseline colors
 */
const analyzeHealthyTissue = (data, leafMask, width, height) => {
    const greenPixels = [];
    
    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        if (leafMask[pixelIndex] < 0.5) continue;
        
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const hsv = rgbToHsv(r, g, b);
        const lab = rgbToLab(r, g, b);
        
        if (hsv.h >= 60 && hsv.h <= 150 && hsv.s >= 0.2 && hsv.v >= 0.2 && hsv.v <= 0.9) {
            greenPixels.push({ r, g, b, hsv, lab });
        }
    }
    
    if (greenPixels.length < 50) {
        return {
            meanH: 100, meanS: 0.4, meanV: 0.5,
            stdH: 20, stdS: 0.15, stdV: 0.15,
            meanL: 45, meanA: -15, meanB: 25,
            stdL: 15, stdA: 10, stdB: 12
        };
    }
    
    let sumH = 0, sumS = 0, sumV = 0, sumL = 0, sumA = 0, sumB = 0;
    greenPixels.forEach(p => {
        sumH += p.hsv.h; sumS += p.hsv.s; sumV += p.hsv.v;
        sumL += p.lab.l; sumA += p.lab.a; sumB += p.lab.b;
    });
    
    const n = greenPixels.length;
    const meanH = sumH / n, meanS = sumS / n, meanV = sumV / n;
    const meanL = sumL / n, meanA = sumA / n, meanB = sumB / n;
    
    let varH = 0, varS = 0, varV = 0, varL = 0, varA = 0, varB = 0;
    greenPixels.forEach(p => {
        varH += Math.pow(p.hsv.h - meanH, 2);
        varS += Math.pow(p.hsv.s - meanS, 2);
        varV += Math.pow(p.hsv.v - meanV, 2);
        varL += Math.pow(p.lab.l - meanL, 2);
        varA += Math.pow(p.lab.a - meanA, 2);
        varB += Math.pow(p.lab.b - meanB, 2);
    });
    
    return {
        meanH, meanS, meanV,
        stdH: Math.sqrt(varH / n) || 15,
        stdS: Math.sqrt(varS / n) || 0.1,
        stdV: Math.sqrt(varV / n) || 0.1,
        meanL, meanA, meanB,
        stdL: Math.sqrt(varL / n) || 10,
        stdA: Math.sqrt(varA / n) || 8,
        stdB: Math.sqrt(varB / n) || 10
    };
};

/**
 * Detect pixels that deviate from healthy baseline
 */
const detectColorDeviation = (data, leafMask, width, height, baseline) => {
    const heatmap = new Float32Array(width * height);
    
    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        if (leafMask[pixelIndex] < 0.5) continue;
        
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const hsv = rgbToHsv(r, g, b);
        const lab = rgbToLab(r, g, b);
        
        const zH = Math.abs(hsv.h - baseline.meanH) / baseline.stdH;
        const zS = Math.abs(hsv.s - baseline.meanS) / baseline.stdS;
        const zV = Math.abs(hsv.v - baseline.meanV) / baseline.stdV;
        const zA = Math.abs(lab.a - baseline.meanA) / baseline.stdA;
        const zB = Math.abs(lab.b - baseline.meanB) / baseline.stdB;
        
        const deviation = (zH * 0.25 + zS * 0.15 + zV * 0.15 + zA * 0.3 + zB * 0.15);
        
        heatmap[pixelIndex] = Math.min(1, deviation / 3);
    }
    
    return heatmap;
};

/**
 * Detect disease spots based on specific color signatures
 */
const detectDiseasedSpots = (data, leafMask, width, height, diagnosis) => {
    const heatmap = new Float32Array(width * height);
    const diagLower = diagnosis.toLowerCase();
    
    const isEarlyBlight = diagLower.includes('early') && diagLower.includes('blight');
    const isLateBlight = diagLower.includes('late') && diagLower.includes('blight');
    
    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        if (leafMask[pixelIndex] < 0.5) continue;
        
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const hsv = rgbToHsv(r, g, b);
        const lab = rgbToLab(r, g, b);
        
        let score = 0;
        
        if (isEarlyBlight) {
            if (hsv.h >= 10 && hsv.h <= 45 && hsv.v >= 0.1 && hsv.v <= 0.4) {
                score += (0.45 - hsv.v) * 2;
            }
            if (hsv.h >= 20 && hsv.h <= 50 && hsv.s >= 0.25 && hsv.v >= 0.3 && hsv.v <= 0.65) {
                score += 0.6;
            }
            if (hsv.h >= 45 && hsv.h <= 65 && hsv.s >= 0.3 && hsv.v >= 0.5) {
                score += 0.4;
            }
            if (lab.a > 5 && lab.b > 20) {
                score += 0.3;
            }
        } else if (isLateBlight) {
            if (hsv.v >= 0.08 && hsv.v <= 0.35) {
                score += (0.4 - hsv.v) * 1.8;
            }
            if (hsv.s >= 0.1 && hsv.s <= 0.4 && hsv.h >= 15 && hsv.h <= 60) {
                score += 0.5;
            }
            if (hsv.v < 0.2 && hsv.s < 0.3) {
                score += 0.7;
            }
            if (hsv.h >= 280 || hsv.h <= 20) {
                score += 0.25;
            }
        } else {
            if (hsv.h >= 10 && hsv.h <= 50 && hsv.s >= 0.2) {
                score += 0.5;
                if (hsv.v < 0.5) score += 0.3;
            }
            if (hsv.v < 0.35 && hsv.v > 0.08) {
                score += (0.4 - hsv.v) * 1.5;
            }
            if (hsv.h >= 45 && hsv.h <= 70 && hsv.s >= 0.3) {
                score += 0.35;
            }
        }
        
        if ((hsv.h < 50 || hsv.h > 155) && leafMask[pixelIndex] > 0.5) {
            score += 0.2;
        }
        
        heatmap[pixelIndex] = Math.min(1, Math.max(0, score));
    }
    
    return heatmap;
};

/**
 * Detect local contrast anomalies
 */
const detectLocalContrast = (data, leafMask, width, height) => {
    const heatmap = new Float32Array(width * height);
    const gray = new Float32Array(width * height);
    
    for (let i = 0; i < data.length; i += 4) {
        gray[i / 4] = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
    }
    
    const windowSize = 7;
    const half = Math.floor(windowSize / 2);
    
    for (let y = half; y < height - half; y++) {
        for (let x = half; x < width - half; x++) {
            const idx = y * width + x;
            if (leafMask[idx] < 0.5) continue;
            
            let sum = 0, sumSq = 0, count = 0;
            let minVal = 1, maxVal = 0;
            
            for (let wy = -half; wy <= half; wy++) {
                for (let wx = -half; wx <= half; wx++) {
                    const nIdx = (y + wy) * width + (x + wx);
                    if (leafMask[nIdx] > 0.5) {
                        const val = gray[nIdx];
                        sum += val;
                        sumSq += val * val;
                        minVal = Math.min(minVal, val);
                        maxVal = Math.max(maxVal, val);
                        count++;
                    }
                }
            }
            
            if (count > windowSize) {
                const mean = sum / count;
                const variance = Math.max(0, (sumSq / count) - (mean * mean));
                const localContrast = maxVal - minVal;
                heatmap[idx] = Math.min(1, (Math.sqrt(variance) * 8 + localContrast * 2) / 2);
            }
        }
    }
    
    return heatmap;
};

/**
 * Cluster-based detection
 */
const detectDiseaseCluster = (data, leafMask, width, height, baseline) => {
    const heatmap = new Float32Array(width * height);
    
    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        if (leafMask[pixelIndex] < 0.5) continue;
        
        const lab = rgbToLab(data[i], data[i + 1], data[i + 2]);
        
        const dL = (lab.l - baseline.meanL) / 50;
        const dA = (lab.a - baseline.meanA) / 60;
        const dB = (lab.b - baseline.meanB) / 60;
        
        const distance = Math.sqrt(dL * dL + dA * dA + dB * dB);
        heatmap[pixelIndex] = Math.min(1, distance * 1.5);
    }
    
    return heatmap;
};

/**
 * Combine signals with spatial coherence
 */
const combineSignalsWeighted = (signals, weights, leafMask, width, height) => {
    const combined = new Float32Array(width * height);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    
    for (let i = 0; i < combined.length; i++) {
        if (leafMask[i] < 0.5) continue;
        
        let sum = 0;
        for (let j = 0; j < signals.length; j++) {
            sum += signals[j][i] * weights[j];
        }
        combined[i] = sum / totalWeight;
    }
    
    return combined;
};

/**
 * Suppress false positives
 */
const suppressFalsePositives = (heatmap, data, leafMask, width, height) => {
    const result = new Float32Array(heatmap);
    
    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        if (leafMask[pixelIndex] < 0.5) continue;
        
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const hsv = rgbToHsv(r, g, b);
        
        if (hsv.v < 0.12 && hsv.s < 0.15) {
            result[pixelIndex] *= 0.3;
        }
        
        if (hsv.h >= 80 && hsv.h <= 140 && hsv.s > 0.5 && hsv.v > 0.3) {
            result[pixelIndex] *= 0.4;
        }
        
        if (hsv.v > 0.92 && hsv.s < 0.2) {
            result[pixelIndex] *= 0.2;
        }
    }
    
    return result;
};

/**
 * Multi-scale Gaussian smoothing
 */
const multiScaleSmooth = (data, width, height) => {
    const scale1 = gaussianBlur(data, width, height, 3);
    const scale2 = gaussianBlur(data, width, height, 8);
    const scale3 = gaussianBlur(data, width, height, 15);
    
    const result = new Float32Array(data.length);
    for (let i = 0; i < result.length; i++) {
        result[i] = scale1[i] * 0.25 + scale2[i] * 0.5 + scale3[i] * 0.25;
    }
    
    return result;
};

/**
 * Normalize and enhance contrast
 */
const normalizeAndEnhance = (data, leafMask) => {
    let min = 1, max = 0;
    for (let i = 0; i < data.length; i++) {
        if (leafMask[i] > 0.5 && data[i] > 0.02) {
            min = Math.min(min, data[i]);
            max = Math.max(max, data[i]);
        }
    }
    
    if (max <= min) return data;
    
    const result = new Float32Array(data.length);
    for (let i = 0; i < data.length; i++) {
        if (leafMask[i] > 0.5) {
            let val = (data[i] - min) / (max - min);
            val = 1 / (1 + Math.exp(-6 * (val - 0.5)));
            result[i] = val;
        }
    }
    
    return result;
};

/**
 * Calculate severity
 */
const calculateSeverity = (heatmapData, leafMask, isHealthy) => {
    if (isHealthy) return 0.02 + Math.random() * 0.03;
    
    const activations = [];
    for (let i = 0; i < heatmapData.length; i++) {
        if (leafMask[i] > 0.5) {
            activations.push(heatmapData[i]);
        }
    }
    
    if (activations.length === 0) return 0;
    
    activations.sort((a, b) => a - b);
    
    const lowThreshold = 0.25;
    const midThreshold = 0.45;
    const highThreshold = 0.65;
    
    let lowCount = 0, midCount = 0, highCount = 0;
    for (const val of activations) {
        if (val > lowThreshold) lowCount++;
        if (val > midThreshold) midCount++;
        if (val > highThreshold) highCount++;
    }
    
    const n = activations.length;
    const lowPercent = lowCount / n;
    const midPercent = midCount / n;
    const highPercent = highCount / n;
    
    const top5Index = Math.floor(n * 0.95);
    let top5Sum = 0;
    for (let i = top5Index; i < n; i++) top5Sum += activations[i];
    const top5Mean = top5Sum / (n - top5Index) || 0;
    
    const severity = (
        lowPercent * 0.15 +
        midPercent * 0.25 +
        highPercent * 0.35 +
        top5Mean * 0.25
    );
    
    return Math.max(0.05, Math.min(0.95, Math.pow(severity, 0.85)));
};

// ============ UTILITY FUNCTIONS ============

const rgbToHsv = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;
    if (d !== 0) {
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
            case g: h = ((b - r) / d + 2) * 60; break;
            case b: h = ((r - g) / d + 4) * 60; break;
            default: break;
        }
    }
    return { h, s, v };
};

const rgbToLab = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    const fx = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
    const fy = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
    const fz = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
    return { l: (116 * fy) - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
};

const gaussianBlur = (data, width, height, radius) => {
    const kernel = createGaussianKernel(radius);
    const kHalf = Math.floor(kernel.length / 2);
    const temp = new Float32Array(data.length);
    const result = new Float32Array(data.length);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let sum = 0, wSum = 0;
            for (let k = 0; k < kernel.length; k++) {
                const nx = x + k - kHalf;
                if (nx >= 0 && nx < width) {
                    sum += data[y * width + nx] * kernel[k];
                    wSum += kernel[k];
                }
            }
            temp[y * width + x] = wSum > 0 ? sum / wSum : 0;
        }
    }
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let sum = 0, wSum = 0;
            for (let k = 0; k < kernel.length; k++) {
                const ny = y + k - kHalf;
                if (ny >= 0 && ny < height) {
                    sum += temp[ny * width + x] * kernel[k];
                    wSum += kernel[k];
                }
            }
            result[y * width + x] = wSum > 0 ? sum / wSum : 0;
        }
    }
    
    return result;
};

const createGaussianKernel = (radius) => {
    const size = radius * 2 + 1;
    const kernel = new Float32Array(size);
    const sigma = radius / 2.5;
    let sum = 0;
    for (let i = 0; i < size; i++) {
        const x = i - radius;
        kernel[i] = Math.exp(-(x * x) / (2 * sigma * sigma));
        sum += kernel[i];
    }
    for (let i = 0; i < size; i++) kernel[i] /= sum;
    return kernel;
};

const morphologicalOpen = (m, w, h, r) => dilate(erode(m, w, h, r), w, h, r);
const morphologicalClose = (m, w, h, r) => erode(dilate(m, w, h, r), w, h, r);

const dilate = (mask, width, height, radius) => {
    const result = new Float32Array(mask.length);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let max = 0;
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const ny = y + dy, nx = x + dx;
                    if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                        max = Math.max(max, mask[ny * width + nx]);
                    }
                }
            }
            result[y * width + x] = max;
        }
    }
    return result;
};

const erode = (mask, width, height, radius) => {
    const result = new Float32Array(mask.length);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let min = 1;
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const ny = y + dy, nx = x + dx;
                    if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                        min = Math.min(min, mask[ny * width + nx]);
                    }
                }
            }
            result[y * width + x] = min;
        }
    }
    return result;
};

const fillSmallHoles = (mask, width, height) => {
    return morphologicalClose(mask, width, height, 3);
};

const generateHealthyHeatmap = (leafMask, width, height) => {
    const heatmap = new Float32Array(width * height);
    for (let i = 0; i < heatmap.length; i++) {
        if (leafMask[i] > 0.5) {
            // Low values = blue in jet colormap
            heatmap[i] = 0.05 + Math.random() * 0.1;
        }
    }
    return heatmap;
};