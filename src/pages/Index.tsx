import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoodType, moodPoints } from "@/data/songs";
import { MoodSelector } from "@/components/MoodSelector";
import { PreferencesPanel } from "@/components/PreferencesPanel";
import { PlaylistCard } from "@/components/PlaylistCard";
import { MoodGraph } from "@/components/MoodGraph";
import { MetricsPanel } from "@/components/MetricsPanel";
import { Documentation } from "@/components/Documentation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  generateMoodPlaylist,
  getDefaultPreferences,
  UserPreferences,
  PlaylistResult,
} from "@/lib/moodEngine";
import {
  Music,
  Sparkles,
  ArrowRight,
  ListMusic,
  RefreshCw,
  Wand2,
} from "lucide-react";

const Index = () => {
  const [currentMood, setCurrentMood] = useState<MoodType | null>(null);
  const [targetMood, setTargetMood] = useState<MoodType | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(
    getDefaultPreferences()
  );
  const [playlistLength, setPlaylistLength] = useState(8);
  const [playlist, setPlaylist] = useState<PlaylistResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const canGenerate = currentMood !== null && targetMood !== null;

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    // Simulate processing time for effect
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = generateMoodPlaylist(
      currentMood!,
      targetMood!,
      preferences,
      playlistLength
    );
    setPlaylist(result);
    setIsGenerating(false);
  };

  const handleReset = () => {
    setCurrentMood(null);
    setTargetMood(null);
    setPlaylist(null);
  };

  return (
    <div className="min-h-screen hero-section">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold gradient-text">
                MoodFlow
              </h1>
              <p className="text-xs text-muted-foreground">
                AI-Powered Mood Transitions
              </p>
            </div>
          </div>
          {playlist && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Start Over
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!playlist ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4 py-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
                  <Sparkles className="w-4 h-4" />
                  ML-Powered Emotional Journey
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold">
                  Transform Your{" "}
                  <span className="gradient-text">Emotional State</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Select your current mood and where you want to be. Our algorithm
                  creates a personalized playlist that smoothly transitions your
                  emotions through carefully selected songs.
                </p>
              </motion.div>

              {/* Mood Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-8 space-y-8"
              >
                <MoodSelector
                  label="How are you feeling right now?"
                  selectedMood={currentMood}
                  onSelect={setCurrentMood}
                />

                {currentMood && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center justify-center py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{moodPoints[currentMood].emoji}</div>
                      <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
                      <div className="text-4xl">
                        {targetMood ? moodPoints[targetMood].emoji : "❓"}
                      </div>
                    </div>
                  </motion.div>
                )}

                <MoodSelector
                  label="Where do you want to be?"
                  selectedMood={targetMood}
                  onSelect={setTargetMood}
                />
              </motion.div>

              {/* Preferences */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <PreferencesPanel
                  preferences={preferences}
                  onUpdate={setPreferences}
                />
              </motion.div>

              {/* Playlist Length Slider */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ListMusic className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Playlist Length</h3>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {playlistLength} songs
                  </span>
                </div>
                <Slider
                  value={[playlistLength]}
                  onValueChange={([value]) => setPlaylistLength(value)}
                  min={4}
                  max={12}
                  step={1}
                  className="py-4"
                />
                <p className="text-sm text-muted-foreground">
                  More songs = smoother transitions, fewer songs = faster journey
                </p>
              </motion.div>

              {/* Generate Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center"
              >
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={!canGenerate || isGenerating}
                  className="gap-2 px-8 py-6 text-lg glow-effect"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate Mood Journey
                    </>
                  )}
                </Button>
              </motion.div>

              {!canGenerate && (
                <p className="text-center text-sm text-muted-foreground">
                  Select both your current and target mood to generate a playlist
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Results Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2"
              >
                <div className="flex items-center justify-center gap-4 text-4xl">
                  <span>{moodPoints[currentMood!].emoji}</span>
                  <ArrowRight className="w-8 h-8 text-primary" />
                  <span>{moodPoints[targetMood!].emoji}</span>
                </div>
                <h2 className="text-2xl font-display font-bold">
                  Your{" "}
                  <span className="gradient-text">
                    {moodPoints[currentMood!].label} to {moodPoints[targetMood!].label}
                  </span>{" "}
                  Journey
                </h2>
                <p className="text-muted-foreground">
                  {playlist.songs.length} songs curated for your emotional
                  transition
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Playlist */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ListMusic className="w-5 h-5 text-primary" />
                    Your Playlist
                  </h3>
                  <div className="space-y-6">
                    {playlist.songs.map((song, index) => (
                      <PlaylistCard
                        key={song.id}
                        song={song}
                        index={index}
                        isFirst={index === 0}
                        isLast={index === playlist.songs.length - 1}
                      />
                    ))}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <MetricsPanel metrics={playlist.metrics} />
                  <MoodGraph songs={playlist.songs} moodPath={playlist.moodPath} />
                </div>
              </div>

              {/* Documentation */}
              <Documentation />

              {/* Generate Another */}
              <div className="flex justify-center pt-8">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Create Another Journey
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p>
          MoodFlow - AI/ML Laboratory Project | GTZAN Dataset + CRNN Model
        </p>
        <p className="mt-2">
          Using CRNN for Genre Classification, Valence-Arousal Model & K-Means Clustering
        </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
