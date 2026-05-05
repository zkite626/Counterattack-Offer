CREATE TABLE "rate_limit_buckets" (
  "key" VARCHAR(160) NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 0,
  "reset_at" TIMESTAMPTZ(6) NOT NULL,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "rate_limit_buckets_pkey" PRIMARY KEY ("key")
);

CREATE INDEX "rate_limit_buckets_reset_at_idx" ON "rate_limit_buckets"("reset_at");

CREATE TABLE "api_error_logs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "request_id" VARCHAR(128) NOT NULL,
  "method" VARCHAR(12) NOT NULL,
  "path" TEXT NOT NULL,
  "status_code" INTEGER NOT NULL,
  "error_code" VARCHAR(120) NOT NULL,
  "user_id" UUID,
  "ip_address" INET,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "api_error_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "api_error_logs_request_id_idx" ON "api_error_logs"("request_id");
CREATE INDEX "api_error_logs_error_code_idx" ON "api_error_logs"("error_code");
CREATE INDEX "api_error_logs_status_code_idx" ON "api_error_logs"("status_code");
CREATE INDEX "api_error_logs_created_at_idx" ON "api_error_logs"("created_at");
