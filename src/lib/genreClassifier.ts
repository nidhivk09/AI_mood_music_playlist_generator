/**
 * GTZAN CRNN Genre Classifier
 * 
 * Uses a FastAPI backend for music genre classification
 * using the CRNN model trained on the GTZAN dataset.
 */

import { GTZAN_GENRES, GTZANGenre } from '@/data/songs';

// API Configuration - Update this if your backend runs on a different port
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface GenrePrediction {
  genre: GTZANGenre;
  confidence: number;
}

export interface VisualizationData {
  melSpectrogram: number[][];
  waveform: number[];
  spectralCentroid: number[];
  spectralRolloff: number[];
  rms: number[];
  tempo: number;
  beats: number[];
  chromagram: number[][];
  mfcc: number[][];
  timeAxis: number[];
}

export interface ClassificationResult {
  predictions: GenrePrediction[];
  topGenre: GTZANGenre;
  topConfidence: number;
  segmentPredictions: GenrePrediction[][];
  processingTime: number;
  audioInfo: {
    duration: number;
    numSegments: number;
    sampleRate: number;
  };
  visualization?: VisualizationData;
}

interface APIResponse {
  predictions: { genre: string; confidence: number }[];
  topGenre: string;
  topConfidence: number;
  processingTime: number;
  audioInfo: {
    duration: number;
    numSegments: number;
    sampleRate: number;
  };
  visualization?: VisualizationData;
}

class GenreClassifier {
  private apiAvailable: boolean | null = null;
  private isChecking: boolean = false;

  /**
   * Check if the API backend is available
   */
  async checkAPI(): Promise<boolean> {
    if (this.isChecking) {
      while (this.isChecking) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.apiAvailable ?? false;
    }

    this.isChecking = true;

    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        this.apiAvailable = data.model_loaded === true;
        console.log('API backend is available, model loaded:', this.apiAvailable);
      } else {
        this.apiAvailable = false;
      }
    } catch (error) {
      console.warn('API backend not available:', error);
      this.apiAvailable = false;
    } finally {
      this.isChecking = false;
    }

    return this.apiAvailable;
  }

  /**
   * Load the model (checks API availability)
   */
  async loadModel(): Promise<void> {
    console.log('Checking API backend availability...');
    const available = await this.checkAPI();
    
    if (!available) {
      throw new Error(
        'Backend API is not available. Please start the backend server:\n' +
        'cd backend && pip install -r requirements.txt && python main.py'
      );
    }
    
    console.log('API backend is ready');
  }

  /**
   * Check if model/API is ready
   */
  isModelLoaded(): boolean {
    return this.apiAvailable === true;
  }

  /**
   * Get model loading status
   */
  getStatus(): { loaded: boolean; loading: boolean; error: Error | null } {
    return {
      loaded: this.apiAvailable === true,
      loading: this.isChecking,
      error: this.apiAvailable === false 
        ? new Error('Backend API not available') 
        : null
    };
  }

  /**
   * Classify an audio file using the backend API
   */
  async classifyAudio(file: File): Promise<ClassificationResult> {
    // Ensure API is available
    if (!this.apiAvailable) {
      await this.loadModel();
    }

    console.log('Sending audio file to backend for classification...');
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/classify`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || `Classification failed: ${response.status}`);
      }

      const data: APIResponse = await response.json();
      
      // Convert API response to ClassificationResult format
      const predictions: GenrePrediction[] = data.predictions.map(p => ({
        genre: p.genre as GTZANGenre,
        confidence: p.confidence
      }));

      return {
        predictions,
        topGenre: data.topGenre as GTZANGenre,
        topConfidence: data.topConfidence,
        segmentPredictions: [predictions], // API returns aggregated, so wrap in array
        processingTime: data.processingTime,
        audioInfo: data.audioInfo,
        visualization: data.visualization
      };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          'Cannot connect to backend. Please ensure the server is running:\n' +
          'cd backend && python main.py'
        );
      }
      throw error;
    }
  }

  /**
   * Dispose (no-op for API-based classifier)
   */
  dispose(): void {
    // Nothing to dispose for API-based classifier
  }
}

// Singleton instance
export const genreClassifier = new GenreClassifier();

/**
 * Format confidence as percentage string
 */
export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`;
}

/**
 * Get color for genre (for visualization)
 */
export function getGenreColor(genre: GTZANGenre): string {
  const colors: Record<GTZANGenre, string> = {
    blues: '#1E40AF',
    classical: '#7C3AED',
    country: '#D97706',
    disco: '#EC4899',
    hiphop: '#10B981',
    jazz: '#F59E0B',
    metal: '#6B7280',
    pop: '#EF4444',
    reggae: '#22C55E',
    rock: '#DC2626'
  };
  return colors[genre];
}

/**
 * Get emoji for genre
 */
export function getGenreEmoji(genre: GTZANGenre): string {
  const emojis: Record<GTZANGenre, string> = {
    blues: '🎸',
    classical: '🎻',
    country: '🤠',
    disco: '🕺',
    hiphop: '🎤',
    jazz: '🎷',
    metal: '🤘',
    pop: '🎵',
    reggae: '🌴',
    rock: '🎸'
  };
  return emojis[genre];
}
