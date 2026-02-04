import { useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Line,
  ComposedChart,
} from "recharts";
import { PlaylistSong } from "@/lib/moodEngine";
import { moodPoints, MoodType } from "@/data/songs";

interface MoodGraphProps {
  songs: PlaylistSong[];
  moodPath: { valence: number; arousal: number; step: number }[];
}

export function MoodGraph({ songs, moodPath }: MoodGraphProps) {
  const chartData = useMemo(() => {
    return songs.map((song, index) => ({
      x: song.valence,
      y: song.energy,
      name: song.title,
      artist: song.artist,
      step: index + 1,
      targetX: moodPath[index]?.valence,
      targetY: moodPath[index]?.arousal,
    }));
  }, [songs, moodPath]);

  const moodLabels = Object.entries(moodPoints).map(([key, mood]) => ({
    x: mood.valence,
    y: mood.arousal,
    label: mood.emoji,
    name: mood.label,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 text-sm">
          <p className="font-semibold">{data.name}</p>
          <p className="text-muted-foreground">{data.artist}</p>
          <p className="text-xs mt-1">
            Valence: {data.x.toFixed(2)} | Energy: {data.y.toFixed(2)}
          </p>
          <p className="text-xs text-primary">Step {data.step} in journey</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
        Mood Transition Map
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Valence (sad → happy) vs Arousal (calm → energetic)
      </p>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[0, 1]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{
                value: "Valence (Sad → Happy)",
                position: "bottom",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 12,
              }}
            />
            <YAxis
              dataKey="y"
              type="number"
              domain={[0, 1]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{
                value: "Arousal",
                angle: -90,
                position: "left",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 12,
              }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Ideal path line */}
            <Line
              data={moodPath}
              dataKey="arousal"
              stroke="hsl(var(--primary) / 0.3)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              type="monotone"
              xAxisId={0}
              yAxisId={0}
            />

            {/* Song positions */}
            <Scatter
              data={chartData}
              fill="hsl(var(--primary))"
              shape={(props: any) => {
                const { cx, cy, payload } = props;
                return (
                  <g>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={8}
                      fill="hsl(var(--primary))"
                      stroke="hsl(var(--primary-foreground))"
                      strokeWidth={2}
                    />
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize={10}
                      fontWeight="bold"
                    >
                      {payload.step}
                    </text>
                  </g>
                );
              }}
            />

            {/* Mood region labels */}
            {moodLabels.map((mood) => (
              <text
                key={mood.name}
                x={`${mood.x * 100}%`}
                y={`${(1 - mood.y) * 100}%`}
                textAnchor="middle"
                fontSize={20}
                opacity={0.4}
              >
                {mood.label}
              </text>
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>Song position</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-primary/30 border-dashed border" />
          <span>Target path</span>
        </div>
      </div>
    </div>
  );
}
