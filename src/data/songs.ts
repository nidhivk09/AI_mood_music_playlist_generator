// GTZAN Dataset Genres
export const GTZAN_GENRES = [
  'blues', 'classical', 'country', 'disco', 'hiphop',
  'jazz', 'metal', 'pop', 'reggae', 'rock'
] as const;

export type GTZANGenre = typeof GTZAN_GENRES[number];

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: GTZANGenre;
  valence: number;
  energy: number;
  tempo: number;
  crnnConfidence?: number;
}

export type MoodType = "sad" | "calm" | "happy" | "energetic" | "angry";

export interface MoodPoint {
  type: MoodType;
  valence: number;
  arousal: number;
  emoji: string;
  label: string;
  description: string;
}

export const moodPoints: Record<MoodType, MoodPoint> = {
  sad: { type: "sad", valence: 0.15, arousal: 0.2, emoji: "😢", label: "Sad", description: "Low energy, melancholic" },
  calm: { type: "calm", valence: 0.4, arousal: 0.25, emoji: "😌", label: "Calm", description: "Peaceful, relaxed" },
  happy: { type: "happy", valence: 0.8, arousal: 0.6, emoji: "😊", label: "Happy", description: "Joyful, positive" },
  energetic: { type: "energetic", valence: 0.7, arousal: 0.9, emoji: "🔥", label: "Energetic", description: "High energy, pumped" },
  angry: { type: "angry", valence: 0.15, arousal: 0.85, emoji: "😤", label: "Angry", description: "Intense, frustrated" },
};

