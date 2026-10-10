import { z } from "zod";

export const ExperienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string().default(""),
  current: z.boolean().default(false),
  description: z.array(z.string()).default([]),
});

export const ProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  tech: z.array(z.string()).default([]),
  github: z.string().default(""),
  live: z.string().default(""),
});

export const SkillTierSchema = z.object({
  label: z.string(),
  items: z.array(z.string()).default([]),
});

export const PortfolioContentSchema = z.object({
  hero: z.object({
    name: z.string(),
    title: z.string(),
    subtitle: z.string().default(""),
    tagline: z.string().default(""),
  }),
  about: z.object({
    bio: z.string().default(""),
    bio2: z.string().default(""),
    location: z.string().default(""),
    email: z.string().default(""),
    phone: z.string().default(""),
    linkedin: z.string().default(""),
    github: z.string().default(""),
  }),
  experience: z.array(ExperienceSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  skillTiers: z.array(SkillTierSchema).default([]),
});

export type PortfolioContent = z.infer<typeof PortfolioContentSchema>;

export const EMPTY_CONTENT: PortfolioContent = {
  hero: { name: "", title: "", subtitle: "", tagline: "" },
  about: { bio: "", bio2: "", location: "", email: "", phone: "", linkedin: "", github: "" },
  experience: [],
  projects: [],
  skillTiers: [],
};
