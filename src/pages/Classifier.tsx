import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  genreClassifier,
  ClassificationResult,
  formatConfidence,
  getGenreColor,
  getGenreEmoji,
} from "@/lib/genreClassifier";
import { GTZAN_GENRES, GTZANGenre } from "@/data/songs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Music,
  Upload,
  Loader2,
  Brain,
  BarChart3,
  Clock,
  FileAudio,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Waves,
  Sparkles,
  Activity,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AudioVisualization } from "@/components/AudioVisualization";

type ClassifierStatus = "idle" | "loading-model" | "processing" | "complete" | "error";

const Classifier = () => {
  const [status, setStatus] = useState<ClassifierStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Load model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        setStatus("loading-model");
        await genreClassifier.loadModel();
        setModelLoaded(true);
        setStatus("idle");
      } catch (err) {
        console.error("Failed to load model:", err);
        setError("Failed to load the classification model. Please ensure the model files are in the correct location.");
        setStatus("error");
      }
    };

    if (!genreClassifier.isModelLoaded()) {
      loadModel();
    } else {
      setModelLoaded(true);
    }
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file type
    const validTypes = ["audio/wav", "audio/mpeg", "audio/mp3", "audio/ogg", "audio/flac"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|mp3|ogg|flac)$/i)) {
      setError("Please upload a valid audio file (WAV, MP3, OGG, or FLAC)");
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResult(null);
    setStatus("processing");

    try {
      const classificationResult = await genreClassifier.classifyAudio(file);
      setResult(classificationResult);
      setStatus("complete");
    } catch (err) {
      console.error("Classification error:", err);
      setError(err instanceof Error ? err.message : "Failed to classify audio");
      setStatus("error");
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  }, [handleFileSelect]);

  const resetClassifier = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setStatus(modelLoaded ? "idle" : "loading-model");
  };

  return (
    <div className="min-h-screen hero-section">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
                <Music className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold gradient-text">
                  MoodFlow
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI Genre Classifier
                </p>
              </div>
            </Link>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Playlist
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 py-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
              <Brain className="w-4 h-4" />
              CRNN Deep Learning Model
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Music <span className="gradient-text">Genre Classifier</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload any audio file and our CRNN neural network trained on the GTZAN dataset
              will identify its genre from 10 categories with confidence scores.
            </p>
          </motion.div>

          {/* Model Status */}
          {status === "loading-model" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertTitle>Loading Model</AlertTitle>
                <AlertDescription>
                  Loading the CRNN genre classification model. This may take a moment...
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Upload Section - Always show unless processing or showing results */}
          <AnimatePresence mode="wait">
            {status !== "processing" && status !== "complete" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileAudio className="w-5 h-5" />
                      Upload Audio File
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`
                        relative border-2 border-dashed rounded-xl p-12
                        transition-colors duration-200 cursor-pointer
                        ${dragActive 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50 hover:bg-primary/5"
                        }
                      `}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("file-input")?.click()}
                    >
                      <input
                        id="file-input"
                        type="file"
                        accept="audio/*,.wav,.mp3,.ogg,.flac"
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-medium">
                            Drop your audio file here
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            or click to browse (WAV, MP3, OGG, FLAC)
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Waves className="w-4 h-4" />
                          Minimum 3 seconds required for classification
                        </div>
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Processing State */}
            {status === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="glass-panel">
                  <CardContent className="py-12">
                    <div className="flex flex-col items-center gap-6 text-center">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                          <Brain className="w-10 h-10 text-primary animate-pulse" />
                        </div>
                        <div className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-ping" />
                      </div>
                      <div>
                        <p className="text-xl font-medium">Analyzing Audio</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedFile?.name}
                        </p>
                      </div>
                      <div className="w-full max-w-xs space-y-2">
                        <Progress value={undefined} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Extracting mel spectrograms and running neural network inference...
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Results */}
            {status === "complete" && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Top Result Card */}
                <Card className="glass-panel overflow-hidden">
                  <div 
                    className="h-2" 
                    style={{ backgroundColor: getGenreColor(result.topGenre) }}
                  />
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                          style={{ backgroundColor: `${getGenreColor(result.topGenre)}20` }}
                        >
                          {getGenreEmoji(result.topGenre)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-muted-foreground">Classification Complete</span>
                          </div>
                          <h3 className="text-3xl font-bold capitalize mt-1">
                            {result.topGenre}
                          </h3>
                          <p className="text-lg text-muted-foreground">
                            {formatConfidence(result.topConfidence)} confidence
                          </p>
                        </div>
                      </div>
                      <Button onClick={resetClassifier} variant="outline" className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        Classify Another
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Results */}
                <Tabs defaultValue="visualizations" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="visualizations" className="gap-2">
                      <Activity className="w-4 h-4" />
                      Visualizations
                    </TabsTrigger>
                    <TabsTrigger value="predictions" className="gap-2">
                      <BarChart3 className="w-4 h-4" />
                      All Genres
                    </TabsTrigger>
                    <TabsTrigger value="segments" className="gap-2">
                      <Waves className="w-4 h-4" />
                      Segments
                    </TabsTrigger>
                    <TabsTrigger value="info" className="gap-2">
                      <Clock className="w-4 h-4" />
                      Details
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="visualizations" className="mt-4">
                    {result.visualization ? (
                      <AudioVisualization data={result.visualization} duration={result.audioInfo.duration} />
                    ) : (
                      <Card className="glass-panel">
                        <CardContent className="py-12 text-center">
                          <p className="text-muted-foreground">
                            Visualization data not available
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="predictions" className="mt-4">
                    <Card className="glass-panel">
                      <CardHeader>
                        <CardTitle className="text-lg">Genre Confidence Scores</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result.predictions.map((pred, idx) => (
                          <motion.div
                            key={pred.genre}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getGenreEmoji(pred.genre)}</span>
                                <span className="font-medium capitalize">{pred.genre}</span>
                                {idx === 0 && (
                                  <Badge variant="default" className="ml-2">Top Pick</Badge>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatConfidence(pred.confidence)}
                              </span>
                            </div>
                            <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pred.confidence * 100}%` }}
                                transition={{ delay: idx * 0.05, duration: 0.5 }}
                                className="absolute inset-y-0 left-0 rounded-full"
                                style={{ backgroundColor: getGenreColor(pred.genre) }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="segments" className="mt-4">
                    <Card className="glass-panel">
                      <CardHeader>
                        <CardTitle className="text-lg">Per-Segment Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {result.segmentPredictions.map((segPred, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              className="p-4 rounded-lg border bg-card text-center"
                            >
                              <div className="text-xs text-muted-foreground mb-2">
                                Segment {idx + 1}
                              </div>
                              <div className="text-2xl mb-1">
                                {getGenreEmoji(segPred[0].genre)}
                              </div>
                              <div className="text-sm font-medium capitalize">
                                {segPred[0].genre}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatConfidence(segPred[0].confidence)}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="info" className="mt-4">
                    <Card className="glass-panel">
                      <CardHeader>
                        <CardTitle className="text-lg">Processing Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <div className="text-sm text-muted-foreground">File</div>
                            <div className="font-medium truncate" title={selectedFile?.name}>
                              {selectedFile?.name}
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <div className="text-sm text-muted-foreground">Duration</div>
                            <div className="font-medium">
                              {result.audioInfo.duration.toFixed(1)}s
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <div className="text-sm text-muted-foreground">Segments</div>
                            <div className="font-medium">
                              {result.audioInfo.numSegments} × 3s
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <div className="text-sm text-muted-foreground">Processing</div>
                            <div className="font-medium">
                              {(result.processingTime / 1000).toFixed(2)}s
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 p-4 rounded-lg bg-secondary/30">
                          <h4 className="font-medium mb-2">Model Information</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Architecture: CRNN (CNN + Bidirectional LSTM + Attention)</li>
                            <li>• Dataset: GTZAN (1000 tracks, 10 genres)</li>
                            <li>• Input: Mel Spectrograms (128 mel bins)</li>
                            <li>• Sample Rate: {result.audioInfo.sampleRate} Hz</li>
                            <li>• Segment Length: 3 seconds</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Genre Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg">Supported Genres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {GTZAN_GENRES.map((genre) => (
                    <Badge
                      key={genre}
                      variant="outline"
                      className="gap-1 py-1.5 px-3"
                      style={{ 
                        borderColor: getGenreColor(genre),
                        color: getGenreColor(genre)
                      }}
                    >
                      {getGenreEmoji(genre)} {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Classifier;
