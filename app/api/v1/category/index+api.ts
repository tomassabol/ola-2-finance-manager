import { db } from "~/server/db";
import { withAuth } from "../../_middleware";
import {
  category as categoryTable,
  entry as entryTable,
} from "~/server/db/schema";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";

export const categorySchema = z
  .object({
    name: z.string().min(1),
  })
  .strict();

export const GET = withAuth(async (request: Request) => {
  const categories = await db.query.category.findMany({
    with: {
      entries: {
        where: eq(entryTable.active, true),
      },
    },
  });
  const categoriesWithCounts = categories.map((category) => ({
    ...category,
    entryCount: category.entries.length,
  }));

  const [{ count: total }, ..._rest] = await db
    .select({ count: count() })
    .from(categoryTable);

  return Response.json({ total, categories: categoriesWithCounts });
});

export const POST = withAuth(async (request: Request) => {
  const body = await request.json().catch(() => {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  });
  const { success, data } = categorySchema.safeParse(body);

  if (!success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const [category] = await db
    .insert(categoryTable)
    .values({ id: createId(), name: data.name })
    .returning();
  return Response.json({ category });
});
