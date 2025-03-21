import { eq } from "drizzle-orm";
import { withAuth } from "~/app/api/_middleware";
import { db } from "~/server/db";
import { category as categoryTable } from "~/server/db/schema";
import { categorySchema } from "../index+api";
import { createId } from "@paralleldrive/cuid2";
const getId = (request: Request) => {
  const id = new URL(request.url).pathname.split("/").pop();
  if (!id) return undefined;
  return id;
};

export const GET = withAuth(async (request: Request) => {
  const id = getId(request);

  if (typeof id !== "string") {
    return Response.json(
      { error: "Invalid path parameter ID" },
      { status: 400 },
    );
  }

  const category = await db.query.category.findFirst({
    where: eq(categoryTable.id, id),
  });

  if (!category) {
    return Response.json({ error: "Category not found" }, { status: 404 });
  }

  return Response.json(category);
});

export const PUT = withAuth(async (request: Request) => {
  const id = getId(request);

  if (typeof id !== "string") {
    return Response.json(
      { error: "Invalid path parameter ID" },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  });

  const { success, data } = categorySchema.partial().safeParse(body);

  if (!success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (Object.keys(data).length === 0) {
    return Response.json(
      { error: "No valid fields to update" },
      { status: 400 },
    );
  }

  const [category] = await db
    .update(categoryTable)
    .set({
      id: createId(),
      ...data,
    })
    .where(eq(categoryTable.id, id))
    .returning();

  return Response.json(category);
});
