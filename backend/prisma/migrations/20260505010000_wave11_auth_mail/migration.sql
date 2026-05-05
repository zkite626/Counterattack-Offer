CREATE TYPE "MailType" AS ENUM (
    'verify_email',
    'reset_password',
    'welcome',
    'security_notice',
    'password_changed',
    'test'
);

CREATE TYPE "MailStatus" AS ENUM ('queued', 'sent', 'failed');
CREATE TYPE "TestStatus" AS ENUM ('success', 'failed');

CREATE TABLE "email_verification_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "used_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "used_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "smtp_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "host" VARCHAR(255) NOT NULL,
    "port" INTEGER NOT NULL,
    "secure" BOOLEAN NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "encrypted_password" TEXT NOT NULL,
    "from_name" VARCHAR(120) NOT NULL,
    "from_email" VARCHAR(255) NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "last_tested_at" TIMESTAMPTZ(6),
    "last_test_status" "TestStatus",
    "updated_by" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "smtp_settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "mail_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "type" "MailType" NOT NULL,
    "to_email" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "status" "MailStatus" NOT NULL,
    "error_message" TEXT,
    "sent_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mail_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "email_verification_tokens_user_id_idx" ON "email_verification_tokens"("user_id");
CREATE INDEX "email_verification_tokens_token_hash_idx" ON "email_verification_tokens"("token_hash");
CREATE INDEX "email_verification_tokens_expires_at_idx" ON "email_verification_tokens"("expires_at");
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");
CREATE INDEX "password_reset_tokens_token_hash_idx" ON "password_reset_tokens"("token_hash");
CREATE INDEX "password_reset_tokens_expires_at_idx" ON "password_reset_tokens"("expires_at");
CREATE INDEX "smtp_settings_updated_by_idx" ON "smtp_settings"("updated_by");
CREATE INDEX "mail_events_user_id_idx" ON "mail_events"("user_id");
CREATE INDEX "mail_events_type_idx" ON "mail_events"("type");
CREATE INDEX "mail_events_status_idx" ON "mail_events"("status");
CREATE INDEX "mail_events_created_at_idx" ON "mail_events"("created_at");

ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "smtp_settings" ADD CONSTRAINT "smtp_settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "mail_events" ADD CONSTRAINT "mail_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
