import OpenAI from "openai";
import { PortfolioContentSchema, EMPTY_CONTENT, type PortfolioContent } from "@/lib/content";

const RESUME_JSON_SCHEMA = {
  type: "object",
  properties: {
    hero: {
      type: "object",
      properties: {
        name: { type: "string" },
        title: { type: "string", description: "Current or most recent job title / headline" },
        subtitle: { type: "string", description: "A short secondary role tagline" },
        tagline: { type: "string", description: "One or two sentence summary of what they do" },
      },
      required: ["name", "title"],
    },
    about: {
      type: "object",
      properties: {
        bio: { type: "string", description: "A 2-3 sentence first-person professional summary" },
        bio2: { type: "string", description: "A second paragraph with more specific detail, first-person" },
        location: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        linkedin: { type: "string", description: "Full LinkedIn URL if present" },
        github: { type: "string", description: "Full GitHub URL if present" },
      },
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          role: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string", description: "'Present' if current" },
          location: { type: "string" },
          current: { type: "boolean" },
          description: {
            type: "array",
            items: { type: "string" },
            description: "Bullet points describing responsibilities/achievements",
          },
        },
        required: ["company", "role"],
      },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          tech: { type: "array", items: { type: "string" } },
          github: { type: "string" },
          live: { type: "string" },
        },
        required: ["title", "description"],
      },
    },
    skillTiers: {
      type: "array",
      description:
        "Group all skills/technologies found into 2-4 tiers (e.g. 'Daily drivers', 'Comfortable with', 'Familiar with') based on how prominently/frequently they appear in the resume.",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          items: { type: "array", items: { type: "string" } },
        },
        required: ["label", "items"],
      },
    },
  },
  required: ["hero", "about", "experience", "projects", "skillTiers"],
} as const;

export async function parseResumeText(resumeText: string): Promise<PortfolioContent> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to .env.local to enable resume parsing."
    );
  }

  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You extract structured portfolio content from raw resume text. Write bio/tagline fields in first person. Be faithful to the resume — do not invent companies, dates, or metrics that aren't present. Return only the fields defined in the schema.",
      },
      { role: "user", content: resumeText.slice(0, 20000) },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "portfolio_content",
        schema: RESUME_JSON_SCHEMA,
      },
    },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("OpenAI returned an empty response");

  const parsedJson = JSON.parse(raw);
  const result = PortfolioContentSchema.safeParse(parsedJson);
  if (result.success) return result.data;

  // Best-effort fallback: merge whatever validated fields we can salvage.
  return { ...EMPTY_CONTENT, ...parsedJson };
}

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return data.text;
}
