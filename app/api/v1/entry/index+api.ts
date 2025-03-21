import { db } from "~/server/db";
import { withAuth } from "../../_middleware";
import { count } from "drizzle-orm";
import { entry as entryTable } from "~/server/db/schema";
import { z } from "zod";

export const entrySchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
});

export const GET = withAuth(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const sort = searchParams?.get("sortByCategory") === "true";

  const entries = await db.query.entry.findMany({
    with: { category: true },
  });
  const [{ count: total }, ..._rest] = await db
    .select({ count: count() })
    .from(entryTable);

  if (sort) {
    const sortByCategory = entries.reduce(
      (acc, entry) => {
        const categoryName = entry.category?.name ?? "Uncategorized";
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(entry);
        return acc;
      },
      {} as Record<string, typeof entries>
    );

    return Response.json({ total, entries: sortByCategory });
  }

  return Response.json({ total, entries });
});

export const POST = withAuth(async (request: Request) => {
  const body = await request.json().catch(() => {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  });

  const { success, data } = entrySchema.safeParse(body);
  if (!success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const [entry] = await db.insert(entryTable).values(data).returning();

  if (!entry) {
    return Response.json({ error: "Failed to create entry" }, { status: 500 });
  }

  return Response.json(entry);
});
