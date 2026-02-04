import { motion } from "framer-motion";
import { TrendingUp, Target, Sparkles } from "lucide-react";

interface MetricsPanelProps {
  metrics: {
    smoothnessScore: number;
    preferenceMatchPercentage: number;
    avgMoodDistance: number;
  };
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        Playlist Metrics
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {/* Smoothness Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-2">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="6"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(metrics.smoothnessScore / 100) * 220} 220`}
                initial={{ strokeDasharray: "0 220" }}
                animate={{
                  strokeDasharray: `${(metrics.smoothnessScore / 100) * 220} 220`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-bold ${getScoreColor(metrics.smoothnessScore)}`}>
                {metrics.smoothnessScore}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Smoothness</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Transition quality
          </p>
        </motion.div>

        {/* Preference Match */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-2">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="6"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(metrics.preferenceMatchPercentage / 100) * 220} 220`}
                initial={{ strokeDasharray: "0 220" }}
                animate={{
                  strokeDasharray: `${(metrics.preferenceMatchPercentage / 100) * 220} 220`,
                }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-bold ${getScoreColor(metrics.preferenceMatchPercentage)}`}>
                {metrics.preferenceMatchPercentage}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-sm">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Preference</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Genre & artist match
          </p>
        </motion.div>

        {/* Avg Mood Distance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
            <div className="text-center">
              <span className="text-2xl font-bold text-foreground">
                {metrics.avgMoodDistance}
              </span>
              <p className="text-xs text-muted-foreground">avg dist</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-sm">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Accuracy</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Lower is better
          </p>
        </motion.div>
      </div>
    </div>
  );
}
