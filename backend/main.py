"""
FastAPI Backend for GTZAN Genre Classification

This server loads the Keras model directly and exposes an API for audio classification.
"""

import os
import io
import numpy as np
import librosa
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# Suppress TF warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import keras

# Configuration
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "model", "crnn_gtzan_model_best.h5")
SAMPLE_RATE = 22050
N_MELS = 128
N_FFT = 2048
HOP_LENGTH = 512
SEGMENT_DURATION = 3  # seconds
EXPECTED_TIME_FRAMES = 130

# GTZAN genres
GTZAN_GENRES = ["blues", "classical", "country", "disco", "hiphop", "jazz", "metal", "pop", "reggae", "rock"]

# Initialize FastAPI app
app = FastAPI(title="GTZAN Genre Classifier API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variable
model = None


class GenrePrediction(BaseModel):
    genre: str
    confidence: float


class VisualizationData(BaseModel):
    melSpectrogram: List[List[float]]  # 2D array for heatmap
    waveform: List[float]  # 1D array for waveform
    spectralCentroid: List[float]  # Brightness over time
    spectralRolloff: List[float]  # Frequency rolloff over time
    rms: List[float]  # Energy over time
    tempo: float
    beats: List[float]  # Beat positions in seconds
    chromagram: List[List[float]]  # Pitch class distribution
    mfcc: List[List[float]]  # MFCCs for timbre
    timeAxis: List[float]  # Time axis for plots


class ClassificationResult(BaseModel):
    predictions: List[GenrePrediction]
    topGenre: str
    topConfidence: float
    processingTime: float
    audioInfo: dict
    visualization: VisualizationData


def load_model():
    """Load the Keras model."""
    global model
    if model is None:
        print(f"Loading model from {MODEL_PATH}...")
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
        model = keras.models.load_model(MODEL_PATH)
        print(f"Model loaded. Input shape: {model.input_shape}, Output shape: {model.output_shape}")
    return model


def extract_mel_spectrogram(audio: np.ndarray, sr: int = SAMPLE_RATE) -> np.ndarray:
    """Extract mel spectrogram from audio signal."""
    mel_spec = librosa.feature.melspectrogram(
        y=audio,
        sr=sr,
        n_mels=N_MELS,
        n_fft=N_FFT,
        hop_length=HOP_LENGTH
    )
    # Convert to log scale (dB)
    log_mel_spec = librosa.power_to_db(mel_spec, ref=np.max)
    return log_mel_spec


def pad_or_truncate(mel_spec: np.ndarray, target_frames: int = EXPECTED_TIME_FRAMES) -> np.ndarray:
    """Pad or truncate mel spectrogram to target number of frames."""
    current_frames = mel_spec.shape[1]
    
    if current_frames == target_frames:
        return mel_spec
    elif current_frames > target_frames:
        return mel_spec[:, :target_frames]
    else:
        # Pad with minimum value
        padding = np.full((mel_spec.shape[0], target_frames - current_frames), mel_spec.min())
        return np.concatenate([mel_spec, padding], axis=1)


def process_audio_file(audio_bytes: bytes) -> tuple:
    """Process audio file and return segments for classification."""
    # Load audio from bytes
    audio, sr = librosa.load(io.BytesIO(audio_bytes), sr=SAMPLE_RATE)
    duration = len(audio) / sr
    
    # Calculate segment length in samples
    segment_samples = SAMPLE_RATE * SEGMENT_DURATION
    
    # Split into segments
    segments = []
    num_segments = int(len(audio) / segment_samples)
    
    if num_segments == 0 and len(audio) >= segment_samples // 2:
        # If audio is shorter than segment but at least half, use it anyway
        num_segments = 1
    
    for i in range(max(1, num_segments)):
        start = i * segment_samples
        end = start + segment_samples
        
        if end <= len(audio):
            segment = audio[start:end]
        else:
            # Pad the last segment if needed
            segment = np.zeros(segment_samples)
            segment[:len(audio) - start] = audio[start:]
        
        segments.append(segment)
    
    return segments, duration, num_segments


def prepare_segment_for_model(segment: np.ndarray) -> np.ndarray:
    """Prepare a single audio segment for model input."""
    # Extract mel spectrogram
    mel_spec = extract_mel_spectrogram(segment)
    
    # Pad or truncate to expected frames
    mel_spec = pad_or_truncate(mel_spec, EXPECTED_TIME_FRAMES)
    
    # Reshape for model: (mel_bins, time_steps) -> (mel_bins, time_steps, 1)
    mel_spec = mel_spec[:, :, np.newaxis]
    
    return mel_spec


def extract_visualization_data(audio: np.ndarray, sr: int = SAMPLE_RATE) -> dict:
    """Extract various audio features for visualization."""
    # Downsample for visualization (reduce data size)
    hop_viz = 512
    
    # Mel spectrogram (downsampled for visualization)
    mel_spec = librosa.feature.melspectrogram(y=audio, sr=sr, n_mels=64, hop_length=hop_viz)
    mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
    
    # Downsample mel spectrogram for frontend (max 200 time frames)
    max_frames = 200
    if mel_spec_db.shape[1] > max_frames:
        indices = np.linspace(0, mel_spec_db.shape[1] - 1, max_frames, dtype=int)
        mel_spec_db = mel_spec_db[:, indices]
    
    # Waveform (downsampled)
    waveform_samples = 1000
    indices = np.linspace(0, len(audio) - 1, waveform_samples, dtype=int)
    waveform = audio[indices]
    
    # Spectral features
    spectral_centroid = librosa.feature.spectral_centroid(y=audio, sr=sr, hop_length=hop_viz)[0]
    spectral_rolloff = librosa.feature.spectral_rolloff(y=audio, sr=sr, hop_length=hop_viz)[0]
    rms = librosa.feature.rms(y=audio, hop_length=hop_viz)[0]
    
    # Downsample spectral features
    feature_samples = 100
    if len(spectral_centroid) > feature_samples:
        indices = np.linspace(0, len(spectral_centroid) - 1, feature_samples, dtype=int)
        spectral_centroid = spectral_centroid[indices]
        spectral_rolloff = spectral_rolloff[indices]
        rms = rms[indices]
    
    # Normalize spectral features for visualization
    spectral_centroid = spectral_centroid / (sr / 2)  # Normalize to 0-1
    spectral_rolloff = spectral_rolloff / (sr / 2)
    rms = rms / (np.max(rms) + 1e-8)
    
    # Tempo and beats
    tempo, beats = librosa.beat.beat_track(y=audio, sr=sr)
    beat_times = librosa.frames_to_time(beats, sr=sr)
    
    # Chromagram (pitch class)
    chromagram = librosa.feature.chroma_stft(y=audio, sr=sr, hop_length=hop_viz)
    if chromagram.shape[1] > max_frames:
        indices = np.linspace(0, chromagram.shape[1] - 1, max_frames, dtype=int)
        chromagram = chromagram[:, indices]
    
    # MFCCs (timbre)
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13, hop_length=hop_viz)
    if mfcc.shape[1] > max_frames:
        indices = np.linspace(0, mfcc.shape[1] - 1, max_frames, dtype=int)
        mfcc = mfcc[:, indices]
    
    # Time axis
    duration = len(audio) / sr
    time_axis = np.linspace(0, duration, len(spectral_centroid))
    
    return {
        "melSpectrogram": mel_spec_db.tolist(),
        "waveform": waveform.tolist(),
        "spectralCentroid": spectral_centroid.tolist(),
        "spectralRolloff": spectral_rolloff.tolist(),
        "rms": rms.tolist(),
        "tempo": float(tempo) if isinstance(tempo, (int, float, np.number)) else float(tempo[0]) if len(tempo) > 0 else 120.0,
        "beats": beat_times.tolist()[:50],  # Limit beats
        "chromagram": chromagram.tolist(),
        "mfcc": mfcc.tolist(),
        "timeAxis": time_axis.tolist()
    }


