import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Create enum types (skip if already exist from dev push)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_links_label" AS ENUM('github', 'demo', 'linkedin', 'website', 'other');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_education_links_label" AS ENUM('github', 'demo', 'linkedin', 'website', 'other');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_experience_links_label" AS ENUM('github', 'demo', 'linkedin', 'website', 'other');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  // 2. Lowercase existing label values to match enum values (only if still varchar)
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'projects_links' AND column_name = 'label' AND data_type = 'character varying'
      ) THEN
        UPDATE "projects_links" SET "label" = LOWER("label");
        UPDATE "projects_links" SET "label" = 'other' WHERE "label" NOT IN ('github', 'demo', 'linkedin', 'website', 'other');
        ALTER TABLE "projects_links" ALTER COLUMN "label" TYPE "enum_projects_links_label" USING "label"::"enum_projects_links_label";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'education_links' AND column_name = 'label' AND data_type = 'character varying'
      ) THEN
        UPDATE "education_links" SET "label" = LOWER("label");
        UPDATE "education_links" SET "label" = 'other' WHERE "label" NOT IN ('github', 'demo', 'linkedin', 'website', 'other');
        ALTER TABLE "education_links" ALTER COLUMN "label" TYPE "enum_education_links_label" USING "label"::"enum_education_links_label";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'experience_links' AND column_name = 'label' AND data_type = 'character varying'
      ) THEN
        UPDATE "experience_links" SET "label" = LOWER("label");
        UPDATE "experience_links" SET "label" = 'other' WHERE "label" NOT IN ('github', 'demo', 'linkedin', 'website', 'other');
        ALTER TABLE "experience_links" ALTER COLUMN "label" TYPE "enum_experience_links_label" USING "label"::"enum_experience_links_label";
      END IF;
    END $$;
  `)

  // 3. Add custom_label column (skip if already exists from dev push)
  await db.execute(sql`
    ALTER TABLE "projects_links" ADD COLUMN IF NOT EXISTS "custom_label" varchar;
    ALTER TABLE "education_links" ADD COLUMN IF NOT EXISTS "custom_label" varchar;
    ALTER TABLE "experience_links" ADD COLUMN IF NOT EXISTS "custom_label" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "projects_links" DROP COLUMN IF EXISTS "custom_label";
    ALTER TABLE "education_links" DROP COLUMN IF EXISTS "custom_label";
    ALTER TABLE "experience_links" DROP COLUMN IF EXISTS "custom_label";
  `)

  await db.execute(sql`
    ALTER TABLE "projects_links" ALTER COLUMN "label" TYPE varchar USING "label"::text;
    ALTER TABLE "education_links" ALTER COLUMN "label" TYPE varchar USING "label"::text;
    ALTER TABLE "experience_links" ALTER COLUMN "label" TYPE varchar USING "label"::text;
  `)

  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_projects_links_label";
    DROP TYPE IF EXISTS "public"."enum_education_links_label";
    DROP TYPE IF EXISTS "public"."enum_experience_links_label";
  `)
}
