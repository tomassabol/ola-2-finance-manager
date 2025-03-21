import { pgTable } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

const categoryTable = pgTable("category", (t) => ({
  id: t.varchar("id").primaryKey().default(createId()),
  name: t.varchar("name").notNull(),
  createdAt: t.timestamp("created_at").defaultNow(),
  updatedAt: t.timestamp("updated_at").defaultNow(),
}));

const entryTable = pgTable("entry", (t) => ({
  id: t.varchar("id").primaryKey().default(createId()),
  name: t.varchar("name").notNull(),
  categoryId: t.varchar("category_id").references(() => categoryTable.id),
  active: t.boolean("active").default(true),
  createdAt: t.timestamp("created_at").defaultNow(),
  updatedAt: t.timestamp("updated_at").defaultNow(),
}));

const entryRelations = relations(entryTable, ({ one }) => ({
  category: one(categoryTable, {
    fields: [entryTable.categoryId],
    references: [categoryTable.id],
  }),
}));

export { categoryTable as category, entryTable as entry, entryRelations };
