/**
 * Audio Processor for GTZAN CRNN Model
 * 
 * Extracts mel spectrograms from audio files to match the training pipeline:
 * - Sample Rate: 22050 Hz
 * - N_MELS: 128
 * - N_FFT: 2048
 * - HOP_LENGTH: 512
 * - Segment Duration: 3 seconds
 * - Expected time frames: 130 (from model input shape)
 */

// Constants matching training configuration
export const SAMPLE_RATE = 22050;
export const N_MELS = 128;
export const N_FFT = 2048;
export const HOP_LENGTH = 512;
export const SEGMENT_DURATION = 3; // seconds
export const SAMPLES_PER_SEGMENT = SAMPLE_RATE * SEGMENT_DURATION;
export const EXPECTED_TIME_FRAMES = 130; // From model input shape [null, 128, 130, 1]

// Mel filterbank frequencies
const MEL_F_MIN = 0;
const MEL_F_MAX = SAMPLE_RATE / 2;

/**
 * Convert frequency to Mel scale
 */
function hzToMel(hz: number): number {
  return 2595 * Math.log10(1 + hz / 700);
}

/**
 * Convert Mel scale to frequency
 */
function melToHz(mel: number): number {
  return 700 * (Math.pow(10, mel / 2595) - 1);
}

/**
 * Create mel filterbank matrix
 */
function createMelFilterbank(
  nMels: number,
  nFft: number,
  sampleRate: number,
  fMin: number = MEL_F_MIN,
  fMax: number = MEL_F_MAX
): Float32Array[] {
  const nFreqs = Math.floor(nFft / 2) + 1;
  const melMin = hzToMel(fMin);
  const melMax = hzToMel(fMax);
  
  // Create mel points
  const melPoints = new Float32Array(nMels + 2);
  for (let i = 0; i < nMels + 2; i++) {
    melPoints[i] = melMin + (i * (melMax - melMin)) / (nMels + 1);
  }
  
  // Convert to Hz and then to FFT bin indices
  const hzPoints = melPoints.map(mel => melToHz(mel));
  const binPoints = hzPoints.map(hz => Math.floor((nFft + 1) * hz / sampleRate));
  
  // Create filterbank
  const filterbank: Float32Array[] = [];
  
  for (let m = 1; m <= nMels; m++) {
    const filter = new Float32Array(nFreqs);
    const left = binPoints[m - 1];
    const center = binPoints[m];
    const right = binPoints[m + 1];
    
    for (let k = left; k < center; k++) {
      if (k >= 0 && k < nFreqs) {
        filter[k] = (k - left) / (center - left);
      }
    }
    
    for (let k = center; k <= right; k++) {
      if (k >= 0 && k < nFreqs) {
        filter[k] = (right - k) / (right - center);
      }
    }
    
    filterbank.push(filter);
  }
  
  return filterbank;
}

/**
 * Apply Hann window to signal
 */
function applyHannWindow(signal: Float32Array): Float32Array {
  const n = signal.length;
  const windowed = new Float32Array(n);
  
  for (let i = 0; i < n; i++) {
    const window = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
    windowed[i] = signal[i] * window;
  }
  
  return windowed;
}

/**
 * Compute FFT using the Web Audio API AnalyserNode approach
 * This is a simplified DFT for mel spectrogram computation
 */
function computeFFT(signal: Float32Array): { real: Float32Array; imag: Float32Array } {
  const n = signal.length;
  const real = new Float32Array(n);
  const imag = new Float32Array(n);
  
  for (let k = 0; k < n; k++) {
    let sumReal = 0;
    let sumImag = 0;
    
    for (let t = 0; t < n; t++) {
      const angle = (2 * Math.PI * k * t) / n;
      sumReal += signal[t] * Math.cos(angle);
      sumImag -= signal[t] * Math.sin(angle);
    }
    
    real[k] = sumReal;
    imag[k] = sumImag;
  }
  
  return { real, imag };
}

/**
 * Fast Fourier Transform (Cooley-Tukey algorithm)
 */
function fft(real: Float32Array, imag: Float32Array): void {
  const n = real.length;
  
  if (n <= 1) return;
  
  // Bit-reversal permutation
  let j = 0;
  for (let i = 0; i < n - 1; i++) {
    if (i < j) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }
    let k = n >> 1;
    while (k <= j) {
      j -= k;
      k >>= 1;
    }
    j += k;
  }
  
  // Cooley-Tukey FFT
  for (let len = 2; len <= n; len <<= 1) {
    const halfLen = len >> 1;
    const angle = (2 * Math.PI) / len;
    
    for (let i = 0; i < n; i += len) {
      for (let k = 0; k < halfLen; k++) {
        const thetaReal = Math.cos(angle * k);
        const thetaImag = -Math.sin(angle * k);
        
        const evenIdx = i + k;
        const oddIdx = i + k + halfLen;
        
        const tReal = real[oddIdx] * thetaReal - imag[oddIdx] * thetaImag;
        const tImag = real[oddIdx] * thetaImag + imag[oddIdx] * thetaReal;
        
        real[oddIdx] = real[evenIdx] - tReal;
        imag[oddIdx] = imag[evenIdx] - tImag;
        real[evenIdx] += tReal;
        imag[evenIdx] += tImag;
      }
    }
  }
}

