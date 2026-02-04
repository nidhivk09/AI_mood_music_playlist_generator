# MoodFlow - AI-Powered Music Mood Playlist Generator

An intelligent music mood detection and playlist generation system that uses a GTZAN-trained CRNN model to classify audio genres and create personalized mood transition playlists.

## 🎯 Features

### 🎵 Audio Genre Classification
- Upload WAV, MP3, or FLAC audio files
- Real-time genre prediction using a Keras CRNN model
- Confidence scores and probability distributions for all 10 genres
- Interactive audio visualizations (mel spectrogram, waveform, chromagram)

### 📊 Audio Visualizations
- **Mel Spectrogram Heatmap** - Frequency analysis over time
- **Waveform Display** - Amplitude visualization with beat markers
- **Spectral Features** - Centroid and rolloff analysis
- **Chromagram** - Pitch class distribution
- **Tempo/BPM Detection** - Automatic beat detection

### 🧠 Mood-Based Playlist Generation
- Select current and target emotional states
- Smooth transitions between mood states
- Personalized recommendations based on preferences
- Advanced metrics: Mood Match, Flow Score, Diversity, Smoothness

### 📈 Intelligent Algorithms
- K-means clustering for mood similarity
- Euclidean distance calculations
- Linear interpolation for mood transitions
- User preference weighting

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vite + React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ MoodSelector │  │  Classifier  │  │ PlaylistCard │          │
│  │  Component   │  │     Page     │  │  Component   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                 │                  │                  │
│         └────────────────┼──────────────────┘                  │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              AudioVisualization Component               │   │
│  │  • Mel Spectrogram  • Waveform  • Chromagram           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                           │ HTTP API
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                 BACKEND (FastAPI + Python)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   /health    │  │  /classify   │  │   Librosa    │          │
│  │   Endpoint   │  │   Endpoint   │  │  Processing  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                          │                                      │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              CRNN Keras Model (.h5)                     │   │
│  │  • CNN Feature Extraction → BiLSTM → Attention → Dense │   │
│  │  • Input: (128, 130, 1) Mel Spectrogram                │   │
│  │  • Output: 10 GTZAN Genres                              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Vite** | Fast build tool and dev server |
| **React 18** | Component-based UI |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first styling |
| **Shadcn/UI** | Modern UI components |
| **Framer Motion** | Smooth animations |

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance API server |
| **Keras 3.x** | Deep learning model runtime |
| **Librosa** | Audio feature extraction |
| **NumPy** | Numerical processing |
| **Uvicorn** | ASGI server |

### Model
- **Architecture**: CRNN (Convolutional Recurrent Neural Network)
- **Dataset**: GTZAN (10 music genres)
- **Input**: Mel spectrogram (128 mel bands × 130 frames)
- **Output**: 10-class genre classification

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- The trained model file: `crnn_gtzan_model_best.h5`

### 1. Clone the Repository
```bash
git clone https://github.com/nidhivk09/AI_mood_music_playlist_generator.git
cd AI_mood_music_playlist_generator
```

### 2. Setup Backend
```bash
cd backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Add the Model File
Place your trained `crnn_gtzan_model_best.h5` file in the `backend/` directory.

> **Note:** The model file is not included in the repository due to size constraints.

### 4. Setup Frontend
```bash
cd ..  # Back to project root
npm install
```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
# Server runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# App runs on http://localhost:8080
```

## 📁 Project Structure

```
AI_mood_music_playlist_generator/
├── backend/
│   ├── main.py                   # FastAPI server
│   ├── requirements.txt          # Python dependencies
│   └── crnn_gtzan_model_best.h5  # Keras model (not in repo)
├── src/
│   ├── components/
│   │   ├── AudioVisualization.tsx  # Interactive visualizations
│   │   ├── MoodSelector.tsx        # Mood selection UI
│   │   ├── MetricsPanel.tsx        # Playlist metrics display
│   │   └── PlaylistCard.tsx        # Song card component
│   ├── lib/
│   │   ├── genreClassifier.ts      # API client for classification
│   │   ├── moodEngine.ts           # Playlist generation algorithm
│   │   └── audioProcessor.ts       # Audio utilities
│   ├── pages/
│   │   ├── Index.tsx               # Mood playlist generator
│   │   └── Classifier.tsx          # Audio classification page
│   └── data/
│       └── songs.ts                # Sample song database
└── package.json
```

## 🎮 Usage

1. **Start both servers** (backend on port 8000, frontend on port 8080)

2. **Classify Audio:**
   - Navigate to the Classifier page
   - Upload a WAV, MP3, or FLAC file
   - View genre predictions with confidence scores
   - Explore interactive visualizations

3. **Generate Playlists:**
   - Select your current mood state
   - Choose your target mood
   - Adjust preferences (genres, energy level)
   - Get a smooth transition playlist with metrics

## 🎼 Supported Genres

| Genre | Mood Mapping |
|-------|--------------|
| Blues | Melancholic, Reflective |
| Classical | Calm, Sophisticated |
| Country | Nostalgic, Storytelling |
| Disco | Energetic, Fun |
| Hip Hop | Urban, Rhythmic |
| Jazz | Relaxed, Sophisticated |
| Metal | Intense, Aggressive |
| Pop | Upbeat, Mainstream |
| Reggae | Laid-back, Positive |
| Rock | Energetic, Rebellious |

## 📊 API Endpoints

### Health Check
```
GET http://localhost:8000/health
```

### Classify Audio
```
POST http://localhost:8000/classify
Content-Type: multipart/form-data

file: <audio_file>
```

**Response:**
```json
{
  "predictions": {
    "blues": 0.05,
    "classical": 0.02,
    ...
  },
  "top_genre": "hiphop",
  "confidence": 0.45,
  "visualization_data": {
    "mel_spectrogram": [...],
    "waveform": [...],
    "tempo": 120.5,
    "beats": [...]
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
