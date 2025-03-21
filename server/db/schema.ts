import { pgTable } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

const categoryTable = pgTable("category", (t) => ({
  id: t.varchar("id").primaryKey(),
  name: t.varchar("name").notNull(),
  createdAt: t.timestamp("created_at").defaultNow(),
  updatedAt: t.timestamp("updated_at").defaultNow(),
}));
type Category = typeof categoryTable.$inferSelect;
const categoryRelations = relations(categoryTable, ({ many }) => ({
  entries: many(entryTable),
}));

const entryTable = pgTable("entry", (t) => ({
  id: t.varchar("id").primaryKey(),
  name: t.varchar("name").notNull(),
  description: t.text("description"),
  categoryId: t.varchar("category_id").references(() => categoryTable.id),
  active: t.boolean("active").default(true),
  createdAt: t.timestamp("created_at").defaultNow(),
  updatedAt: t.timestamp("updated_at").defaultNow(),
}));
type Entry = typeof entryTable.$inferSelect;
const entryRelations = relations(entryTable, ({ one }) => ({
  category: one(categoryTable, {
    fields: [entryTable.categoryId],
    references: [categoryTable.id],
  }),
}));

export {
  categoryTable as category,
  entryTable as entry,
  entryRelations,
  categoryRelations,
  type Category,
  type Entry,
};