/**
 * Compute power spectrum from FFT
 */
function computePowerSpectrum(real: Float32Array, imag: Float32Array): Float32Array {
  const n = Math.floor(real.length / 2) + 1;
  const power = new Float32Array(n);
  
  for (let i = 0; i < n; i++) {
    power[i] = real[i] * real[i] + imag[i] * imag[i];
  }
  
  return power;
}

/**
 * Extract mel spectrogram from audio signal
 */
export function extractMelSpectrogram(
  signal: Float32Array,
  sampleRate: number = SAMPLE_RATE,
  nMels: number = N_MELS,
  nFft: number = N_FFT,
  hopLength: number = HOP_LENGTH
): Float32Array[] {
  const filterbank = createMelFilterbank(nMels, nFft, sampleRate);
  const numFrames = Math.floor((signal.length - nFft) / hopLength) + 1;
  const melSpectrogram: Float32Array[] = [];
  
  for (let frame = 0; frame < numFrames; frame++) {
    const start = frame * hopLength;
    const end = start + nFft;
    
    // Extract frame and apply window
    const frameSignal = signal.slice(start, end);
    
    // Pad if necessary
    const paddedFrame = new Float32Array(nFft);
    paddedFrame.set(frameSignal);
    
    const windowedFrame = applyHannWindow(paddedFrame);
    
    // Compute FFT
    const real = new Float32Array(nFft);
    const imag = new Float32Array(nFft);
    real.set(windowedFrame);
    
    fft(real, imag);
    
    // Compute power spectrum
    const powerSpectrum = computePowerSpectrum(real, imag);
    
    // Apply mel filterbank
    const melFrame = new Float32Array(nMels);
    for (let m = 0; m < nMels; m++) {
      let sum = 0;
      for (let k = 0; k < powerSpectrum.length; k++) {
        sum += powerSpectrum[k] * filterbank[m][k];
      }
      melFrame[m] = sum;
    }
    
    melSpectrogram.push(melFrame);
  }
  
  return melSpectrogram;
}

/**
 * Convert power spectrogram to dB scale (log mel spectrogram)
 */
export function powerToDb(
  melSpectrogram: Float32Array[],
  refValue: number = 1.0,
  amin: number = 1e-10,
  topDb: number = 80.0
): Float32Array[] {
  // Find max value for reference
  let maxVal = 0;
  for (const frame of melSpectrogram) {
    for (let i = 0; i < frame.length; i++) {
      if (frame[i] > maxVal) maxVal = frame[i];
    }
  }
  
  const ref = Math.max(maxVal, amin);
  
  const logMelSpectrogram: Float32Array[] = [];
  
  for (const frame of melSpectrogram) {
    const logFrame = new Float32Array(frame.length);
    
    for (let i = 0; i < frame.length; i++) {
      const val = Math.max(frame[i], amin);
      logFrame[i] = 10 * Math.log10(val / ref);
    }
    
    logMelSpectrogram.push(logFrame);
  }
  
  // Apply top_db threshold
  let minDb = 0;
  for (const frame of logMelSpectrogram) {
    for (let i = 0; i < frame.length; i++) {
      if (frame[i] < minDb) minDb = frame[i];
    }
  }
  
  const threshold = -topDb;
  for (const frame of logMelSpectrogram) {
    for (let i = 0; i < frame.length; i++) {
      if (frame[i] < threshold) {
        frame[i] = threshold;
      }
    }
  }
  
  return logMelSpectrogram;
}

/**
 * Resample audio to target sample rate using linear interpolation
 */
export function resampleAudio(
  audioData: Float32Array,
  originalSampleRate: number,
  targetSampleRate: number
): Float32Array {
  if (originalSampleRate === targetSampleRate) {
    return audioData;
  }
  
  const ratio = originalSampleRate / targetSampleRate;
  const newLength = Math.floor(audioData.length / ratio);
  const resampled = new Float32Array(newLength);
  
  for (let i = 0; i < newLength; i++) {
    const srcIdx = i * ratio;
    const srcIdxFloor = Math.floor(srcIdx);
    const srcIdxCeil = Math.min(srcIdxFloor + 1, audioData.length - 1);
    const frac = srcIdx - srcIdxFloor;
    
    resampled[i] = audioData[srcIdxFloor] * (1 - frac) + audioData[srcIdxCeil] * frac;
  }
  
  return resampled;
}

/**
 * Load and process audio file for the CRNN model
 */
