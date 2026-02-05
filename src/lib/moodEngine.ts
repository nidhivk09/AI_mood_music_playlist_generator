import { Song, mockSongs, MoodPoint, moodPoints, MoodType, Language } from "@/data/songs";

export interface UserPreferences {
  preferredGenres: string[];
  favoriteArtists: string[];
  preferredLanguages: Language[];
  likedSongIds: string[];
}

export interface PlaylistSong extends Song {
  moodScore: number;
  genreMatch: boolean;
  artistMatch: boolean;
  languageMatch: boolean;
  explanation: string;
  targetValence: number;
  targetArousal: number;
}

export interface PlaylistResult {
  songs: PlaylistSong[];
  metrics: {
    smoothnessScore: number;
    preferenceMatchPercentage: number;
    avgMoodDistance: number;
  };
  moodPath: { valence: number; arousal: number; step: number }[];
}

// Calculate Euclidean distance between two points
function euclideanDistance(
  v1: number,
  a1: number,
  v2: number,
  a2: number
): number {
  return Math.sqrt(Math.pow(v1 - v2, 2) + Math.pow(a1 - a2, 2));
}

// Linear interpolation between two mood points
function interpolateMoods(
  start: MoodPoint,
  end: MoodPoint,
  steps: number
): { valence: number; arousal: number }[] {
  const path: { valence: number; arousal: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    path.push({
      valence: start.valence + (end.valence - start.valence) * t,
      arousal: start.arousal + (end.arousal - start.arousal) * t,
    });
  }

  return path;
}

// K-Means inspired clustering - group songs by mood similarity
export function clusterSongsByMood(songs: Song[], k: number = 5) {
  // Initialize centroids based on mood types
  const centroids = Object.values(moodPoints).map((m) => ({
    valence: m.valence,
    arousal: m.arousal,
    type: m.type,
  }));

  const clusters: Map<MoodType, Song[]> = new Map();
  centroids.forEach((c) => clusters.set(c.type, []));

  // Assign songs to nearest centroid
  songs.forEach((song) => {
    let minDist = Infinity;
    let nearestType: MoodType = "calm";

    centroids.forEach((centroid) => {
      const dist = euclideanDistance(
        song.valence,
        song.energy,
        centroid.valence,
        centroid.arousal
      );
      if (dist < minDist) {
        minDist = dist;
        nearestType = centroid.type;
      }
    });

    clusters.get(nearestType)?.push(song);
  });

  return clusters;
}

// Score a song based on mood similarity and user preferences
function scoreSong(
  song: Song,
  targetValence: number,
  targetArousal: number,
  preferences: UserPreferences,
  usedSongIds: Set<string>
): { score: number; genreMatch: boolean; artistMatch: boolean; languageMatch: boolean } {
  // Already used penalty
  if (usedSongIds.has(song.id)) {
    return { score: -Infinity, genreMatch: false, artistMatch: false, languageMatch: false };
  }

  // Mood distance (primary factor) - lower is better
  const moodDistance = euclideanDistance(
    song.valence,
    song.energy,
    targetValence,
    targetArousal
  );
  const moodScore = 1 - moodDistance; // Convert to similarity

  // Genre match bonus
  const genreMatch = preferences.preferredGenres.includes(song.genre);
  const genreScore = genreMatch ? 0.15 : 0;

  // Artist match bonus
  const artistMatch = preferences.favoriteArtists.includes(song.artist);
  const artistScore = artistMatch ? 0.15 : 0;

  // Language match bonus (high priority)
  const languageMatch = preferences.preferredLanguages.length === 0 || 
    preferences.preferredLanguages.includes(song.language);
  const languageScore = languageMatch ? 0.2 : -0.3; // Penalty for non-preferred language

  // Liked song bonus
  const likedScore = preferences.likedSongIds.includes(song.id) ? 0.1 : 0;

  // Weighted combination
  const totalScore =
    moodScore * 0.5 + genreScore * 0.15 + artistScore * 0.1 + languageScore * 0.2 + likedScore * 0.05;

  return { score: totalScore, genreMatch, artistMatch, languageMatch };
}

// Generate explanation for why a song was chosen
function generateExplanation(
  song: Song,
  targetValence: number,
  targetArousal: number,
  genreMatch: boolean,
  artistMatch: boolean,
  stepIndex: number,
  totalSteps: number
): string {
  const parts: string[] = [];

  // Position in journey
  if (stepIndex === 0) {
    parts.push("Starting your emotional journey");
  } else if (stepIndex === totalSteps - 1) {
    parts.push("Reaching your target mood");
  } else {
    const progress = Math.round((stepIndex / (totalSteps - 1)) * 100);
    parts.push(`${progress}% through your mood transition`);
  }

  // Mood alignment
  const moodDist = euclideanDistance(
    song.valence,
    song.energy,
    targetValence,
    targetArousal
  );
  if (moodDist < 0.15) {
    parts.push("with perfect mood alignment");
  } else if (moodDist < 0.25) {
    parts.push("with excellent mood fit");
  } else {
    parts.push("bridging to the next emotional state");
  }

  // Preference matches
  if (artistMatch) {
    parts.push(`featuring ${song.artist}, one of your favorites`);
  } else if (genreMatch) {
    parts.push(`in your preferred ${song.genre} genre`);
  }

  return parts.join(" ");
}

