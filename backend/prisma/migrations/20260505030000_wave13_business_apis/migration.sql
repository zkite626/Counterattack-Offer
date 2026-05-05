CREATE TYPE "CareerFlowStatus" AS ENUM ('draft', 'running', 'completed', 'failed');

CREATE TABLE "student_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "school_type" VARCHAR(120) NOT NULL DEFAULT '',
    "major" VARCHAR(120) NOT NULL DEFAULT '',
    "grade" VARCHAR(80) NOT NULL DEFAULT '',
    "target_cities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "target_roles" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "education_background" TEXT NOT NULL DEFAULT '',
    "skills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "weaknesses" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "experiences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "raw_content" TEXT NOT NULL,
    "type" VARCHAR(80) NOT NULL DEFAULT 'other',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "career_flow_runs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "target_role" VARCHAR(160),
    "job_description" TEXT,
    "status" "CareerFlowStatus" NOT NULL DEFAULT 'draft',
    "current_step" VARCHAR(80) NOT NULL DEFAULT 'profile',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "career_flow_runs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "career_flow_results" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "run_id" UUID NOT NULL,
    "step" VARCHAR(80) NOT NULL,
    "input_snapshot" JSONB NOT NULL,
    "result" JSONB NOT NULL,
    "model_config_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_flow_results_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "resumes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "template_id" VARCHAR(80) NOT NULL DEFAULT 'classic',
    "theme" JSONB NOT NULL DEFAULT '{}',
    "content" JSONB NOT NULL,
    "source_run_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "resume_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "resume_id" UUID NOT NULL,
    "version_no" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_versions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "student_profiles_user_id_key" ON "student_profiles"("user_id");
CREATE INDEX "student_profiles_user_id_idx" ON "student_profiles"("user_id");
CREATE INDEX "experiences_user_id_idx" ON "experiences"("user_id");
CREATE INDEX "experiences_profile_id_idx" ON "experiences"("profile_id");
CREATE INDEX "experiences_user_id_sort_order_idx" ON "experiences"("user_id", "sort_order");
CREATE INDEX "career_flow_runs_user_id_idx" ON "career_flow_runs"("user_id");
CREATE INDEX "career_flow_runs_status_idx" ON "career_flow_runs"("status");
CREATE INDEX "career_flow_runs_updated_at_idx" ON "career_flow_runs"("updated_at");
CREATE INDEX "career_flow_results_run_id_idx" ON "career_flow_results"("run_id");
CREATE INDEX "career_flow_results_model_config_id_idx" ON "career_flow_results"("model_config_id");
CREATE INDEX "career_flow_results_step_idx" ON "career_flow_results"("step");
CREATE INDEX "career_flow_results_created_at_idx" ON "career_flow_results"("created_at");
CREATE INDEX "resumes_user_id_idx" ON "resumes"("user_id");
CREATE INDEX "resumes_source_run_id_idx" ON "resumes"("source_run_id");
CREATE INDEX "resumes_updated_at_idx" ON "resumes"("updated_at");
CREATE UNIQUE INDEX "resume_versions_resume_id_version_no_key" ON "resume_versions"("resume_id", "version_no");
CREATE INDEX "resume_versions_resume_id_idx" ON "resume_versions"("resume_id");
CREATE INDEX "resume_versions_created_by_idx" ON "resume_versions"("created_by");

ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "career_flow_runs" ADD CONSTRAINT "career_flow_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "career_flow_results" ADD CONSTRAINT "career_flow_results_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "career_flow_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "career_flow_results" ADD CONSTRAINT "career_flow_results_model_config_id_fkey" FOREIGN KEY ("model_config_id") REFERENCES "ai_model_configs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_source_run_id_fkey" FOREIGN KEY ("source_run_id") REFERENCES "career_flow_runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "resume_versions" ADD CONSTRAINT "resume_versions_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "resume_versions" ADD CONSTRAINT "resume_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
