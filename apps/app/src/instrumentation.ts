import { type Prisma } from "database";
import { db } from "./server/db";

export async function register() {
  await initializeMockOccEvent();
}

export async function initializeMockOccEvent() {
  const params = {
    id: 99_999,
    name: "Demo OCC Event",
  } satisfies Prisma.OccTemplateUncheckedCreateInput;

  await db.occTemplate.upsert({
    where: {
      id: params.id,
    },
    create: params,
    update: {},
  });

  console.log(`🌲 ${params.name} applied`);
}
