import { useState } from "react";
import { motion } from "framer-motion";
import { genres, artists } from "@/data/songs";
import { UserPreferences } from "@/lib/moodEngine";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Music2, User, Heart } from "lucide-react";

interface PreferencesPanelProps {
  preferences: UserPreferences;
  onUpdate: (preferences: UserPreferences) => void;
}

export function PreferencesPanel({ preferences, onUpdate }: PreferencesPanelProps) {
  const toggleGenre = (genre: string) => {
    const newGenres = preferences.preferredGenres.includes(genre)
      ? preferences.preferredGenres.filter((g) => g !== genre)
      : [...preferences.preferredGenres, genre];
    onUpdate({ ...preferences, preferredGenres: newGenres });
  };

  const toggleArtist = (artist: string) => {
    const newArtists = preferences.favoriteArtists.includes(artist)
      ? preferences.favoriteArtists.filter((a) => a !== artist)
      : [...preferences.favoriteArtists, artist];
    onUpdate({ ...preferences, favoriteArtists: newArtists });
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Your Preferences</h3>
      </div>

      {/* Genres */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Music2 className="w-4 h-4" />
          <span>Preferred Genres</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => {
            const isSelected = preferences.preferredGenres.includes(genre);
            return (
              <motion.button
                key={genre}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleGenre(genre)}
              >
                <Badge
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all",
                    isSelected && "bg-primary hover:bg-primary/80"
                  )}
                >
                  {genre}
                </Badge>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Artists */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>Favorite Artists</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {artists.map((artist) => {
            const isSelected = preferences.favoriteArtists.includes(artist);
            return (
              <motion.button
                key={artist}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleArtist(artist)}
              >
                <Badge
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all",
                    isSelected && "bg-accent hover:bg-accent/80"
                  )}
                >
                  {artist}
                </Badge>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Selected: {preferences.preferredGenres.length} genres, {preferences.favoriteArtists.length} artists
        </p>
      </div>
    </div>
  );
}