export async function processAudioFile(file: File): Promise<{
  segments: Float32Array[];
  sampleRate: number;
  duration: number;
}> {
  const audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
  
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  
  // Decode audio
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  // Get audio data (mono - average channels if stereo)
  let audioData: Float32Array;
  if (audioBuffer.numberOfChannels === 1) {
    audioData = audioBuffer.getChannelData(0);
  } else {
    const channel0 = audioBuffer.getChannelData(0);
    const channel1 = audioBuffer.getChannelData(1);
    audioData = new Float32Array(channel0.length);
    for (let i = 0; i < channel0.length; i++) {
      audioData[i] = (channel0[i] + channel1[i]) / 2;
    }
  }
  
  // Resample if necessary
  const resampledData = resampleAudio(audioData, audioBuffer.sampleRate, SAMPLE_RATE);
  
  // Extract segments
  const segments: Float32Array[] = [];
  const numSegments = Math.floor(resampledData.length / SAMPLES_PER_SEGMENT);
  
  for (let i = 0; i < numSegments; i++) {
    const start = i * SAMPLES_PER_SEGMENT;
    const end = start + SAMPLES_PER_SEGMENT;
    const segment = resampledData.slice(start, end);
    
    if (segment.length === SAMPLES_PER_SEGMENT) {
      segments.push(segment);
    }
  }
  
  await audioContext.close();
  
  return {
    segments,
    sampleRate: SAMPLE_RATE,
    duration: resampledData.length / SAMPLE_RATE
  };
}

/**
 * Convert mel spectrogram to tensor format for model input
 * 
 * Training shape: (batch, mel_bins, time_steps, 1)
 * For 3-second segment: (1, 128, ~126, 1)
 * 
 * melSpectrogram from extractMelSpectrogram comes as:
 *   Array of frames, each frame has N_MELS values
 *   i.e., shape (time_steps, mel_bins)
 * 
 * We need to transpose to (mel_bins, time_steps, 1)
 */
export function melSpectrogramToTensor(
  melSpectrogram: Float32Array[]
): number[][][] {
  const numFrames = melSpectrogram.length;
  const numMels = melSpectrogram[0]?.length || N_MELS;
  
  // Create 3D array: (mel_bins, time_steps, 1)
  // Transpose from (time, mel) to (mel, time, 1)
  const tensor: number[][][] = [];
  
  for (let m = 0; m < numMels; m++) {
    const melRow: number[][] = [];
    for (let t = 0; t < numFrames; t++) {
      melRow.push([melSpectrogram[t][m]]);
    }
    tensor.push(melRow);
  }
  
  return tensor;
}

/**
 * Get expected time frames for a segment
 */
export function getExpectedTimeFrames(): number {
  return Math.floor((SAMPLES_PER_SEGMENT - N_FFT) / HOP_LENGTH) + 1;
}

/**
 * Process a single audio segment for model input
 */
export function processSegmentForModel(segment: Float32Array): number[][][] {
  // Extract mel spectrogram
  const melSpec = extractMelSpectrogram(segment);
  
  // Convert to log scale (dB)
  const logMelSpec = powerToDb(melSpec);
  
  // Pad or truncate to match expected time frames (130)
  const paddedSpec = padOrTruncateTimeFrames(logMelSpec, EXPECTED_TIME_FRAMES);
  
  // Convert to tensor format
  return melSpectrogramToTensor(paddedSpec);
}

/**
 * Pad or truncate mel spectrogram to exact number of time frames
 */
function padOrTruncateTimeFrames(
  melSpectrogram: Float32Array[],
  targetFrames: number
): Float32Array[] {
  const currentFrames = melSpectrogram.length;
  const numMels = melSpectrogram[0]?.length || N_MELS;
  
  if (currentFrames === targetFrames) {
    return melSpectrogram;
  }
  
  if (currentFrames > targetFrames) {
    // Truncate
    return melSpectrogram.slice(0, targetFrames);
  }
  
  // Pad with zeros (or min value)
  const result = [...melSpectrogram];
  const minValue = -80; // typical min dB value
  
  for (let i = currentFrames; i < targetFrames; i++) {
    const paddedFrame = new Float32Array(numMels);
    paddedFrame.fill(minValue);
    result.push(paddedFrame);
  }
  
  return result;
}

export interface ProcessedAudio {
  tensorData: number[][][][];
  numSegments: number;
  duration: number;
}

/**
 * Full pipeline: Load audio file and prepare all segments for model
 */
export async function prepareAudioForModel(file: File): Promise<ProcessedAudio> {
  const { segments, duration } = await processAudioFile(file);
  
  const tensorData: number[][][][] = [];
  
  for (const segment of segments) {
    const tensor = processSegmentForModel(segment);
    tensorData.push(tensor);
  }
  
  return {
    tensorData,
    numSegments: segments.length,
    duration
  };
}
