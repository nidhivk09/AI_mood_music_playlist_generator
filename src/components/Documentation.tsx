import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, Code, Lightbulb, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const sections: DocSection[] = [
  {
    id: "problem",
    icon: <Lightbulb className="w-5 h-5" />,
    title: "Problem Statement",
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          Music has a profound impact on our emotional state. However, abrupt transitions 
          between songs with vastly different emotional qualities can be jarring.
        </p>
        <p>
          <strong className="text-foreground">Challenge:</strong> Create a system that generates 
          personalized playlists which smoothly transition a listener from their current 
          emotional state to a desired target mood.
        </p>
        <p>
          <strong className="text-foreground">Solution:</strong> MoodFlow uses a CRNN model trained 
          on the GTZAN dataset for genre classification, combined with the Valence-Arousal model 
          for mood-based song selection.
        </p>
      </div>
    ),
  },
  {
    id: "dataset",
    icon: <BookOpen className="w-5 h-5" />,
    title: "GTZAN Dataset & CRNN Model",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">GTZAN Dataset</h4>
          <p>1000 audio tracks (30s each) across 10 genres: Blues, Classical, Country, Disco, Hip-Hop, Jazz, Metal, Pop, Reggae, Rock.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">CRNN Architecture</h4>
          <code className="block bg-muted p-2 rounded text-xs whitespace-pre">
{`Input: Mel-spectrogram (128 × T × 1)
↓ Conv2D (64) + BatchNorm + ReLU + MaxPool
↓ Conv2D (128) + BatchNorm + ReLU + MaxPool
↓ Conv2D (256) + BatchNorm + ReLU + MaxPool
↓ Bidirectional LSTM (128 units)
↓ Dense (64) + Dropout (0.3)
↓ Dense (10) + Softmax
Output: 10-class genre probabilities`}
          </code>
          <p className="mt-2">Achieves ~85-90% accuracy on GTZAN test set.</p>
        </div>
      </div>
    ),
  },
  {
    id: "approach",
    icon: <Code className="w-5 h-5" />,
    title: "ML Approach",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">1. Genre Classification (CRNN)</h4>
          <p>Songs are classified into 10 GTZAN genres with confidence scores using a Convolutional Recurrent Neural Network.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">2. Mood Representation (Valence-Arousal)</h4>
          <p>Each mood maps to 2D space: Valence (sad→happy) and Arousal (calm→energetic).</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">3. Song Scoring Algorithm</h4>
          <code className="block bg-muted p-2 rounded mt-2 text-xs whitespace-pre">
{`score = (mood_similarity × 0.6) + 
        (genre_match × crnn_confidence × 0.2) + 
        (artist_preference × 0.15) + 
        (liked_song × 0.05)`}
          </code>
        </div>
      </div>
    ),
  },
  {
    id: "algorithms",
    icon: <BookOpen className="w-5 h-5" />,
    title: "Algorithms Used",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <div className="grid gap-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-foreground">CRNN (Convolutional Recurrent Neural Network)</h4>
            <p className="mt-1">CNN for spectral features + LSTM for temporal patterns in genre classification.</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-foreground">K-Means Clustering</h4>
            <p className="mt-1">Groups songs by valence/energy values into mood clusters.</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-foreground">Euclidean Distance</h4>
            <p className="mt-1">d = √[(v₁-v₂)² + (a₁-a₂)²] for mood similarity.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "future",
    icon: <Rocket className="w-5 h-5" />,
    title: "Future Enhancements",
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <ul className="space-y-2">
          <li>• <strong className="text-foreground">Real-time CRNN inference</strong> with audio input</li>
          <li>• <strong className="text-foreground">Spotify API Integration</strong> for real audio features</li>
          <li>• <strong className="text-foreground">Transformer models</strong> for improved temporal modeling</li>
          <li>• <strong className="text-foreground">Attention mechanisms</strong> for interpretable classification</li>
        </ul>
      </div>
    ),
  },
];
export function Documentation() {
  const [openSection, setOpenSection] = useState<string | null>("problem");

  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        Documentation
      </h3>

      <div className="space-y-2">
        {sections.map((section) => (
          <div key={section.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() =>
                setOpenSection(openSection === section.id ? null : section.id)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-primary">{section.icon}</div>
                <span className="font-medium">{section.title}</span>
              </div>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform",
                  openSection === section.id && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {openSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 border-t border-border">
                    {section.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