// Main playlist generation algorithm
export function generateMoodPlaylist(
  currentMood: MoodType,
  targetMood: MoodType,
  preferences: UserPreferences,
  playlistLength: number = 8
): PlaylistResult {
  const startMood = moodPoints[currentMood];
  const endMood = moodPoints[targetMood];

  // Generate intermediate mood states
  const moodPath = interpolateMoods(startMood, endMood, playlistLength - 1);

  const playlist: PlaylistSong[] = [];
  const usedSongIds = new Set<string>();

  // For each mood step, find the best matching song
  moodPath.forEach((target, index) => {
    let bestSong: Song | null = null;
    let bestScore = -Infinity;
    let bestGenreMatch = false;
    let bestArtistMatch = false;
    let bestLanguageMatch = false;

    mockSongs.forEach((song) => {
      const { score, genreMatch, artistMatch, languageMatch } = scoreSong(
        song,
        target.valence,
        target.arousal,
        preferences,
        usedSongIds
      );

      if (score > bestScore) {
        bestScore = score;
        bestSong = song;
        bestGenreMatch = genreMatch;
        bestArtistMatch = artistMatch;
        bestLanguageMatch = languageMatch;
      }
    });

    if (bestSong) {
      usedSongIds.add(bestSong.id);

      const explanation = generateExplanation(
        bestSong,
        target.valence,
        target.arousal,
        bestGenreMatch,
        bestArtistMatch,
        index,
        playlistLength
      );

      playlist.push({
        ...bestSong,
        moodScore: bestScore,
        genreMatch: bestGenreMatch,
        artistMatch: bestArtistMatch,
        languageMatch: bestLanguageMatch,
        explanation,
        targetValence: target.valence,
        targetArousal: target.arousal,
      });
    }
  });

  // Calculate metrics
  const metrics = calculateMetrics(playlist, preferences, moodPath);

  return {
    songs: playlist,
    metrics,
    moodPath: moodPath.map((m, i) => ({ ...m, step: i })),
  };
}

// Calculate playlist quality metrics
function calculateMetrics(
  playlist: PlaylistSong[],
  preferences: UserPreferences,
  moodPath: { valence: number; arousal: number }[]
) {
  // Smoothness: How well do songs transition between each other
  let totalTransitionError = 0;
  for (let i = 1; i < playlist.length; i++) {
    const prev = playlist[i - 1];
    const curr = playlist[i];
    const expectedChange = euclideanDistance(
      moodPath[i - 1].valence,
      moodPath[i - 1].arousal,
      moodPath[i].valence,
      moodPath[i].arousal
    );
    const actualChange = euclideanDistance(
      prev.valence,
      prev.energy,
      curr.valence,
      curr.energy
    );
    totalTransitionError += Math.abs(expectedChange - actualChange);
  }
  // Average the error across transitions, then convert to a 0-100 score
  // Max possible error per transition is ~1.41 (diagonal of unit square)
  const avgTransitionError = totalTransitionError / Math.max(1, playlist.length - 1);
  const smoothnessScore = Math.max(0, Math.min(100, 100 - avgTransitionError * 70));

  // Preference match percentage
  const genreMatches = playlist.filter((s) => s.genreMatch).length;
  const artistMatches = playlist.filter((s) => s.artistMatch).length;
  const preferenceMatchPercentage =
    ((genreMatches + artistMatches) / (playlist.length * 2)) * 100;

  // Average mood distance
  const avgMoodDistance =
    playlist.reduce((sum, song) => {
      return (
        sum +
        euclideanDistance(
          song.valence,
          song.energy,
          song.targetValence,
          song.targetArousal
        )
      );
    }, 0) / playlist.length;

  return {
    smoothnessScore: Math.round(smoothnessScore),
    preferenceMatchPercentage: Math.round(preferenceMatchPercentage),
    avgMoodDistance: Math.round(avgMoodDistance * 100) / 100,
  };
}

// Get default preferences
export function getDefaultPreferences(): UserPreferences {
  return {
    preferredGenres: ["pop", "rock", "hiphop"],
    favoriteArtists: ["Arijit Singh", "A.R. Rahman", "BTS"],
    preferredLanguages: ["english", "hindi"],
    likedSongIds: ["41", "42", "82", "29"],
  };
}
