#!/usr/bin/env bash
set -euo pipefail

backup_path="${1:-}"
target_db="${RESTORE_CHECK_DATABASE:-counterattack_offer_restore_check}"

if [[ -z "$backup_path" ]]; then
  echo "usage: $0 /path/to/backup.dump[.enc]" >&2
  exit 1
fi

tmp_path="$backup_path"
if [[ "$backup_path" == *.enc ]]; then
  if ! command -v openssl >/dev/null 2>&1; then
    echo "openssl not found" >&2
    exit 1
  fi
  : "${BACKUP_ENCRYPTION_PASSPHRASE:?required for encrypted backup restore check}"
  tmp_path="$(mktemp)"
  openssl enc -d -aes-256-cbc -pbkdf2 \
    -in "$backup_path" \
    -out "$tmp_path" \
    -pass env:BACKUP_ENCRYPTION_PASSPHRASE
fi

for command_name in dropdb createdb pg_restore psql; do
  if [[ -n "${PG_RESTORE_CONTAINER:-}" ]]; then
    continue
  fi

  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "$command_name not found; install postgresql-client for restore checks" >&2
    exit 1
  fi
done

remove_sensitive_file() {
  local file_path="$1"

  if command -v shred >/dev/null 2>&1; then
    shred -u "$file_path"
    return
  fi

  rm -f "$file_path"
}

if [[ -n "${PG_RESTORE_CONTAINER:-}" ]]; then
  docker exec \
    -e PGUSER="${PGUSER:-postgres}" \
    -e PGPASSWORD="${PGPASSWORD:-}" \
    "$PG_RESTORE_CONTAINER" \
    dropdb --if-exists "$target_db"
  docker exec \
    -e PGUSER="${PGUSER:-postgres}" \
    -e PGPASSWORD="${PGPASSWORD:-}" \
    "$PG_RESTORE_CONTAINER" \
    createdb "$target_db"
  docker exec -i \
    -e PGUSER="${PGUSER:-postgres}" \
    -e PGPASSWORD="${PGPASSWORD:-}" \
    "$PG_RESTORE_CONTAINER" \
    pg_restore --clean --if-exists --no-owner --no-acl --dbname="$target_db" < "$tmp_path"
  docker exec \
    -e PGUSER="${PGUSER:-postgres}" \
    -e PGPASSWORD="${PGPASSWORD:-}" \
    "$PG_RESTORE_CONTAINER" \
    psql --dbname="$target_db" --command='select count(*) as users_count from users;' >/dev/null
  docker exec \
    -e PGUSER="${PGUSER:-postgres}" \
    -e PGPASSWORD="${PGPASSWORD:-}" \
    "$PG_RESTORE_CONTAINER" \
    psql --dbname="$target_db" --tuples-only --no-align --command="select 'users=' || count(*) from users union all select 'audit_logs=' || count(*) from audit_logs union all select 'ai_call_logs=' || count(*) from ai_call_logs union all select 'mail_events=' || count(*) from mail_events;"
else
  dropdb --if-exists "$target_db"
  createdb "$target_db"
  pg_restore --clean --if-exists --no-owner --no-acl --dbname="$target_db" "$tmp_path"
  psql --dbname="$target_db" --command='select count(*) as users_count from users;' >/dev/null
  psql --dbname="$target_db" --tuples-only --no-align --command="select 'users=' || count(*) from users union all select 'audit_logs=' || count(*) from audit_logs union all select 'ai_call_logs=' || count(*) from ai_call_logs union all select 'mail_events=' || count(*) from mail_events;"
fi

if [[ "$tmp_path" != "$backup_path" ]]; then
  remove_sensitive_file "$tmp_path"
fi

echo "restore check ok: $target_db"
