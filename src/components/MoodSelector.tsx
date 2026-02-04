import { motion } from "framer-motion";
import { MoodType, moodPoints } from "@/data/songs";
import { cn } from "@/lib/utils";

interface MoodSelectorProps {
  label: string;
  selectedMood: MoodType | null;
  onSelect: (mood: MoodType) => void;
}

const moodColors: Record<MoodType, string> = {
  sad: "from-blue-600/30 to-purple-600/20 hover:from-blue-600/50 hover:to-purple-600/40",
  calm: "from-cyan-600/30 to-teal-600/20 hover:from-cyan-600/50 hover:to-teal-600/40",
  happy: "from-yellow-500/30 to-orange-500/20 hover:from-yellow-500/50 hover:to-orange-500/40",
  energetic: "from-orange-500/30 to-red-500/20 hover:from-orange-500/50 hover:to-red-500/40",
  angry: "from-red-600/30 to-rose-600/20 hover:from-red-600/50 hover:to-rose-600/40",
};

const moodBorders: Record<MoodType, string> = {
  sad: "ring-blue-500",
  calm: "ring-cyan-500",
  happy: "ring-yellow-400",
  energetic: "ring-orange-500",
  angry: "ring-red-500",
};

export function MoodSelector({ label, selectedMood, onSelect }: MoodSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{label}</h3>
      <div className="grid grid-cols-5 gap-3">
        {(Object.keys(moodPoints) as MoodType[]).map((moodType) => {
          const mood = moodPoints[moodType];
          const isSelected = selectedMood === moodType;

          return (
            <motion.button
              key={moodType}
              onClick={() => onSelect(moodType)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "mood-selector bg-gradient-to-br",
                moodColors[moodType],
                isSelected && `selected ${moodBorders[moodType]}`
              )}
            >
              <motion.span
                className="text-4xl"
                animate={{ scale: isSelected ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {mood.emoji}
              </motion.span>
              <span className="text-sm font-medium">{mood.label}</span>
              <span className="text-xs text-muted-foreground text-center">
                {mood.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
