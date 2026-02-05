// GTZAN Dataset Genres
export const GTZAN_GENRES = [
  'blues', 'classical', 'country', 'disco', 'hiphop',
  'jazz', 'metal', 'pop', 'reggae', 'rock'
] as const;

export type GTZANGenre = typeof GTZAN_GENRES[number];

// Supported Languages
export const LANGUAGES = [
  'english', 'hindi', 'tamil', 'kannada', 'telugu', 'malayalam', 'punjabi',
  'spanish', 'korean', 'japanese', 'french', 'portuguese', 'arabic'
] as const;

export type Language = typeof LANGUAGES[number];

export const LANGUAGE_LABELS: Record<Language, { name: string; native: string; flag: string }> = {
  english: { name: 'English', native: 'English', flag: '🇬🇧' },
  hindi: { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  tamil: { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  kannada: { name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  telugu: { name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  malayalam: { name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  punjabi: { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  spanish: { name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  korean: { name: 'Korean', native: '한국어', flag: '🇰🇷' },
  japanese: { name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  french: { name: 'French', native: 'Français', flag: '🇫🇷' },
  portuguese: { name: 'Portuguese', native: 'Português', flag: '🇧🇷' },
  arabic: { name: 'Arabic', native: 'العربية', flag: '🇸🇦' }
};

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: GTZANGenre;
  language: Language;
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
  // ==================== ENGLISH ====================
  // Blues - English
  { id: "1", title: "Stormy Monday Blues", artist: "T-Bone Walker", genre: "blues", language: "english", valence: 0.3, energy: 0.4, tempo: 85, crnnConfidence: 0.94 },
  { id: "2", title: "The Thrill Is Gone", artist: "B.B. King", genre: "blues", language: "english", valence: 0.25, energy: 0.35, tempo: 78, crnnConfidence: 0.96 },
  { id: "3", title: "Red House", artist: "Jimi Hendrix", genre: "blues", language: "english", valence: 0.45, energy: 0.55, tempo: 92, crnnConfidence: 0.89 },
  { id: "4", title: "Pride and Joy", artist: "Stevie Ray Vaughan", genre: "blues", language: "english", valence: 0.55, energy: 0.65, tempo: 118, crnnConfidence: 0.91 },
  
  // Classical - English/Instrumental
  { id: "5", title: "Moonlight Sonata", artist: "Beethoven", genre: "classical", language: "english", valence: 0.3, energy: 0.2, tempo: 56, crnnConfidence: 0.98 },
  { id: "6", title: "Four Seasons - Spring", artist: "Vivaldi", genre: "classical", language: "english", valence: 0.8, energy: 0.6, tempo: 120, crnnConfidence: 0.97 },
  { id: "7", title: "Clair de Lune", artist: "Debussy", genre: "classical", language: "english", valence: 0.5, energy: 0.15, tempo: 66, crnnConfidence: 0.95 },
  { id: "8", title: "Symphony No. 5", artist: "Beethoven", genre: "classical", language: "english", valence: 0.45, energy: 0.85, tempo: 108, crnnConfidence: 0.99 },
  
  // Country - English
  { id: "9", title: "Take Me Home, Country Roads", artist: "John Denver", genre: "country", language: "english", valence: 0.75, energy: 0.5, tempo: 82, crnnConfidence: 0.93 },
  { id: "10", title: "Jolene", artist: "Dolly Parton", genre: "country", language: "english", valence: 0.4, energy: 0.45, tempo: 110, crnnConfidence: 0.95 },
  { id: "11", title: "Ring of Fire", artist: "Johnny Cash", genre: "country", language: "english", valence: 0.55, energy: 0.55, tempo: 108, crnnConfidence: 0.92 },
  { id: "12", title: "Hurt", artist: "Johnny Cash", genre: "country", language: "english", valence: 0.15, energy: 0.2, tempo: 68, crnnConfidence: 0.89 },
  
  // Disco - English
  { id: "13", title: "Stayin' Alive", artist: "Bee Gees", genre: "disco", language: "english", valence: 0.85, energy: 0.85, tempo: 104, crnnConfidence: 0.97 },
  { id: "14", title: "I Will Survive", artist: "Gloria Gaynor", genre: "disco", language: "english", valence: 0.75, energy: 0.8, tempo: 116, crnnConfidence: 0.96 },
  { id: "15", title: "Dancing Queen", artist: "ABBA", genre: "disco", language: "english", valence: 0.92, energy: 0.82, tempo: 101, crnnConfidence: 0.95 },
  { id: "16", title: "Funkytown", artist: "Lipps Inc", genre: "disco", language: "english", valence: 0.88, energy: 0.9, tempo: 128, crnnConfidence: 0.93 },
  
  // Hip-hop - English
  { id: "17", title: "Lose Yourself", artist: "Eminem", genre: "hiphop", language: "english", valence: 0.55, energy: 0.85, tempo: 87, crnnConfidence: 0.94 },
  { id: "18", title: "Juicy", artist: "Notorious B.I.G.", genre: "hiphop", language: "english", valence: 0.75, energy: 0.7, tempo: 94, crnnConfidence: 0.96 },
  { id: "19", title: "HUMBLE.", artist: "Kendrick Lamar", genre: "hiphop", language: "english", valence: 0.5, energy: 0.88, tempo: 150, crnnConfidence: 0.95 },
  { id: "20", title: "Still D.R.E.", artist: "Dr. Dre", genre: "hiphop", language: "english", valence: 0.6, energy: 0.75, tempo: 93, crnnConfidence: 0.96 },
  
  // Jazz - English
  { id: "21", title: "Take Five", artist: "Dave Brubeck", genre: "jazz", language: "english", valence: 0.6, energy: 0.45, tempo: 172, crnnConfidence: 0.97 },
  { id: "22", title: "So What", artist: "Miles Davis", genre: "jazz", language: "english", valence: 0.5, energy: 0.35, tempo: 136, crnnConfidence: 0.98 },
  { id: "23", title: "Fly Me to the Moon", artist: "Frank Sinatra", genre: "jazz", language: "english", valence: 0.75, energy: 0.5, tempo: 120, crnnConfidence: 0.93 },
  { id: "24", title: "Blue in Green", artist: "Miles Davis", genre: "jazz", language: "english", valence: 0.35, energy: 0.2, tempo: 64, crnnConfidence: 0.96 },
  
  // Metal - English
  { id: "25", title: "Master of Puppets", artist: "Metallica", genre: "metal", language: "english", valence: 0.35, energy: 0.95, tempo: 212, crnnConfidence: 0.97 },
  { id: "26", title: "Paranoid", artist: "Black Sabbath", genre: "metal", language: "english", valence: 0.4, energy: 0.85, tempo: 164, crnnConfidence: 0.95 },
  { id: "27", title: "Enter Sandman", artist: "Metallica", genre: "metal", language: "english", valence: 0.45, energy: 0.88, tempo: 123, crnnConfidence: 0.98 },
  { id: "28", title: "Raining Blood", artist: "Slayer", genre: "metal", language: "english", valence: 0.25, energy: 0.99, tempo: 220, crnnConfidence: 0.96 },
  
  // Pop - English
  { id: "29", title: "Blinding Lights", artist: "The Weeknd", genre: "pop", language: "english", valence: 0.8, energy: 0.75, tempo: 171, crnnConfidence: 0.94 },
  { id: "30", title: "Shape of You", artist: "Ed Sheeran", genre: "pop", language: "english", valence: 0.85, energy: 0.7, tempo: 96, crnnConfidence: 0.96 },
  { id: "31", title: "Uptown Funk", artist: "Bruno Mars", genre: "pop", language: "english", valence: 0.95, energy: 0.88, tempo: 115, crnnConfidence: 0.97 },
  { id: "32", title: "Shake It Off", artist: "Taylor Swift", genre: "pop", language: "english", valence: 0.9, energy: 0.8, tempo: 160, crnnConfidence: 0.95 },
  
  // Reggae - English
  { id: "33", title: "One Love", artist: "Bob Marley", genre: "reggae", language: "english", valence: 0.85, energy: 0.5, tempo: 76, crnnConfidence: 0.97 },
  { id: "34", title: "No Woman No Cry", artist: "Bob Marley", genre: "reggae", language: "english", valence: 0.6, energy: 0.4, tempo: 80, crnnConfidence: 0.96 },
  { id: "35", title: "Three Little Birds", artist: "Bob Marley", genre: "reggae", language: "english", valence: 0.9, energy: 0.55, tempo: 74, crnnConfidence: 0.98 },
  { id: "36", title: "Red Red Wine", artist: "UB40", genre: "reggae", language: "english", valence: 0.7, energy: 0.45, tempo: 82, crnnConfidence: 0.93 },
  
  // Rock - English
  { id: "37", title: "Bohemian Rhapsody", artist: "Queen", genre: "rock", language: "english", valence: 0.5, energy: 0.75, tempo: 144, crnnConfidence: 0.94 },
  { id: "38", title: "Stairway to Heaven", artist: "Led Zeppelin", genre: "rock", language: "english", valence: 0.55, energy: 0.6, tempo: 82, crnnConfidence: 0.96 },
  { id: "39", title: "Smells Like Teen Spirit", artist: "Nirvana", genre: "rock", language: "english", valence: 0.4, energy: 0.9, tempo: 117, crnnConfidence: 0.95 },
  { id: "40", title: "Back in Black", artist: "AC/DC", genre: "rock", language: "english", valence: 0.75, energy: 0.92, tempo: 188, crnnConfidence: 0.98 },

  // ==================== HINDI ====================
  // Pop - Hindi
  { id: "41", title: "Tum Hi Ho", artist: "Arijit Singh", genre: "pop", language: "hindi", valence: 0.35, energy: 0.5, tempo: 78, crnnConfidence: 0.92 },
  { id: "42", title: "Kesariya", artist: "Arijit Singh", genre: "pop", language: "hindi", valence: 0.75, energy: 0.6, tempo: 95, crnnConfidence: 0.91 },
  { id: "43", title: "Kal Ho Naa Ho", artist: "Sonu Nigam", genre: "pop", language: "hindi", valence: 0.45, energy: 0.55, tempo: 88, crnnConfidence: 0.94 },
  { id: "44", title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh", genre: "pop", language: "hindi", valence: 0.85, energy: 0.9, tempo: 132, crnnConfidence: 0.93 },
  { id: "45", title: "Dil Se Re", artist: "A.R. Rahman", genre: "pop", language: "hindi", valence: 0.6, energy: 0.7, tempo: 105, crnnConfidence: 0.95 },
  { id: "46", title: "Ranjha", artist: "B Praak", genre: "pop", language: "hindi", valence: 0.5, energy: 0.55, tempo: 82, crnnConfidence: 0.90 },
  
  // Disco - Hindi (Bollywood Dance)
  { id: "47", title: "Balam Pichkari", artist: "Vishal Dadlani", genre: "disco", language: "hindi", valence: 0.92, energy: 0.95, tempo: 145, crnnConfidence: 0.88 },
  { id: "48", title: "Badtameez Dil", artist: "Benny Dayal", genre: "disco", language: "hindi", valence: 0.9, energy: 0.92, tempo: 138, crnnConfidence: 0.89 },
  { id: "49", title: "Kar Gayi Chull", artist: "Neha Kakkar", genre: "disco", language: "hindi", valence: 0.88, energy: 0.9, tempo: 128, crnnConfidence: 0.87 },
  { id: "50", title: "London Thumakda", artist: "Labh Janjua", genre: "disco", language: "hindi", valence: 0.9, energy: 0.88, tempo: 125, crnnConfidence: 0.86 },
  
  // Hip-hop - Hindi (Indian Rap)
  { id: "51", title: "Apna Time Aayega", artist: "Divine", genre: "hiphop", language: "hindi", valence: 0.7, energy: 0.85, tempo: 92, crnnConfidence: 0.91 },
  { id: "52", title: "Mere Gully Mein", artist: "Divine & Naezy", genre: "hiphop", language: "hindi", valence: 0.65, energy: 0.8, tempo: 88, crnnConfidence: 0.92 },
  { id: "53", title: "Seedhe Maut", artist: "Seedhe Maut", genre: "hiphop", language: "hindi", valence: 0.55, energy: 0.9, tempo: 140, crnnConfidence: 0.90 },
  { id: "54", title: "Sher Aaya Sher", artist: "Divine", genre: "hiphop", language: "hindi", valence: 0.6, energy: 0.88, tempo: 95, crnnConfidence: 0.89 },
  
  // Classical - Hindi (Hindustani)
  { id: "55", title: "Tere Bina", artist: "A.R. Rahman", genre: "classical", language: "hindi", valence: 0.4, energy: 0.25, tempo: 65, crnnConfidence: 0.93 },
  { id: "56", title: "Lag Ja Gale", artist: "Lata Mangeshkar", genre: "classical", language: "hindi", valence: 0.45, energy: 0.3, tempo: 72, crnnConfidence: 0.95 },
  
  // Rock - Hindi
  { id: "57", title: "Zinda", artist: "Amit Trivedi", genre: "rock", language: "hindi", valence: 0.6, energy: 0.85, tempo: 115, crnnConfidence: 0.88 },
  { id: "58", title: "Khoon Chala", artist: "Indian Ocean", genre: "rock", language: "hindi", valence: 0.5, energy: 0.75, tempo: 108, crnnConfidence: 0.87 },
  
  // Additional Hindi Songs
  { id: "h1", title: "Channa Mereya", artist: "Arijit Singh", genre: "pop", language: "hindi", valence: 0.3, energy: 0.45, tempo: 75, crnnConfidence: 0.93 },
  { id: "h2", title: "Ae Dil Hai Mushkil", artist: "Arijit Singh", genre: "pop", language: "hindi", valence: 0.4, energy: 0.55, tempo: 85, crnnConfidence: 0.92 },
  { id: "h3", title: "Gerua", artist: "Arijit Singh", genre: "pop", language: "hindi", valence: 0.7, energy: 0.6, tempo: 92, crnnConfidence: 0.91 },
  { id: "h4", title: "Phir Le Aya Dil", artist: "Arijit Singh", genre: "pop", language: "hindi", valence: 0.35, energy: 0.4, tempo: 70, crnnConfidence: 0.90 },
  { id: "h5", title: "Mast Magan", artist: "Arijit Singh", genre: "pop", language: "hindi", valence: 0.55, energy: 0.5, tempo: 78, crnnConfidence: 0.89 },
  { id: "h6", title: "Raataan Lambiyan", artist: "Jubin Nautiyal", genre: "pop", language: "hindi", valence: 0.6, energy: 0.5, tempo: 82, crnnConfidence: 0.91 },
  { id: "h7", title: "Lut Gaye", artist: "Jubin Nautiyal", genre: "pop", language: "hindi", valence: 0.45, energy: 0.55, tempo: 88, crnnConfidence: 0.90 },
  { id: "h8", title: "Manike", artist: "Yohani & Jubin Nautiyal", genre: "pop", language: "hindi", valence: 0.8, energy: 0.75, tempo: 105, crnnConfidence: 0.88 },
  { id: "h9", title: "Pasoori", artist: "Ali Sethi & Shae Gill", genre: "pop", language: "hindi", valence: 0.75, energy: 0.7, tempo: 100, crnnConfidence: 0.92 },
  { id: "h10", title: "Jhoom", artist: "Ali Zafar", genre: "pop", language: "hindi", valence: 0.85, energy: 0.82, tempo: 115, crnnConfidence: 0.89 },
  { id: "h11", title: "Kun Faya Kun", artist: "A.R. Rahman", genre: "classical", language: "hindi", valence: 0.5, energy: 0.3, tempo: 68, crnnConfidence: 0.96 },
  { id: "h12", title: "Khwaja Mere Khwaja", artist: "A.R. Rahman", genre: "classical", language: "hindi", valence: 0.55, energy: 0.35, tempo: 72, crnnConfidence: 0.95 },
  { id: "h13", title: "Jai Ho", artist: "A.R. Rahman", genre: "disco", language: "hindi", valence: 0.9, energy: 0.92, tempo: 135, crnnConfidence: 0.94 },
  { id: "h14", title: "Maa Tujhe Salaam", artist: "A.R. Rahman", genre: "classical", language: "hindi", valence: 0.7, energy: 0.6, tempo: 90, crnnConfidence: 0.93 },
  { id: "h15", title: "Tujhe Kitna Chahne Lage", artist: "Arijit Singh", genre: "pop", language: "hindi", valence: 0.4, energy: 0.45, tempo: 76, crnnConfidence: 0.91 },
  { id: "h16", title: "Shayad", artist: "Arijit Singh", genre: "pop", language: "hindi", valence: 0.5, energy: 0.48, tempo: 80, crnnConfidence: 0.90 },
  { id: "h17", title: "Hawayein", artist: "Arijit Singh", genre: "pop", language: "hindi", valence: 0.6, energy: 0.52, tempo: 84, crnnConfidence: 0.92 },
  { id: "h18", title: "Pehla Nasha", artist: "Udit Narayan", genre: "pop", language: "hindi", valence: 0.75, energy: 0.6, tempo: 95, crnnConfidence: 0.94 },
  { id: "h19", title: "Tum Se Hi", artist: "Mohit Chauhan", genre: "rock", language: "hindi", valence: 0.65, energy: 0.55, tempo: 88, crnnConfidence: 0.91 },
  { id: "h20", title: "Masakali", artist: "Mohit Chauhan", genre: "pop", language: "hindi", valence: 0.7, energy: 0.65, tempo: 102, crnnConfidence: 0.90 },
  { id: "h21", title: "Sadda Haq", artist: "Mohit Chauhan", genre: "rock", language: "hindi", valence: 0.6, energy: 0.82, tempo: 118, crnnConfidence: 0.89 },
  { id: "h22", title: "Kabira", artist: "Rekha Bhardwaj", genre: "pop", language: "hindi", valence: 0.55, energy: 0.5, tempo: 85, crnnConfidence: 0.92 },
  { id: "h23", title: "Ilahi", artist: "Arijit Singh", genre: "pop", language: "hindi", valence: 0.8, energy: 0.72, tempo: 108, crnnConfidence: 0.91 },
  { id: "h24", title: "Agar Tum Saath Ho", artist: "Arijit Singh & Alka Yagnik", genre: "pop", language: "hindi", valence: 0.35, energy: 0.4, tempo: 72, crnnConfidence: 0.93 },
  { id: "h25", title: "Bulleya", artist: "Amit Mishra", genre: "pop", language: "hindi", valence: 0.55, energy: 0.65, tempo: 95, crnnConfidence: 0.90 },
  { id: "h26", title: "Ghungroo", artist: "Arijit Singh", genre: "disco", language: "hindi", valence: 0.88, energy: 0.9, tempo: 128, crnnConfidence: 0.89 },
  { id: "h27", title: "Bekhayali", artist: "Sachet Tandon", genre: "rock", language: "hindi", valence: 0.4, energy: 0.7, tempo: 105, crnnConfidence: 0.91 },
  { id: "h28", title: "O Saathi", artist: "Atif Aslam", genre: "pop", language: "hindi", valence: 0.45, energy: 0.5, tempo: 82, crnnConfidence: 0.92 },
  { id: "h29", title: "Tere Sang Yaara", artist: "Atif Aslam", genre: "pop", language: "hindi", valence: 0.6, energy: 0.55, tempo: 88, crnnConfidence: 0.90 },
  { id: "h30", title: "Pee Loon", artist: "Mohit Chauhan", genre: "pop", language: "hindi", valence: 0.65, energy: 0.58, tempo: 90, crnnConfidence: 0.91 },
  { id: "h31", title: "Khairiyat", artist: "Arijit Singh", genre: "pop", language: "hindi", valence: 0.45, energy: 0.48, tempo: 78, crnnConfidence: 0.93 },
  { id: "h32", title: "Deva Deva", artist: "Arijit Singh", genre: "pop", language: "hindi", valence: 0.7, energy: 0.6, tempo: 92, crnnConfidence: 0.90 },
  { id: "h33", title: "Kala Chashma", artist: "Neha Kakkar & Badshah", genre: "disco", language: "hindi", valence: 0.92, energy: 0.95, tempo: 148, crnnConfidence: 0.88 },
  { id: "h34", title: "First Class", artist: "Arijit Singh", genre: "disco", language: "hindi", valence: 0.88, energy: 0.88, tempo: 130, crnnConfidence: 0.87 },
  { id: "h35", title: "Aankhon Mein Teri", artist: "K.K.", genre: "pop", language: "hindi", valence: 0.65, energy: 0.55, tempo: 85, crnnConfidence: 0.94 },
  { id: "h36", title: "Pal", artist: "K.K.", genre: "pop", language: "hindi", valence: 0.55, energy: 0.5, tempo: 82, crnnConfidence: 0.93 },
  { id: "h37", title: "Tu Hi Meri Shab Hai", artist: "K.K.", genre: "pop", language: "hindi", valence: 0.5, energy: 0.48, tempo: 78, crnnConfidence: 0.92 },
  { id: "h38", title: "Tadap Tadap", artist: "K.K.", genre: "pop", language: "hindi", valence: 0.25, energy: 0.6, tempo: 95, crnnConfidence: 0.91 },
  { id: "h39", title: "Naam Gum Jaayega", artist: "Amit Trivedi", genre: "rock", language: "hindi", valence: 0.5, energy: 0.7, tempo: 105, crnnConfidence: 0.88 },
  { id: "h40", title: "Naina Da Kya Kasoor", artist: "Amit Trivedi", genre: "pop", language: "hindi", valence: 0.4, energy: 0.45, tempo: 75, crnnConfidence: 0.89 },

  // ==================== TAMIL ====================
  // Pop - Tamil
  { id: "59", title: "Why This Kolaveri Di", artist: "Dhanush", genre: "pop", language: "tamil", valence: 0.65, energy: 0.7, tempo: 92, crnnConfidence: 0.91 },
  { id: "60", title: "Rowdy Baby", artist: "Dhanush & Dhee", genre: "pop", language: "tamil", valence: 0.9, energy: 0.92, tempo: 135, crnnConfidence: 0.93 },
  { id: "61", title: "Vaathi Coming", artist: "Anirudh", genre: "pop", language: "tamil", valence: 0.85, energy: 0.9, tempo: 128, crnnConfidence: 0.92 },
  { id: "62", title: "Kaathu Payum", artist: "Anirudh", genre: "pop", language: "tamil", valence: 0.8, energy: 0.85, tempo: 118, crnnConfidence: 0.90 },
  
  // Classical - Tamil (Carnatic influenced)
  { id: "63", title: "Kannalane", artist: "K.S. Chithra", genre: "classical", language: "tamil", valence: 0.55, energy: 0.35, tempo: 68, crnnConfidence: 0.94 },
  { id: "64", title: "Thendral Vanthu", artist: "S.P. Balasubrahmanyam", genre: "classical", language: "tamil", valence: 0.5, energy: 0.3, tempo: 75, crnnConfidence: 0.95 },
  
  // Rock - Tamil
  { id: "65", title: "Aalaporan Tamizhan", artist: "A.R. Rahman", genre: "rock", language: "tamil", valence: 0.7, energy: 0.85, tempo: 125, crnnConfidence: 0.89 },
  { id: "66", title: "Kutti Story", artist: "Anirudh", genre: "rock", language: "tamil", valence: 0.75, energy: 0.8, tempo: 110, crnnConfidence: 0.88 },
  
  // Hip-hop - Tamil
  { id: "67", title: "Beep", artist: "Anirudh", genre: "hiphop", language: "tamil", valence: 0.6, energy: 0.8, tempo: 95, crnnConfidence: 0.87 },
  { id: "68", title: "Arabic Kuthu", artist: "Anirudh", genre: "hiphop", language: "tamil", valence: 0.85, energy: 0.9, tempo: 130, crnnConfidence: 0.90 },
  
  // Additional Tamil Songs
  { id: "t1", title: "Kaththi Sandai", artist: "Anirudh", genre: "pop", language: "tamil", valence: 0.82, energy: 0.85, tempo: 125, crnnConfidence: 0.89 },
  { id: "t2", title: "Surviva", artist: "Anirudh", genre: "rock", language: "tamil", valence: 0.7, energy: 0.88, tempo: 135, crnnConfidence: 0.90 },
  { id: "t3", title: "Master the Blaster", artist: "Anirudh", genre: "disco", language: "tamil", valence: 0.88, energy: 0.92, tempo: 140, crnnConfidence: 0.91 },
  { id: "t4", title: "Jolly O Gymkhana", artist: "Anirudh", genre: "disco", language: "tamil", valence: 0.9, energy: 0.9, tempo: 135, crnnConfidence: 0.88 },
  { id: "t5", title: "Selfie Pulla", artist: "Anirudh", genre: "pop", language: "tamil", valence: 0.85, energy: 0.82, tempo: 118, crnnConfidence: 0.87 },
  { id: "t6", title: "Verithanam", artist: "A.R. Rahman", genre: "disco", language: "tamil", valence: 0.88, energy: 0.9, tempo: 132, crnnConfidence: 0.93 },
  { id: "t7", title: "Roja Kadhal Rojave", artist: "S.P. Balasubrahmanyam", genre: "classical", language: "tamil", valence: 0.6, energy: 0.4, tempo: 72, crnnConfidence: 0.96 },
  { id: "t8", title: "Munbe Vaa", artist: "A.R. Rahman", genre: "classical", language: "tamil", valence: 0.55, energy: 0.35, tempo: 68, crnnConfidence: 0.95 },
  { id: "t9", title: "Enna Solla", artist: "A.R. Rahman", genre: "pop", language: "tamil", valence: 0.45, energy: 0.5, tempo: 82, crnnConfidence: 0.92 },
  { id: "t10", title: "Nenjukkul Peidhidum", artist: "Harris Jayaraj", genre: "pop", language: "tamil", valence: 0.65, energy: 0.55, tempo: 88, crnnConfidence: 0.91 },
  { id: "t11", title: "Uyire", artist: "A.R. Rahman", genre: "classical", language: "tamil", valence: 0.5, energy: 0.38, tempo: 70, crnnConfidence: 0.94 },
  { id: "t12", title: "Kadhal Sadugudu", artist: "A.R. Rahman", genre: "pop", language: "tamil", valence: 0.75, energy: 0.7, tempo: 105, crnnConfidence: 0.92 },
  { id: "t13", title: "Vaseegara", artist: "Bombay Jayashri", genre: "pop", language: "tamil", valence: 0.7, energy: 0.55, tempo: 85, crnnConfidence: 0.93 },
  { id: "t14", title: "Puthu Vellai Mazhai", artist: "A.R. Rahman", genre: "classical", language: "tamil", valence: 0.6, energy: 0.42, tempo: 75, crnnConfidence: 0.95 },
  { id: "t15", title: "Snehidhane", artist: "A.R. Rahman", genre: "pop", language: "tamil", valence: 0.5, energy: 0.48, tempo: 80, crnnConfidence: 0.92 },
  { id: "t16", title: "Ennodu Nee Irundhaal", artist: "Sid Sriram", genre: "pop", language: "tamil", valence: 0.55, energy: 0.5, tempo: 78, crnnConfidence: 0.91 },
  { id: "t17", title: "Maruvaarthai", artist: "Sid Sriram", genre: "pop", language: "tamil", valence: 0.4, energy: 0.45, tempo: 72, crnnConfidence: 0.92 },
  { id: "t18", title: "Visiri", artist: "Sid Sriram", genre: "pop", language: "tamil", valence: 0.5, energy: 0.55, tempo: 85, crnnConfidence: 0.90 },
  { id: "t19", title: "Naane Varugiraen", artist: "Harris Jayaraj", genre: "classical", language: "tamil", valence: 0.55, energy: 0.4, tempo: 70, crnnConfidence: 0.93 },
  { id: "t20", title: "Nee Venunda Chellam", artist: "Harris Jayaraj", genre: "pop", language: "tamil", valence: 0.72, energy: 0.65, tempo: 95, crnnConfidence: 0.91 },
  { id: "t21", title: "Azhagiya Soodana Poovey", artist: "Anirudh", genre: "pop", language: "tamil", valence: 0.75, energy: 0.68, tempo: 100, crnnConfidence: 0.89 },
  { id: "t22", title: "Enna Sona", artist: "Sid Sriram", genre: "pop", language: "tamil", valence: 0.5, energy: 0.52, tempo: 82, crnnConfidence: 0.90 },
  { id: "t23", title: "Po Nee Po", artist: "Kamal Haasan", genre: "pop", language: "tamil", valence: 0.45, energy: 0.5, tempo: 78, crnnConfidence: 0.88 },
  { id: "t24", title: "Othaiyadi Pathayila", artist: "Anirudh", genre: "pop", language: "tamil", valence: 0.6, energy: 0.62, tempo: 92, crnnConfidence: 0.87 },
  { id: "t25", title: "Vaa Vaathi", artist: "Anirudh", genre: "disco", language: "tamil", valence: 0.88, energy: 0.88, tempo: 128, crnnConfidence: 0.90 },
  { id: "t26", title: "Kaattu Kuyilu", artist: "Ilaiyaraaja", genre: "classical", language: "tamil", valence: 0.65, energy: 0.45, tempo: 80, crnnConfidence: 0.96 },
  { id: "t27", title: "Thendral Vandhu", artist: "Ilaiyaraaja", genre: "classical", language: "tamil", valence: 0.6, energy: 0.38, tempo: 72, crnnConfidence: 0.97 },
  { id: "t28", title: "Poo Pookum Osai", artist: "Ilaiyaraaja", genre: "classical", language: "tamil", valence: 0.55, energy: 0.4, tempo: 75, crnnConfidence: 0.95 },
  { id: "t29", title: "Ilamai Thirumbudhe", artist: "Anirudh", genre: "pop", language: "tamil", valence: 0.78, energy: 0.72, tempo: 105, crnnConfidence: 0.88 },
  { id: "t30", title: "Chellamma", artist: "Anirudh", genre: "disco", language: "tamil", valence: 0.85, energy: 0.85, tempo: 125, crnnConfidence: 0.89 },
  { id: "t31", title: "Kannazhaga", artist: "Anirudh", genre: "pop", language: "tamil", valence: 0.65, energy: 0.6, tempo: 90, crnnConfidence: 0.88 },
  { id: "t32", title: "Soppanasundari", artist: "Anirudh", genre: "pop", language: "tamil", valence: 0.75, energy: 0.7, tempo: 98, crnnConfidence: 0.87 },
  { id: "t33", title: "Hey Penne", artist: "Yuvan Shankar Raja", genre: "pop", language: "tamil", valence: 0.7, energy: 0.65, tempo: 95, crnnConfidence: 0.90 },
  { id: "t34", title: "Idhazhin Oram", artist: "Yuvan Shankar Raja", genre: "pop", language: "tamil", valence: 0.45, energy: 0.48, tempo: 78, crnnConfidence: 0.91 },
  { id: "t35", title: "Nee Partha Vizhigal", artist: "Yuvan Shankar Raja", genre: "pop", language: "tamil", valence: 0.55, energy: 0.52, tempo: 82, crnnConfidence: 0.89 },

  // ==================== KANNADA ====================
  // Pop - Kannada
  { id: "69", title: "Bombe Helutaithe", artist: "Sonu Nigam", genre: "pop", language: "kannada", valence: 0.75, energy: 0.6, tempo: 88, crnnConfidence: 0.91 },
  { id: "70", title: "Hrudayake Hedarike", artist: "Sonu Nigam", genre: "pop", language: "kannada", valence: 0.4, energy: 0.5, tempo: 78, crnnConfidence: 0.90 },
  { id: "71", title: "Belageddu", artist: "Armaan Malik", genre: "pop", language: "kannada", valence: 0.8, energy: 0.7, tempo: 98, crnnConfidence: 0.89 },
  { id: "72", title: "Yaare Koogadali", artist: "Sonu Nigam", genre: "pop", language: "kannada", valence: 0.5, energy: 0.45, tempo: 82, crnnConfidence: 0.88 },
  
  // Rock - Kannada
  { id: "73", title: "Tagaru Banthu Tagaru", artist: "Kailash Kher", genre: "rock", language: "kannada", valence: 0.7, energy: 0.9, tempo: 140, crnnConfidence: 0.87 },
  { id: "74", title: "Hey Pilla", artist: "Raghu Dixit", genre: "rock", language: "kannada", valence: 0.8, energy: 0.75, tempo: 105, crnnConfidence: 0.86 },
  
  // Classical - Kannada
  { id: "75", title: "Naguva Nayana", artist: "S.P. Balasubrahmanyam", genre: "classical", language: "kannada", valence: 0.6, energy: 0.35, tempo: 70, crnnConfidence: 0.93 },
  
  // Additional Kannada Songs
  { id: "k1", title: "Maadeva", artist: "Sanjith Hegde", genre: "pop", language: "kannada", valence: 0.7, energy: 0.65, tempo: 95, crnnConfidence: 0.88 },
  { id: "k2", title: "Baarisu Kannada Dindimava", artist: "Rajkumar", genre: "pop", language: "kannada", valence: 0.8, energy: 0.72, tempo: 105, crnnConfidence: 0.92 },
  { id: "k3", title: "Naanu Nanna Hendthi", artist: "S.P. Balasubrahmanyam", genre: "pop", language: "kannada", valence: 0.75, energy: 0.65, tempo: 92, crnnConfidence: 0.91 },
  { id: "k4", title: "Huttidare Kannada Nadalli", artist: "Rajkumar", genre: "pop", language: "kannada", valence: 0.85, energy: 0.75, tempo: 108, crnnConfidence: 0.93 },
  { id: "k5", title: "Aakasha Deepavu Neenu", artist: "S.P. Balasubrahmanyam", genre: "classical", language: "kannada", valence: 0.55, energy: 0.4, tempo: 75, crnnConfidence: 0.94 },
  { id: "k6", title: "Yako Baralu", artist: "Vijay Prakash", genre: "pop", language: "kannada", valence: 0.6, energy: 0.55, tempo: 85, crnnConfidence: 0.89 },
  { id: "k7", title: "Ello Maleyaagide", artist: "Vijay Prakash", genre: "pop", language: "kannada", valence: 0.45, energy: 0.48, tempo: 78, crnnConfidence: 0.90 },
  { id: "k8", title: "Ee Bhoomi Bannada Buguri", artist: "B.R. Chaya", genre: "classical", language: "kannada", valence: 0.5, energy: 0.38, tempo: 70, crnnConfidence: 0.92 },
  { id: "k9", title: "Mussanje Maathu", artist: "Sonu Nigam", genre: "pop", language: "kannada", valence: 0.55, energy: 0.52, tempo: 82, crnnConfidence: 0.88 },
  { id: "k10", title: "Preethse Antha", artist: "Sonu Nigam", genre: "pop", language: "kannada", valence: 0.65, energy: 0.58, tempo: 88, crnnConfidence: 0.89 },
  { id: "k11", title: "Ninna Danigaagi", artist: "Sonu Nigam", genre: "pop", language: "kannada", valence: 0.5, energy: 0.5, tempo: 80, crnnConfidence: 0.90 },
  { id: "k12", title: "Janapada Veera", artist: "Rajkumar", genre: "rock", language: "kannada", valence: 0.75, energy: 0.82, tempo: 120, crnnConfidence: 0.87 },
  { id: "k13", title: "Yella Krishna Maayave", artist: "Shankar Mahadevan", genre: "classical", language: "kannada", valence: 0.6, energy: 0.42, tempo: 72, crnnConfidence: 0.93 },
  { id: "k14", title: "Noorondu Nenapu", artist: "Rajkumar", genre: "pop", language: "kannada", valence: 0.7, energy: 0.6, tempo: 90, crnnConfidence: 0.91 },
  { id: "k15", title: "Aa Dinagalu", artist: "Haricharan", genre: "pop", language: "kannada", valence: 0.55, energy: 0.55, tempo: 85, crnnConfidence: 0.88 },
  { id: "k16", title: "Manase Manase", artist: "Shankar Mahadevan", genre: "pop", language: "kannada", valence: 0.6, energy: 0.58, tempo: 88, crnnConfidence: 0.89 },
  { id: "k17", title: "Yaarige Yaaruntu", artist: "Vijay Prakash", genre: "pop", language: "kannada", valence: 0.45, energy: 0.48, tempo: 78, crnnConfidence: 0.87 },
  { id: "k18", title: "Aleya Sayda", artist: "Sanjith Hegde", genre: "pop", language: "kannada", valence: 0.5, energy: 0.52, tempo: 82, crnnConfidence: 0.86 },
  { id: "k19", title: "Bombe Adsonu", artist: "Sanjith Hegde", genre: "pop", language: "kannada", valence: 0.7, energy: 0.65, tempo: 95, crnnConfidence: 0.88 },
  { id: "k20", title: "Kranti Veera", artist: "Rajkumar", genre: "rock", language: "kannada", valence: 0.7, energy: 0.85, tempo: 125, crnnConfidence: 0.86 },
  { id: "k21", title: "Gombe Helutaithe", artist: "Arjun Janya", genre: "pop", language: "kannada", valence: 0.8, energy: 0.72, tempo: 102, crnnConfidence: 0.87 },
  { id: "k22", title: "Mungaru Male", artist: "Sonu Nigam", genre: "pop", language: "kannada", valence: 0.65, energy: 0.6, tempo: 90, crnnConfidence: 0.90 },
  { id: "k23", title: "Cheluvina Chilipili", artist: "Raghu Dixit", genre: "pop", language: "kannada", valence: 0.85, energy: 0.78, tempo: 110, crnnConfidence: 0.85 },
  { id: "k24", title: "Mysooru Mallige", artist: "K.J. Yesudas", genre: "classical", language: "kannada", valence: 0.6, energy: 0.4, tempo: 72, crnnConfidence: 0.94 },
  { id: "k25", title: "Onde Ondu Sari", artist: "Shankar Mahadevan", genre: "pop", language: "kannada", valence: 0.7, energy: 0.68, tempo: 98, crnnConfidence: 0.88 },
  { id: "k26", title: "Kanne Kanasugala", artist: "Arjun Janya", genre: "pop", language: "kannada", valence: 0.55, energy: 0.52, tempo: 82, crnnConfidence: 0.87 },
  { id: "k27", title: "Kariya I Love You", artist: "Raghu Dixit", genre: "disco", language: "kannada", valence: 0.9, energy: 0.88, tempo: 130, crnnConfidence: 0.84 },
  { id: "k28", title: "Modalaa Modalaa", artist: "Arjun Janya", genre: "disco", language: "kannada", valence: 0.85, energy: 0.85, tempo: 125, crnnConfidence: 0.86 },
  { id: "k29", title: "Sanju Weds Geetha", artist: "Harikrishna", genre: "pop", language: "kannada", valence: 0.75, energy: 0.7, tempo: 100, crnnConfidence: 0.87 },
  { id: "k30", title: "KGF Salaam Rocky Bhai", artist: "Ravi Basrur", genre: "rock", language: "kannada", valence: 0.65, energy: 0.9, tempo: 140, crnnConfidence: 0.89 },
  { id: "k31", title: "KGF Garbadhi", artist: "Ananya Bhat", genre: "rock", language: "kannada", valence: 0.55, energy: 0.82, tempo: 118, crnnConfidence: 0.88 },
  { id: "k32", title: "Toofan", artist: "Ravi Basrur", genre: "rock", language: "kannada", valence: 0.6, energy: 0.88, tempo: 135, crnnConfidence: 0.87 },
  { id: "k33", title: "Yajamana Title Track", artist: "Harikrishna", genre: "rock", language: "kannada", valence: 0.7, energy: 0.85, tempo: 128, crnnConfidence: 0.86 },
  { id: "k34", title: "Pogaru Mass Song", artist: "Chandan Shetty", genre: "disco", language: "kannada", valence: 0.88, energy: 0.9, tempo: 138, crnnConfidence: 0.85 },
  { id: "k35", title: "I Am Villan", artist: "Chandan Shetty", genre: "hiphop", language: "kannada", valence: 0.65, energy: 0.82, tempo: 105, crnnConfidence: 0.84 },

  // ==================== TELUGU ====================
  // Pop - Telugu
  { id: "76", title: "Oo Antava", artist: "Indravathi Chauhan", genre: "pop", language: "telugu", valence: 0.85, energy: 0.88, tempo: 125, crnnConfidence: 0.91 },
  { id: "77", title: "Samajavaragamana", artist: "Sid Sriram", genre: "pop", language: "telugu", valence: 0.55, energy: 0.45, tempo: 75, crnnConfidence: 0.94 },
  { id: "78", title: "Butta Bomma", artist: "Armaan Malik", genre: "pop", language: "telugu", valence: 0.8, energy: 0.7, tempo: 95, crnnConfidence: 0.92 },
  { id: "79", title: "Srivalli", artist: "Sid Sriram", genre: "pop", language: "telugu", valence: 0.7, energy: 0.65, tempo: 88, crnnConfidence: 0.91 },
  
  // Disco - Telugu
  { id: "80", title: "Naatu Naatu", artist: "Rahul Sipligunj", genre: "disco", language: "telugu", valence: 0.95, energy: 0.98, tempo: 150, crnnConfidence: 0.96 },
  { id: "81", title: "Ramulo Ramula", artist: "Anurag Kulkarni", genre: "disco", language: "telugu", valence: 0.9, energy: 0.92, tempo: 138, crnnConfidence: 0.90 },

  // ==================== KOREAN ====================
  // Pop - Korean (K-Pop)
  { id: "82", title: "Dynamite", artist: "BTS", genre: "pop", language: "korean", valence: 0.92, energy: 0.88, tempo: 114, crnnConfidence: 0.97 },
  { id: "83", title: "DDU-DU DDU-DU", artist: "BLACKPINK", genre: "pop", language: "korean", valence: 0.8, energy: 0.9, tempo: 147, crnnConfidence: 0.96 },
  { id: "84", title: "Gangnam Style", artist: "PSY", genre: "pop", language: "korean", valence: 0.9, energy: 0.95, tempo: 132, crnnConfidence: 0.98 },
  { id: "85", title: "How You Like That", artist: "BLACKPINK", genre: "pop", language: "korean", valence: 0.75, energy: 0.92, tempo: 130, crnnConfidence: 0.95 },
  { id: "86", title: "Butter", artist: "BTS", genre: "pop", language: "korean", valence: 0.88, energy: 0.8, tempo: 110, crnnConfidence: 0.96 },
  { id: "87", title: "Love Shot", artist: "EXO", genre: "pop", language: "korean", valence: 0.7, energy: 0.75, tempo: 102, crnnConfidence: 0.93 },
  
  // Hip-hop - Korean
  { id: "88", title: "No More Dream", artist: "BTS", genre: "hiphop", language: "korean", valence: 0.6, energy: 0.85, tempo: 90, crnnConfidence: 0.91 },
  { id: "89", title: "Daechwita", artist: "Agust D", genre: "hiphop", language: "korean", valence: 0.45, energy: 0.88, tempo: 95, crnnConfidence: 0.92 },

  // ==================== SPANISH ====================
  // Pop - Spanish (Latin Pop/Reggaeton)
  { id: "90", title: "Despacito", artist: "Luis Fonsi", genre: "pop", language: "spanish", valence: 0.85, energy: 0.78, tempo: 89, crnnConfidence: 0.95 },
  { id: "91", title: "Bailando", artist: "Enrique Iglesias", genre: "pop", language: "spanish", valence: 0.88, energy: 0.8, tempo: 95, crnnConfidence: 0.94 },
  { id: "92", title: "La Camisa Negra", artist: "Juanes", genre: "pop", language: "spanish", valence: 0.65, energy: 0.72, tempo: 105, crnnConfidence: 0.92 },
  { id: "93", title: "Vivir Mi Vida", artist: "Marc Anthony", genre: "pop", language: "spanish", valence: 0.9, energy: 0.85, tempo: 98, crnnConfidence: 0.93 },
  
  // Reggae - Spanish (Reggaeton)
  { id: "94", title: "Gasolina", artist: "Daddy Yankee", genre: "reggae", language: "spanish", valence: 0.85, energy: 0.92, tempo: 100, crnnConfidence: 0.90 },
  { id: "95", title: "Danza Kuduro", artist: "Don Omar", genre: "reggae", language: "spanish", valence: 0.9, energy: 0.9, tempo: 130, crnnConfidence: 0.89 },
  
  // Rock - Spanish
  { id: "96", title: "De Música Ligera", artist: "Soda Stereo", genre: "rock", language: "spanish", valence: 0.7, energy: 0.75, tempo: 120, crnnConfidence: 0.91 },

  // ==================== JAPANESE ====================
  // Pop - Japanese (J-Pop)
  { id: "97", title: "Lemon", artist: "Kenshi Yonezu", genre: "pop", language: "japanese", valence: 0.4, energy: 0.55, tempo: 87, crnnConfidence: 0.93 },
  { id: "98", title: "Pretender", artist: "Official HIGE DANdism", genre: "pop", language: "japanese", valence: 0.6, energy: 0.7, tempo: 92, crnnConfidence: 0.92 },
  { id: "99", title: "Gurenge", artist: "LiSA", genre: "pop", language: "japanese", valence: 0.7, energy: 0.88, tempo: 135, crnnConfidence: 0.94 },
  
  // Rock - Japanese
  { id: "100", title: "Unravel", artist: "TK from Ling Tosite Sigure", genre: "rock", language: "japanese", valence: 0.35, energy: 0.85, tempo: 140, crnnConfidence: 0.91 },
  { id: "101", title: "The Beginning", artist: "ONE OK ROCK", genre: "rock", language: "japanese", valence: 0.6, energy: 0.9, tempo: 145, crnnConfidence: 0.93 },
  
  // Metal - Japanese
  { id: "102", title: "Karate", artist: "BABYMETAL", genre: "metal", language: "japanese", valence: 0.5, energy: 0.95, tempo: 160, crnnConfidence: 0.90 },

  // ==================== PUNJABI ====================
  // Pop - Punjabi
  { id: "103", title: "Brown Munde", artist: "AP Dhillon", genre: "pop", language: "punjabi", valence: 0.75, energy: 0.85, tempo: 98, crnnConfidence: 0.91 },
  { id: "104", title: "Excuses", artist: "AP Dhillon", genre: "pop", language: "punjabi", valence: 0.6, energy: 0.7, tempo: 90, crnnConfidence: 0.90 },
  { id: "105", title: "Lahore", artist: "Guru Randhawa", genre: "pop", language: "punjabi", valence: 0.85, energy: 0.88, tempo: 118, crnnConfidence: 0.89 },
  { id: "106", title: "High Rated Gabru", artist: "Guru Randhawa", genre: "pop", language: "punjabi", valence: 0.82, energy: 0.85, tempo: 112, crnnConfidence: 0.88 },
  
  // Hip-hop - Punjabi
  { id: "107", title: "Elevated", artist: "Shubh", genre: "hiphop", language: "punjabi", valence: 0.6, energy: 0.78, tempo: 85, crnnConfidence: 0.87 },
  { id: "108", title: "We Rollin", artist: "Shubh", genre: "hiphop", language: "punjabi", valence: 0.55, energy: 0.75, tempo: 82, crnnConfidence: 0.88 },
  
  // Disco - Punjabi (Bhangra)
  { id: "109", title: "Mundian To Bach Ke", artist: "Panjabi MC", genre: "disco", language: "punjabi", valence: 0.9, energy: 0.92, tempo: 138, crnnConfidence: 0.92 },
  { id: "110", title: "Tunak Tunak Tun", artist: "Daler Mehndi", genre: "disco", language: "punjabi", valence: 0.95, energy: 0.95, tempo: 145, crnnConfidence: 0.94 },

  // ==================== MALAYALAM ====================
  // Pop - Malayalam
  { id: "111", title: "Jeevamshamayi", artist: "KS Harisankar", genre: "pop", language: "malayalam", valence: 0.5, energy: 0.55, tempo: 85, crnnConfidence: 0.90 },
  { id: "112", title: "Entammede Jimikki Kammal", artist: "Vineeth Sreenivasan", genre: "pop", language: "malayalam", valence: 0.88, energy: 0.85, tempo: 125, crnnConfidence: 0.89 },
  { id: "113", title: "Kaathil Thenmazhayaai", artist: "Haricharan", genre: "pop", language: "malayalam", valence: 0.55, energy: 0.5, tempo: 78, crnnConfidence: 0.88 },

  // ==================== FRENCH ====================
  // Pop - French
  { id: "114", title: "Alors on danse", artist: "Stromae", genre: "pop", language: "french", valence: 0.6, energy: 0.78, tempo: 120, crnnConfidence: 0.93 },
  { id: "115", title: "Papaoutai", artist: "Stromae", genre: "pop", language: "french", valence: 0.5, energy: 0.75, tempo: 115, crnnConfidence: 0.92 },
  { id: "116", title: "La Vie en Rose", artist: "Edith Piaf", genre: "jazz", language: "french", valence: 0.7, energy: 0.4, tempo: 68, crnnConfidence: 0.95 },

  // ==================== PORTUGUESE ====================
  // Pop - Portuguese (Brazilian)
  { id: "117", title: "Ai Se Eu Te Pego", artist: "Michel Teló", genre: "pop", language: "portuguese", valence: 0.92, energy: 0.88, tempo: 142, crnnConfidence: 0.91 },
  { id: "118", title: "Magalenha", artist: "Sergio Mendes", genre: "pop", language: "portuguese", valence: 0.85, energy: 0.8, tempo: 115, crnnConfidence: 0.90 },
  
  // Reggae - Portuguese
  { id: "119", title: "Deixa Eu Dizer", artist: "Claudia Leitte", genre: "reggae", language: "portuguese", valence: 0.75, energy: 0.65, tempo: 90, crnnConfidence: 0.88 },

  // ==================== ARABIC ====================
  // Pop - Arabic
  { id: "120", title: "Habibi Ya Nour El Ain", artist: "Amr Diab", genre: "pop", language: "arabic", valence: 0.8, energy: 0.72, tempo: 105, crnnConfidence: 0.91 },
  { id: "121", title: "Tamally Maak", artist: "Amr Diab", genre: "pop", language: "arabic", valence: 0.75, energy: 0.68, tempo: 98, crnnConfidence: 0.90 },
  { id: "122", title: "3 Daqat", artist: "Abu", genre: "pop", language: "arabic", valence: 0.7, energy: 0.6, tempo: 88, crnnConfidence: 0.89 },
];

export const genres = GTZAN_GENRES;
export const languages = LANGUAGES;
export const artists = [...new Set(mockSongs.map(s => s.artist))];
