// Initialize with two empty ideas
export const initialIdeas = [
  {
    name: "",
    description: "",
    effort: 1,
    knowledge: 1,
    interest: 1,
    fun: 1,
    time: 1,
    difficulty: 1,
    showDescription: false,
  },
  {
    name: "",
    description: "",
    effort: 1,
    knowledge: 1,
    interest: 1,
    fun: 1,
    time: 1,
    difficulty: 1,
    showDescription: false,
  },
];

// Scoring Mechanism Presets
export const scoringPresets = {
  default: {
    effort: 1,
    knowledge: 1.2,
    interest: 2,
    fun: 1.5,
    time: 1,
    difficulty: 1,
  },
  // emphasis on time
  timeCritical: {
    effort: 1.2,
    knowledge: 1.2,
    interest: 1,
    fun: 1,
    time: 2,
    difficulty: 1,
  },
  // emphasis on interest and fun
  passionDriven: {
    effort: 0.8,
    knowledge: 1,
    interest: 3,
    fun: 2,
    time: 1,
    difficulty: 0.8,
  },
  // emphasis on reducing effort
  effortOptimized: {
    effort: 2,
    knowledge: 1.5,
    interest: 1,
    fun: 1,
    time: 1,
    difficulty: 2,
  },
};
