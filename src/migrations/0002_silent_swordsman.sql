CREATE TABLE IF NOT EXISTS "dexieTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"checked" boolean DEFAULT false NOT NULL,
	"time" text NOT NULL
);
