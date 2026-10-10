export type AnimationKey = "grid" | "neural" | "particles" | "orbit" | "matrix" | "minimal";

export type ThemeColors = {
  bg: string;
  bgElev: string;
  bgElev2: string;
  fg: string;
  fgMuted: string;
  fgSubtle: string;
  border: string;
  borderStrong: string;
  accent: string;
  accent2: string;
  accentText: string;
};

export type ThemeDefinition = {
  key: string;
  name: string;
  description: string;
  colors: ThemeColors;
  fontSerif: string;
  fontSans: string;
  animation: AnimationKey;
  order: number;
};

export const THEMES: ThemeDefinition[] = [
  {
    key: "neon-violet",
    name: "Neon Violet",
    description: "Violet-to-cyan neural network field on near-black.",
    colors: {
      bg: "#07070d", bgElev: "#0e0e17", bgElev2: "#13131f",
      fg: "#f5f5f9", fgMuted: "#a3a3b5", fgSubtle: "#75758a",
      border: "rgba(170,160,255,0.09)", borderStrong: "rgba(180,170,255,0.16)",
      accent: "#8b5cf6", accent2: "#22d3ee", accentText: "#ffffff",
    },
    fontSerif: "Instrument Serif", fontSans: "Inter",
    animation: "neural", order: 0,
  },
  {
    key: "electric-lime",
    name: "Electric Lime",
    description: "Monochrome editorial look with a single lime accent and a pulsing dot grid.",
    colors: {
      bg: "#0a0a0a", bgElev: "#111111", bgElev2: "#161616",
      fg: "#fafafa", fgMuted: "#a1a1a1", fgSubtle: "#737373",
      border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.14)",
      accent: "#c5fd6c", accent2: "#8ee34b", accentText: "#0a0a0a",
    },
    fontSerif: "Fraunces", fontSans: "Space Grotesk",
    animation: "grid", order: 1,
  },
  {
    key: "sunset-coral",
    name: "Sunset Coral",
    description: "Warm coral-and-amber particle field drifting over deep plum.",
    colors: {
      bg: "#140a0d", bgElev: "#1d1013", bgElev2: "#241317",
      fg: "#fbf0ec", fgMuted: "#cbaaa2", fgSubtle: "#947873",
      border: "rgba(255,150,120,0.1)", borderStrong: "rgba(255,160,130,0.18)",
      accent: "#ff6b5e", accent2: "#ffb35e", accentText: "#1a0a08",
    },
    fontSerif: "Playfair Display", fontSans: "Outfit",
    animation: "particles", order: 2,
  },
  {
    key: "terminal-green",
    name: "Terminal Green",
    description: "Phosphor-green matrix rain on true black, monospace throughout.",
    colors: {
      bg: "#030603", bgElev: "#070d07", bgElev2: "#0b130b",
      fg: "#d7ffd9", fgMuted: "#86c98d", fgSubtle: "#4f8a56",
      border: "rgba(80,255,120,0.1)", borderStrong: "rgba(80,255,120,0.2)",
      accent: "#39ff6a", accent2: "#a6ff39", accentText: "#02140a",
    },
    fontSerif: "JetBrains Mono", fontSans: "IBM Plex Mono",
    animation: "matrix", order: 3,
  },
  {
    key: "rose-gold",
    name: "Rose Gold",
    description: "Blush and champagne tones with orbiting rings.",
    colors: {
      bg: "#140d10", bgElev: "#1c1317", bgElev2: "#23181d",
      fg: "#f8ecee", fgMuted: "#cbb0b5", fgSubtle: "#947e82",
      border: "rgba(230,180,190,0.1)", borderStrong: "rgba(230,180,190,0.18)",
      accent: "#e8a0ae", accent2: "#d4af7a", accentText: "#1c0f12",
    },
    fontSerif: "Cormorant Garamond", fontSans: "DM Sans",
    animation: "orbit", order: 4,
  },
  {
    key: "ocean-depths",
    name: "Ocean Depths",
    description: "Teal and deep-sea blue particles, calm and professional.",
    colors: {
      bg: "#061218", bgElev: "#0a1a22", bgElev2: "#0e222b",
      fg: "#e9f6fa", fgMuted: "#9cc3cf", fgSubtle: "#628b97",
      border: "rgba(120,220,255,0.09)", borderStrong: "rgba(120,220,255,0.16)",
      accent: "#22b8cf", accent2: "#5ee0c4", accentText: "#031015",
    },
    fontSerif: "Spectral", fontSans: "Work Sans",
    animation: "particles", order: 5,
  },
  {
    key: "amber-dusk",
    name: "Amber Dusk",
    description: "Burnt amber accent over warm charcoal, pulsing grid.",
    colors: {
      bg: "#100c08", bgElev: "#18120c", bgElev2: "#1f1710",
      fg: "#f6efe4", fgMuted: "#c4ac8f", fgSubtle: "#8f7a62",
      border: "rgba(255,190,110,0.1)", borderStrong: "rgba(255,190,110,0.18)",
      accent: "#e8912e", accent2: "#f2c14e", accentText: "#140d05",
    },
    fontSerif: "Fraunces", fontSans: "Manrope",
    animation: "grid", order: 6,
  },
  {
    key: "ivory-editorial",
    name: "Ivory Editorial",
    description: "Light, paper-toned editorial layout with a thin gold line accent.",
    colors: {
      bg: "#faf8f3", bgElev: "#f2efe7", bgElev2: "#eae6da",
      fg: "#1c1a16", fgMuted: "#5c574c", fgSubtle: "#8a8475",
      border: "rgba(20,18,12,0.08)", borderStrong: "rgba(20,18,12,0.14)",
      accent: "#a8842f", accent2: "#6b6050", accentText: "#faf8f3",
    },
    fontSerif: "Libre Baskerville", fontSans: "Inter",
    animation: "minimal", order: 7,
  },
  {
    key: "crimson-pulse",
    name: "Crimson Pulse",
    description: "High-contrast red-and-black neural field, bold display type.",
    colors: {
      bg: "#0c0607", bgElev: "#150a0b", bgElev2: "#1c0e10",
      fg: "#faf2f2", fgMuted: "#c6a3a3", fgSubtle: "#8e7373",
      border: "rgba(255,80,90,0.1)", borderStrong: "rgba(255,80,90,0.2)",
      accent: "#ef3d4e", accent2: "#ff8a5c", accentText: "#ffffff",
    },
    fontSerif: "Bebas Neue", fontSans: "Sora",
    animation: "neural", order: 8,
  },
  {
    key: "slate-professional",
    name: "Slate Professional",
    description: "Light, corporate-friendly slate-and-blue theme, minimal motion.",
    colors: {
      bg: "#f5f6f8", bgElev: "#eceef2", bgElev2: "#e3e6ec",
      fg: "#1a1d24", fgMuted: "#515663", fgSubtle: "#808591",
      border: "rgba(20,24,35,0.08)", borderStrong: "rgba(20,24,35,0.14)",
      accent: "#2c5cf6", accent2: "#0ea5a5", accentText: "#ffffff",
    },
    fontSerif: "Source Serif 4", fontSans: "Plus Jakarta Sans",
    animation: "minimal", order: 9,
  },
  {
    key: "cyberpunk-magenta",
    name: "Cyberpunk Magenta",
    description: "Magenta-and-cyan digital rain over void black, futuristic display type.",
    colors: {
      bg: "#07020b", bgElev: "#100715", bgElev2: "#180a1f",
      fg: "#f8eefc", fgMuted: "#c79fd6", fgSubtle: "#8e6d9c",
      border: "rgba(255,70,220,0.12)", borderStrong: "rgba(255,70,220,0.22)",
      accent: "#ff3ec8", accent2: "#24f0ff", accentText: "#0a0014",
    },
    fontSerif: "Orbitron", fontSans: "Rajdhani",
    animation: "matrix", order: 10,
  },
  {
    key: "forest-noir",
    name: "Forest Noir",
    description: "Deep forest green on near-black, quiet and minimal.",
    colors: {
      bg: "#070a08", bgElev: "#0d120e", bgElev2: "#121810",
      fg: "#eef3ee", fgMuted: "#a8bbac", fgSubtle: "#75897a",
      border: "rgba(140,200,150,0.09)", borderStrong: "rgba(140,200,150,0.16)",
      accent: "#4caf6e", accent2: "#8bd4a0", accentText: "#06110a",
    },
    fontSerif: "EB Garamond", fontSans: "Karla",
    animation: "minimal", order: 11,
  },
];

export function getThemeByKey(key: string): ThemeDefinition | undefined {
  return THEMES.find((t) => t.key === key);
}

/** Google Fonts family names used across all themes, for building a single stylesheet link. */
export const ALL_FONT_FAMILIES = Array.from(
  new Set(THEMES.flatMap((t) => [t.fontSerif, t.fontSans]))
);
