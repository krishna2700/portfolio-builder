import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { THEMES } from "../src/lib/themes";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL ?? "" });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const t of THEMES) {
    await prisma.theme.upsert({
      where: { key: t.key },
      update: {
        name: t.name,
        description: t.description,
        colors: t.colors,
        fontSerif: t.fontSerif,
        fontSans: t.fontSans,
        animation: t.animation,
        order: t.order,
      },
      create: {
        key: t.key,
        name: t.name,
        description: t.description,
        colors: t.colors,
        fontSerif: t.fontSerif,
        fontSans: t.fontSans,
        animation: t.animation,
        order: t.order,
      },
    });
    console.log(`seeded theme: ${t.key}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
