/**
 * Audio Visualization Component
 * 
 * Interactive visualizations for audio analysis including:
 * - Mel Spectrogram heatmap
 * - Waveform display
 * - Spectral features
 * - Chromagram (pitch)
 * - Beat markers
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  AudioWaveform, 
  Flame, 
  Music2, 
  Waves,
  Zap,
  BarChart3
} from 'lucide-react';

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

interface AudioVisualizationProps {
  data: VisualizationData;
  duration: number;
}

// Color scales for heatmaps
const magmaColors = [
  '#000004', '#1b0c41', '#4a0c6b', '#781c6d', '#a52c60', '#cf4446', 
  '#ed6925', '#fb9b06', '#f7d13d', '#fcffa4'
];

const plasmaColors = [
  '#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786', '#d8576b',
  '#ed7953', '#fb9f3a', '#fdca26', '#f0f921'
];

const viridisColors = [
  '#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89',
  '#35b779', '#6ece58', '#b5de2b', '#fde725'
];

function interpolateColor(colors: string[], t: number): string {
  const n = colors.length - 1;
  const i = Math.min(Math.floor(t * n), n - 1);
  const f = t * n - i;
  
  const c1 = colors[i];
  const c2 = colors[i + 1];
  
  const r1 = parseInt(c1.slice(1, 3), 16);
  const g1 = parseInt(c1.slice(3, 5), 16);
  const b1 = parseInt(c1.slice(5, 7), 16);
  
  const r2 = parseInt(c2.slice(1, 3), 16);
  const g2 = parseInt(c2.slice(3, 5), 16);
  const b2 = parseInt(c2.slice(5, 7), 16);
  
  const r = Math.round(r1 + f * (r2 - r1));
  const g = Math.round(g1 + f * (g2 - g1));
  const b = Math.round(b1 + f * (b2 - b1));
  
  return `rgb(${r}, ${g}, ${b})`;
}

// Mel Spectrogram Canvas Component
function MelSpectrogramCanvas({ data, width, height }: { data: number[][], width: number, height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; value: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const melBins = data.length;
    const timeFrames = data[0].length;
    
    // Find min/max for normalization
    let min = Infinity, max = -Infinity;
    for (const row of data) {
      for (const val of row) {
        if (val < min) min = val;
        if (val > max) max = val;
      }
    }

    const cellWidth = width / timeFrames;
    const cellHeight = height / melBins;

    // Draw spectrogram
    for (let i = 0; i < melBins; i++) {
      for (let j = 0; j < timeFrames; j++) {
        const normalized = (data[melBins - 1 - i][j] - min) / (max - min + 1e-8);
        ctx.fillStyle = interpolateColor(magmaColors, normalized);
        ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth + 1, cellHeight + 1);
      }
    }
  }, [data, width, height]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const timeFrames = data[0].length;
    const melBins = data.length;
    
    const frameIndex = Math.floor((x / width) * timeFrames);
    const melIndex = melBins - 1 - Math.floor((y / height) * melBins);
    
    if (frameIndex >= 0 && frameIndex < timeFrames && melIndex >= 0 && melIndex < melBins) {
      setHoveredPoint({ x, y, value: data[melIndex][frameIndex] });
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredPoint(null)}
      />
      <AnimatePresence>
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bg-black/80 text-white px-2 py-1 rounded text-xs pointer-events-none"
            style={{ left: hoveredPoint.x + 10, top: hoveredPoint.y - 30 }}
          >
            {hoveredPoint.value.toFixed(1)} dB
          </motion.div>
        )}
      </AnimatePresence>
      {/* Frequency axis label */}
      <div className="absolute -left-8 top-1/2 -rotate-90 text-xs text-muted-foreground">
        Frequency
      </div>
      {/* Time axis label */}
      <div className="absolute bottom-[-20px] left-1/2 text-xs text-muted-foreground">
        Time
      </div>
    </div>
  );
}

// Waveform Component
function WaveformDisplay({ data, beats, duration }: { data: number[], beats: number[], duration: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(600);
  const height = 120;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
    bgGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.05)');
    bgGradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw beat markers
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.3)';
    ctx.lineWidth = 1;
    for (const beat of beats) {
      const x = (beat / duration) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw center line
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Draw waveform
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#8b5cf6');
    gradient.addColorStop(0.5, '#ec4899');
    gradient.addColorStop(1, '#f59e0b');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const samplesPerPixel = data.length / width;
    
    for (let x = 0; x < width; x++) {
      const sampleIndex = Math.floor(x * samplesPerPixel);
      const amplitude = data[sampleIndex] || 0;
      const y = height / 2 - amplitude * (height / 2) * 0.9;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();

    // Draw filled area
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = gradient;
    ctx.lineTo(width, height / 2);
    ctx.lineTo(0, height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }, [data, beats, duration, width]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full rounded-lg"
      />
    </div>
  );
}

// Spectral Features Line Chart
function SpectralFeaturesChart({ 
  centroid, 
  rolloff, 
  rms, 
  timeAxis 
}: { 
  centroid: number[], 
  rolloff: number[], 
  rms: number[],
  timeAxis: number[]
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = 600;
  const height = 150;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const drawLine = (data: number[], color: string, label: string) => {
      if (data.length === 0) return;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < data.length; i++) {
        const x = (i / data.length) * width;
        const y = height - data[i] * height * 0.9 - 5;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    };

    drawLine(centroid, '#8b5cf6', 'Centroid');
    drawLine(rolloff, '#ec4899', 'Rolloff');
    drawLine(rms, '#10b981', 'Energy');
  }, [centroid, rolloff, rms, timeAxis]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full rounded-lg"
      />
      <div className="flex gap-4 mt-2 justify-center">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-xs text-muted-foreground">Brightness</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-pink-500" />
          <span className="text-xs text-muted-foreground">Rolloff</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground">Energy</span>
        </div>
      </div>
    </div>
  );
}

