import { eq } from "drizzle-orm";
import { withAuth } from "~/app/api/_middleware";
import { db } from "~/server/db";
import { entry as entryTable } from "~/server/db/schema";
import { entrySchema } from "../index+api";

// makes the handlers idempotent
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

  const entry = await db.query.entry.findFirst({
    where: eq(entryTable.id, id),
    with: { category: true },
  });

  if (!entry || !entry.active) {
    return Response.json({ error: "Entry not found" }, { status: 404 });
  }

  return Response.json(entry);
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

  const { success, data } = entrySchema.partial().safeParse(body);
  if (!success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (Object.keys(data).length === 0) {
    return Response.json(
      { error: "No valid fields to update" },
      { status: 400 },
    );
  }

  const [entry] = await db
    .update(entryTable)
    .set(data)
    .where(eq(entryTable.id, id))
    .returning();

  return Response.json(entry);
});

export const DELETE = withAuth(async (request: Request) => {
  const id = getId(request);

  if (!id) {
    return Response.json(
      { error: "Invalid path parameter ID" },
      { status: 400 },
    );
  }

  const [entry] = await db
    .update(entryTable)
    .set({ active: false })
    .where(eq(entryTable.id, id))
    .returning();

  if (!entry) {
    return Response.json({ error: "Entry not found" }, { status: 404 });
  }

  return Response.json(entry);
});