export const mockSongs: Song[] = [
  // Blues
  { id: "1", title: "Stormy Monday Blues", artist: "T-Bone Walker", genre: "blues", valence: 0.3, energy: 0.4, tempo: 85, crnnConfidence: 0.94 },
  { id: "2", title: "The Thrill Is Gone", artist: "B.B. King", genre: "blues", valence: 0.25, energy: 0.35, tempo: 78, crnnConfidence: 0.96 },
  { id: "3", title: "Red House", artist: "Jimi Hendrix", genre: "blues", valence: 0.45, energy: 0.55, tempo: 92, crnnConfidence: 0.89 },
  { id: "4", title: "Pride and Joy", artist: "Stevie Ray Vaughan", genre: "blues", valence: 0.55, energy: 0.65, tempo: 118, crnnConfidence: 0.91 },
  // Classical
  { id: "5", title: "Moonlight Sonata", artist: "Beethoven", genre: "classical", valence: 0.3, energy: 0.2, tempo: 56, crnnConfidence: 0.98 },
  { id: "6", title: "Four Seasons - Spring", artist: "Vivaldi", genre: "classical", valence: 0.8, energy: 0.6, tempo: 120, crnnConfidence: 0.97 },
  { id: "7", title: "Clair de Lune", artist: "Debussy", genre: "classical", valence: 0.5, energy: 0.15, tempo: 66, crnnConfidence: 0.95 },
  { id: "8", title: "Symphony No. 5", artist: "Beethoven", genre: "classical", valence: 0.45, energy: 0.85, tempo: 108, crnnConfidence: 0.99 },
  // Country
  { id: "9", title: "Take Me Home, Country Roads", artist: "John Denver", genre: "country", valence: 0.75, energy: 0.5, tempo: 82, crnnConfidence: 0.93 },
  { id: "10", title: "Jolene", artist: "Dolly Parton", genre: "country", valence: 0.4, energy: 0.45, tempo: 110, crnnConfidence: 0.95 },
  { id: "11", title: "Ring of Fire", artist: "Johnny Cash", genre: "country", valence: 0.55, energy: 0.55, tempo: 108, crnnConfidence: 0.92 },
  { id: "12", title: "Hurt", artist: "Johnny Cash", genre: "country", valence: 0.15, energy: 0.2, tempo: 68, crnnConfidence: 0.89 },
  // Disco
  { id: "13", title: "Stayin' Alive", artist: "Bee Gees", genre: "disco", valence: 0.85, energy: 0.85, tempo: 104, crnnConfidence: 0.97 },
  { id: "14", title: "I Will Survive", artist: "Gloria Gaynor", genre: "disco", valence: 0.75, energy: 0.8, tempo: 116, crnnConfidence: 0.96 },
  { id: "15", title: "Dancing Queen", artist: "ABBA", genre: "disco", valence: 0.92, energy: 0.82, tempo: 101, crnnConfidence: 0.95 },
  { id: "16", title: "Funkytown", artist: "Lipps Inc", genre: "disco", valence: 0.88, energy: 0.9, tempo: 128, crnnConfidence: 0.93 },
  // Hip-hop
  { id: "17", title: "Lose Yourself", artist: "Eminem", genre: "hiphop", valence: 0.55, energy: 0.85, tempo: 87, crnnConfidence: 0.94 },
  { id: "18", title: "Juicy", artist: "Notorious B.I.G.", genre: "hiphop", valence: 0.75, energy: 0.7, tempo: 94, crnnConfidence: 0.96 },
  { id: "19", title: "HUMBLE.", artist: "Kendrick Lamar", genre: "hiphop", valence: 0.5, energy: 0.88, tempo: 150, crnnConfidence: 0.95 },
  { id: "20", title: "Still D.R.E.", artist: "Dr. Dre", genre: "hiphop", valence: 0.6, energy: 0.75, tempo: 93, crnnConfidence: 0.96 },
  // Jazz
  { id: "21", title: "Take Five", artist: "Dave Brubeck", genre: "jazz", valence: 0.6, energy: 0.45, tempo: 172, crnnConfidence: 0.97 },
  { id: "22", title: "So What", artist: "Miles Davis", genre: "jazz", valence: 0.5, energy: 0.35, tempo: 136, crnnConfidence: 0.98 },
  { id: "23", title: "Fly Me to the Moon", artist: "Frank Sinatra", genre: "jazz", valence: 0.75, energy: 0.5, tempo: 120, crnnConfidence: 0.93 },
  { id: "24", title: "Blue in Green", artist: "Miles Davis", genre: "jazz", valence: 0.35, energy: 0.2, tempo: 64, crnnConfidence: 0.96 },
  // Metal
  { id: "25", title: "Master of Puppets", artist: "Metallica", genre: "metal", valence: 0.35, energy: 0.95, tempo: 212, crnnConfidence: 0.97 },
  { id: "26", title: "Paranoid", artist: "Black Sabbath", genre: "metal", valence: 0.4, energy: 0.85, tempo: 164, crnnConfidence: 0.95 },
  { id: "27", title: "Enter Sandman", artist: "Metallica", genre: "metal", valence: 0.45, energy: 0.88, tempo: 123, crnnConfidence: 0.98 },
  { id: "28", title: "Raining Blood", artist: "Slayer", genre: "metal", valence: 0.25, energy: 0.99, tempo: 220, crnnConfidence: 0.96 },
  // Pop
  { id: "29", title: "Blinding Lights", artist: "The Weeknd", genre: "pop", valence: 0.8, energy: 0.75, tempo: 171, crnnConfidence: 0.94 },
  { id: "30", title: "Shape of You", artist: "Ed Sheeran", genre: "pop", valence: 0.85, energy: 0.7, tempo: 96, crnnConfidence: 0.96 },
  { id: "31", title: "Uptown Funk", artist: "Bruno Mars", genre: "pop", valence: 0.95, energy: 0.88, tempo: 115, crnnConfidence: 0.97 },
  { id: "32", title: "Shake It Off", artist: "Taylor Swift", genre: "pop", valence: 0.9, energy: 0.8, tempo: 160, crnnConfidence: 0.95 },
  // Reggae
  { id: "33", title: "One Love", artist: "Bob Marley", genre: "reggae", valence: 0.85, energy: 0.5, tempo: 76, crnnConfidence: 0.97 },
  { id: "34", title: "No Woman No Cry", artist: "Bob Marley", genre: "reggae", valence: 0.6, energy: 0.4, tempo: 80, crnnConfidence: 0.96 },
  { id: "35", title: "Three Little Birds", artist: "Bob Marley", genre: "reggae", valence: 0.9, energy: 0.55, tempo: 74, crnnConfidence: 0.98 },
  { id: "36", title: "Red Red Wine", artist: "UB40", genre: "reggae", valence: 0.7, energy: 0.45, tempo: 82, crnnConfidence: 0.93 },
  // Rock
  { id: "37", title: "Bohemian Rhapsody", artist: "Queen", genre: "rock", valence: 0.5, energy: 0.75, tempo: 144, crnnConfidence: 0.94 },
  { id: "38", title: "Stairway to Heaven", artist: "Led Zeppelin", genre: "rock", valence: 0.55, energy: 0.6, tempo: 82, crnnConfidence: 0.96 },
  { id: "39", title: "Smells Like Teen Spirit", artist: "Nirvana", genre: "rock", valence: 0.4, energy: 0.9, tempo: 117, crnnConfidence: 0.95 },
  { id: "40", title: "Back in Black", artist: "AC/DC", genre: "rock", valence: 0.75, energy: 0.92, tempo: 188, crnnConfidence: 0.98 },
];

export const genres = GTZAN_GENRES;
export const artists = [...new Set(mockSongs.map(s => s.artist))];