@app.on_event("startup")
async def startup_event():
    """Load model on startup."""
    try:
        load_model()
    except Exception as e:
        print(f"Warning: Could not load model on startup: {e}")


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "GTZAN Genre Classifier API", "status": "running"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    global model
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }


@app.post("/classify", response_model=ClassificationResult)
async def classify_audio(file: UploadFile = File(...)):
    """
    Classify the genre of an uploaded audio file.
    
    Accepts: WAV, MP3, OGG, FLAC audio files
    Returns: Genre predictions with confidence scores
    """
    import time
    start_time = time.time()
    
    # Validate file type
    allowed_types = ["audio/wav", "audio/mpeg", "audio/mp3", "audio/ogg", "audio/flac", "audio/x-wav"]
    content_type = file.content_type or ""
    
    if not any(t in content_type for t in ["audio", "octet-stream"]):
        # Also check file extension
        if not file.filename or not file.filename.lower().endswith(('.wav', '.mp3', '.ogg', '.flac')):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an audio file (WAV, MP3, OGG, or FLAC)")
    
    try:
        # Load model
        model = load_model()
        
        # Read file
        audio_bytes = await file.read()
        
        # Process audio
        segments, duration, num_segments = process_audio_file(audio_bytes)
        
        if num_segments == 0:
            raise HTTPException(status_code=400, detail="Audio file too short. Minimum duration is ~1.5 seconds.")
        
        # Load full audio for visualization
        full_audio, sr = librosa.load(io.BytesIO(audio_bytes), sr=SAMPLE_RATE)
        
        # Extract visualization data
        viz_data = extract_visualization_data(full_audio, sr)
        
        # Prepare all segments
        segment_inputs = []
        for segment in segments:
            mel_input = prepare_segment_for_model(segment)
            segment_inputs.append(mel_input)
        
        # Stack into batch
        batch_input = np.stack(segment_inputs, axis=0)
        
        # Run inference
        predictions = model.predict(batch_input, verbose=0)
        
        # Average predictions across segments
        avg_predictions = np.mean(predictions, axis=0)
        
        # Create result
        genre_predictions = []
        for i, genre in enumerate(GTZAN_GENRES):
            genre_predictions.append(GenrePrediction(
                genre=genre,
                confidence=float(avg_predictions[i])
            ))
        
        # Sort by confidence
        genre_predictions.sort(key=lambda x: x.confidence, reverse=True)
        
        processing_time = time.time() - start_time
        
        return ClassificationResult(
            predictions=genre_predictions,
            topGenre=genre_predictions[0].genre,
            topConfidence=genre_predictions[0].confidence,
            processingTime=processing_time * 1000,  # Convert to ms
            audioInfo={
                "duration": duration,
                "numSegments": num_segments,
                "sampleRate": SAMPLE_RATE
            },
            visualization=VisualizationData(**viz_data)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Classification error: {e}")
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
