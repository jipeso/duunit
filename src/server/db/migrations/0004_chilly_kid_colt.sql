ALTER TABLE "application_status_events" RENAME COLUMN "changed_at" TO "created_at";--> statement-breakpoint
ALTER TABLE "application_status_events" ALTER COLUMN "created_at" TYPE timestamp with time zone, ADD COLUMN "occurred_on" date DEFAULT now() NOT NULL;--> statement-breakpoint
UPDATE "application_status_events" SET "occurred_on" = "created_at";