// Chromagram Component
function ChromagramDisplay({ data }: { data: number[][] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = 600;
  const height = 180;
  const pitchClasses = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numPitches = data.length;
    const timeFrames = data[0].length;
    
    const cellWidth = (width - 30) / timeFrames;
    const cellHeight = height / numPitches;

    // Clear and draw
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < numPitches; i++) {
      // Draw pitch label
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.fillText(pitchClasses[numPitches - 1 - i], 2, i * cellHeight + cellHeight / 2 + 4);

      for (let j = 0; j < timeFrames; j++) {
        const value = data[numPitches - 1 - i][j];
        ctx.fillStyle = interpolateColor(viridisColors, value);
        ctx.fillRect(30 + j * cellWidth, i * cellHeight, cellWidth + 1, cellHeight);
      }
    }
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full rounded-lg"
    />
  );
}

// Tempo/Beat Display
function TempoDisplay({ tempo, beats, duration }: { tempo: number, beats: number[], duration: number }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div 
        className="relative w-32 h-32"
        animate={{ rotate: 360 }}
        transition={{ duration: 60 / tempo, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-purple-500/30" />
        <div className="absolute inset-2 rounded-full border-2 border-pink-500/30" />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-1 h-12 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full origin-bottom"
          style={{ transform: 'translateX(-50%)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(tempo)}</span>
        </div>
      </motion.div>
      <div className="text-center">
        <p className="text-lg font-semibold">BPM</p>
        <p className="text-sm text-muted-foreground">{beats.length} beats detected</p>
      </div>
    </div>
  );
}

// Main Component
export function AudioVisualization({ data, duration }: AudioVisualizationProps) {
  const [activeTab, setActiveTab] = useState('spectrogram');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-purple-400" />
            Audio Analysis
            <Badge variant="outline" className="ml-2">
              {duration.toFixed(1)}s
            </Badge>
            <Badge variant="outline" className="bg-pink-500/10 text-pink-400 border-pink-500/30">
              {Math.round(data.tempo)} BPM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="spectrogram" className="flex items-center gap-1">
                <Flame className="w-4 h-4" />
                <span className="hidden sm:inline">Spectrogram</span>
              </TabsTrigger>
              <TabsTrigger value="waveform" className="flex items-center gap-1">
                <AudioWaveform className="w-4 h-4" />
                <span className="hidden sm:inline">Waveform</span>
              </TabsTrigger>
              <TabsTrigger value="spectral" className="flex items-center gap-1">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Spectral</span>
              </TabsTrigger>
              <TabsTrigger value="pitch" className="flex items-center gap-1">
                <Music2 className="w-4 h-4" />
                <span className="hidden sm:inline">Pitch</span>
              </TabsTrigger>
              <TabsTrigger value="tempo" className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Tempo</span>
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="spectrogram" className="mt-0">
                <motion.div
                  key="spectrogram"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-2"
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    Mel Spectrogram showing frequency content over time. Brighter colors indicate higher energy.
                  </p>
                  <div className="flex justify-center pl-8 pb-6">
                    <MelSpectrogramCanvas 
                      data={data.melSpectrogram} 
                      width={600} 
                      height={256} 
                    />
                  </div>
                  <div className="flex justify-center">
                    <div className="flex items-center gap-1">
                      {magmaColors.map((color, i) => (
                        <div 
                          key={i} 
                          className="w-6 h-3" 
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground px-4">
                    <span>Low Energy</span>
                    <span>High Energy</span>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="waveform" className="mt-0">
                <motion.div
                  key="waveform"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-muted-foreground">
                    Audio waveform with beat markers (pink lines). Shows amplitude variations over time.
                  </p>
                  <WaveformDisplay 
                    data={data.waveform} 
                    beats={data.beats}
                    duration={duration}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0s</span>
                    <span>{(duration / 2).toFixed(1)}s</span>
                    <span>{duration.toFixed(1)}s</span>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="spectral" className="mt-0">
                <motion.div
                  key="spectral"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-muted-foreground">
                    Spectral features over time: brightness (centroid), rolloff frequency, and energy (RMS).
                  </p>
                  <SpectralFeaturesChart 
                    centroid={data.spectralCentroid}
                    rolloff={data.spectralRolloff}
                    rms={data.rms}
                    timeAxis={data.timeAxis}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="pitch" className="mt-0">
                <motion.div
                  key="pitch"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-muted-foreground">
                    Chromagram showing pitch class distribution over time. Useful for identifying key and chord progressions.
                  </p>
                  <ChromagramDisplay data={data.chromagram} />
                </motion.div>
              </TabsContent>

              <TabsContent value="tempo" className="mt-0">
                <motion.div
                  key="tempo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col items-center py-8"
                >
                  <p className="text-sm text-muted-foreground mb-8">
                    Detected tempo and beat information from the audio.
                  </p>
                  <TempoDisplay 
                    tempo={data.tempo}
                    beats={data.beats}
                    duration={duration}
                  />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
