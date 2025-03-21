import { db } from "~/server/db";
import { withAuth } from "../../_middleware";
import { category as categoryTable } from "~/server/db/schema";
import { count } from "drizzle-orm";
import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1),
});

export const GET = withAuth(async (request: Request) => {
  const categories = await db.query.category.findMany();
  const [{ count: total }, ..._rest] = await db
    .select({ count: count() })
    .from(categoryTable);

  return Response.json({ total, categories });
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
    .values({ name: data.name })
    .returning();
  return Response.json({ category });
});
