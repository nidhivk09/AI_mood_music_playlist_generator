import { motion } from "framer-motion";
import { PlaylistSong } from "@/lib/moodEngine";
import { LANGUAGE_LABELS } from "@/data/songs";
import { Music, Clock, Zap, Heart, User, Disc, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlaylistCardProps {
  song: PlaylistSong;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}

function getMoodColor(valence: number, energy: number): string {
  if (valence < 0.3 && energy < 0.4) return "from-blue-600/20 to-purple-600/10";
  if (valence < 0.3 && energy >= 0.6) return "from-red-600/20 to-rose-600/10";
  if (valence >= 0.6 && energy >= 0.6) return "from-orange-500/20 to-yellow-500/10";
  if (valence >= 0.6 && energy < 0.4) return "from-green-500/20 to-emerald-500/10";
  return "from-cyan-500/20 to-teal-500/10";
}

export function PlaylistCard({ song, index, isFirst, isLast }: PlaylistCardProps) {
  const moodGradient = getMoodColor(song.valence, song.energy);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {/* Connection line */}
      {!isLast && (
        <div className="absolute left-8 top-full w-0.5 h-6 bg-gradient-to-b from-primary/50 to-primary/10" />
      )}

      <div
        className={cn(
          "song-card flex gap-4 bg-gradient-to-r",
          moodGradient
        )}
      >
        {/* Step indicator */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
              isFirst
                ? "bg-blue-500"
                : isLast
                ? "bg-green-500"
                : "bg-primary"
            )}
          >
            {index + 1}
          </div>
        </div>

        {/* Album art placeholder */}
        <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
          <Disc className="w-8 h-8 text-primary/60" />
        </div>

        {/* Song info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold truncate">{song.title}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {song.artist} • {song.album}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{song.duration}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <Music className="w-3 h-3 mr-1" />
              {song.genre}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Globe className="w-3 h-3 mr-1" />
              {LANGUAGE_LABELS[song.language]?.flag} {LANGUAGE_LABELS[song.language]?.name || song.language}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              {song.tempo} BPM
            </Badge>
            {song.genreMatch && (
              <Badge className="bg-green-500/20 text-green-400 text-xs">
                <Heart className="w-3 h-3 mr-1" />
                Genre match
              </Badge>
            )}
            {song.artistMatch && (
              <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                <User className="w-3 h-3 mr-1" />
                Fav artist
              </Badge>
            )}
          </div>

          {/* Explanation */}
          <p className="text-xs text-muted-foreground mt-2 italic">
            "{song.explanation}"
          </p>

          {/* Mood values */}
          <div className="flex items-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Valence:</span>
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-yellow-500"
                  style={{ width: `${song.valence * 100}%` }}
                />
              </div>
              <span className="text-foreground">{(song.valence * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Energy:</span>
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-orange-500"
                  style={{ width: `${song.energy * 100}%` }}
                />
              </div>
              <span className="text-foreground">{(song.energy * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
