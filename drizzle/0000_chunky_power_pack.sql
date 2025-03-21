CREATE TABLE "category" (
	"id" varchar PRIMARY KEY DEFAULT 'r72uf0vm6r1m3ep9bllseivy' NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entry" (
	"id" varchar PRIMARY KEY DEFAULT 'fvcubetgceup0xqhhyi18xex' NOT NULL,
	"name" varchar NOT NULL,
	"category_id" varchar
);
--> statement-breakpoint
ALTER TABLE "entry" ADD CONSTRAINT "entry_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;