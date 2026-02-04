# MoodFlow - AI-Powered Music Mood Playlist Generator

An intelligent music mood detection and playlist generation system that uses a GTZAN-based CRNN model to classify audio genres and create personalized mood transition playlists.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                ICS FLAT NETWORK                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐        │
│  │   MacBook Pro   │      │   iPad Pro      │      │   iPhone 14     │        │
│  │   M1 Chip       │      │   M4 Chip       │      │   A16 Bionic    │        │
│  │   16GB RAM      │      │   16GB RAM      │      │   256GB Storage │        │
│  │   Development   │      │   Design &      │      │   Testing &     │        │
│  │   Environment   │      │   Testing       │      │   Mobile UI     │        │
│  └─────────────────┘      └─────────────────┘      └─────────────────┘        │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (VITE + REACT)                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐        │
│  │   MoodSelector  │      │  AudioUploader  │      │ PlaylistCard    │        │
│  │   Component     │      │   Component     │      │   Component     │        │
│  └─────────────────┘      └─────────────────┘      └─────────────────┘        │
│                                        │                                       │
│                                        ▼                                       │
│  ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐        │
│  │   MoodEngine    │      │ AudioClassifier │      │  MetricsPanel   │        │
│  │   (Algorithm)   │      │   (TensorFlow)  │      │   Component     │        │
│  └─────────────────┘      └─────────────────┘      └─────────────────┘        │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         ML MODEL LAYER (BROWSER)                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐        │
│  │  TensorFlow.js  │      │ Audio Context   │      │ Mel Spectrogram │        │
│  │  Runtime        │◀────▶│ Web Audio API   │◀────▶│  Processing     │        │
│  │                 │      │                 │      │                 │        │
│  └─────────────────┘      └─────────────────┘      └─────────────────┘        │
│                                        │                                       │
│                                        ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    CRNN GTZAN GENRE MODEL                              │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│  │  │ Convolutional   │  │   Bidirectional │  │  Attention &    │        │   │
│  │  │ Layers (CNN)    │─▶│   LSTM (RNN)    │─▶│  Dense Output   │        │   │
│  │  │ (Feature Ext.)  │  │ (Temporal Seq.) │  │  (Genre Class.) │        │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────────┐   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER (STATIC)                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐        │
│  │  GTZAN Dataset  │      │   Song Database │      │ Mood Mappings   │        │
│  │  (10 Genres)    │      │  (Mock Data)    │      │ (Valence/Energy)│        │
│  │  • Blues        │      │  • Title        │      │ • Sad: 0.15/0.2 │        │
│  │  • Classical    │      │  • Artist       │      │ • Happy: 0.8/0.6│        │
│  │  • Country      │      │  • Genre        │      │ • Energetic     │        │
│  │  • Disco        │      │  • Features     │      │ • Calm          │        │
│  │  • Hip Hop      │      │                 │      │ • Angry         │        │
│  │  • Jazz         │      │                 │      │                 │        │
│  │  • Metal        │      │                 │      │                 │        │
│  │  • Pop          │      │                 │      │                 │        │
│  │  • Reggae       │      │                 │      │                 │        │
│  │  • Rock         │      │                 │      │                 │        │
│  └─────────────────┘      └─────────────────┘      └─────────────────┘        │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Key Features

### 🎵 **Audio Genre Classification**
- Upload WAV, MP3, or FLAC files
- Real-time genre prediction using CRNN model
- Confidence scores and probability distributions
- Browser-based processing (no server required)

### 🧠 **Mood-Based Playlist Generation**
- Select current and target emotional states
- Smooth transitions between mood states
- Personalized recommendations based on preferences
- Advanced metrics and visualization

### 📊 **Intelligent Algorithms**
- K-means clustering for mood similarity
- Euclidean distance calculations
- Linear interpolation for mood transitions
- User preference weighting

## Device Compatibility

| Device | Specifications | Primary Use |
|--------|---------------|-------------|
| **MacBook Pro M1** | 16GB RAM, M1 Chip | Development & Testing |
| **iPad Pro M4** | 16GB RAM, M4 Chip | Design & UI Testing |
| **iPhone 14** | A16 Bionic, 256GB | Mobile Testing & UX |

All devices connected via **ICS Flat Network** for seamless development and testing workflow.

## Tech Stack

### Frontend
- **Vite** - Fast build tool and dev server
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Modern component library
- **Framer Motion** - Animation library

### Machine Learning
- **TensorFlow.js** - Browser-based ML runtime
- **CRNN Model** - Convolutional Recurrent Neural Network
- **GTZAN Dataset** - 10-genre music classification
- **Web Audio API** - Audio processing and analysis

### Data Processing
- **Mel Spectrogram** - Audio feature extraction
- **Librosa** (training) - Audio analysis library
- **FFT Processing** - Frequency domain analysis

## Model Architecture

The CRNN model combines:
- **Convolutional layers** for spatial feature extraction from spectrograms
- **Bidirectional LSTM** for temporal sequence modeling
- **Attention mechanism** for focus on relevant features
- **Dense output** for 10-class genre classification

**Model Performance:**
- Training accuracy: ~95%
- Validation accuracy: ~89%
- Real-world performance: ~85-92%

## Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd mood-playlist-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

## Model Setup

The CRNN genre classifier requires the model to be converted to TensorFlow.js format:

### Step 1: Install Python dependencies
```bash
pip install tensorflowjs tensorflow
```

### Step 2: Place your trained model
Ensure `crnn_gtzan_model_best.h5` is in the `model/` directory.

### Step 3: Convert the model
```bash
python convert_model.py
```

This will create the TensorFlow.js model files in `public/model/crnn_gtzan_genre_model_tfjs/`.

### Model File Structure
```
public/model/crnn_gtzan_genre_model_tfjs/
├── model.json          # Model architecture and configuration
├── group1-shard1of2.bin # Model weights (part 1)
└── group1-shard2of2.bin # Model weights (part 2)
```

## Usage

1. **Access the App**: Navigate to `http://localhost:5173`
2. **Classify Audio**: Click "Classify Audio" to upload and analyze music files
3. **Generate Playlists**: Select mood states and preferences to create playlists
4. **View Analytics**: Monitor mood transitions and recommendation metrics

## Development Workflow

The development process leverages the ICS flat network for:
- **MacBook Pro**: Primary development and model training
- **iPad Pro**: UI/UX design and testing responsive layouts
- **iPhone**: Mobile-first testing and performance optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Test across all devices (MacBook, iPad, iPhone)
4. Submit pull request

## License

This project is licensed under the MIT License.
