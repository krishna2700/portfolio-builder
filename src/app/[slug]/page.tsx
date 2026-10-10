import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PortfolioContentSchema } from "@/lib/content";
import type { ThemeDefinition } from "@/lib/themes";
import PortfolioView from "@/components/portfolio/PortfolioView";

async function getPortfolio(slug: string) {
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
    include: { theme: true },
  });
  if (!portfolio || !portfolio.published) return null;
  const content = PortfolioContentSchema.safeParse(portfolio.content);
  if (!content.success) return null;
  return { portfolio, content: content.data };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPortfolio(slug);
  if (!data) return {};
  return {
    title: `${data.content.hero.name} — ${data.content.hero.title}`,
    description: data.content.hero.tagline || data.content.about.bio,
  };
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPortfolio(slug);
  if (!data) notFound();

  const theme = data.portfolio.theme as unknown as ThemeDefinition & { id: string };

  return (
    <PortfolioView
      theme={{
        key: theme.key,
        name: theme.name,
        description: theme.description,
        colors: theme.colors as ThemeDefinition["colors"],
        fontSerif: theme.fontSerif,
        fontSans: theme.fontSans,
        animation: theme.animation as ThemeDefinition["animation"],
        order: theme.order,
      }}
      content={data.content}
      photoUrl={data.portfolio.photoUrl}
      resumeUrl={data.portfolio.resumeUrl}
    />
  );
}
