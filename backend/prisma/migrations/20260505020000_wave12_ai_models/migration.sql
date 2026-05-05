CREATE TYPE "AIModelScope" AS ENUM ('user', 'global');
CREATE TYPE "AICallStatus" AS ENUM ('success', 'failed');

CREATE TABLE "ai_model_configs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "scope" "AIModelScope" NOT NULL,
    "owner_user_id" UUID,
    "display_name" VARCHAR(120) NOT NULL,
    "provider" VARCHAR(60) NOT NULL,
    "base_url" TEXT NOT NULL,
    "model" VARCHAR(120) NOT NULL,
    "encrypted_api_key" TEXT NOT NULL,
    "api_key_hint" VARCHAR(80) NOT NULL,
    "api_key_fingerprint" VARCHAR(128) NOT NULL,
    "temperature" DECIMAL(4,2),
    "max_tokens" INTEGER,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "last_tested_at" TIMESTAMPTZ(6),
    "last_test_status" "TestStatus",
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ai_model_configs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ai_model_configs_scope_owner_check" CHECK (
        ("scope" = 'user' AND "owner_user_id" IS NOT NULL) OR
        ("scope" = 'global' AND "owner_user_id" IS NULL)
    )
);

CREATE TABLE "ai_call_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "model_config_id" UUID,
    "module" VARCHAR(80) NOT NULL,
    "provider" VARCHAR(60) NOT NULL,
    "model" VARCHAR(120) NOT NULL,
    "status" "AICallStatus" NOT NULL,
    "prompt_tokens" INTEGER,
    "completion_tokens" INTEGER,
    "latency_ms" INTEGER NOT NULL,
    "error_code" VARCHAR(120),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_call_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ai_model_configs_scope_idx" ON "ai_model_configs"("scope");
CREATE INDEX "ai_model_configs_owner_user_id_idx" ON "ai_model_configs"("owner_user_id");
CREATE INDEX "ai_model_configs_created_by_idx" ON "ai_model_configs"("created_by");
CREATE INDEX "ai_model_configs_is_enabled_idx" ON "ai_model_configs"("is_enabled");
CREATE INDEX "ai_model_configs_scope_is_default_idx" ON "ai_model_configs"("scope", "is_default");
CREATE INDEX "ai_model_configs_api_key_fingerprint_idx" ON "ai_model_configs"("api_key_fingerprint");
CREATE UNIQUE INDEX "ai_model_configs_one_user_default_key" ON "ai_model_configs"("owner_user_id") WHERE "scope" = 'user' AND "is_default" = true;
CREATE UNIQUE INDEX "ai_model_configs_one_global_default_key" ON "ai_model_configs"("is_default") WHERE "scope" = 'global' AND "is_default" = true;
CREATE UNIQUE INDEX "ai_model_configs_user_fingerprint_key" ON "ai_model_configs"("owner_user_id", "api_key_fingerprint") WHERE "scope" = 'user';
CREATE UNIQUE INDEX "ai_model_configs_global_fingerprint_key" ON "ai_model_configs"("api_key_fingerprint") WHERE "scope" = 'global';

CREATE INDEX "ai_call_logs_user_id_idx" ON "ai_call_logs"("user_id");
CREATE INDEX "ai_call_logs_model_config_id_idx" ON "ai_call_logs"("model_config_id");
CREATE INDEX "ai_call_logs_module_idx" ON "ai_call_logs"("module");
CREATE INDEX "ai_call_logs_status_idx" ON "ai_call_logs"("status");
CREATE INDEX "ai_call_logs_created_at_idx" ON "ai_call_logs"("created_at");

ALTER TABLE "ai_model_configs" ADD CONSTRAINT "ai_model_configs_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_model_configs" ADD CONSTRAINT "ai_model_configs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ai_call_logs" ADD CONSTRAINT "ai_call_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_call_logs" ADD CONSTRAINT "ai_call_logs_model_config_id_fkey" FOREIGN KEY ("model_config_id") REFERENCES "ai_model_configs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
