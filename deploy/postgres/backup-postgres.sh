#!/usr/bin/env bash
set -euo pipefail

umask 077

backup_dir="${BACKUP_DIR:-/var/backups/counterattack-offer/postgres}"
retention_days="${BACKUP_RETENTION_DAYS:-7}"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
database_name="${PGDATABASE:-counterattack_offer}"
plain_backup_path="${backup_dir}/${database_name}-${timestamp}.dump"
encrypted_backup_path="${plain_backup_path}.enc"

mkdir -p "$backup_dir"

run_pg_dump() {
  if [[ -n "${PG_DUMP_CONTAINER:-}" ]]; then
    docker exec \
      -e PGHOST="${PGHOST:-127.0.0.1}" \
      -e PGPORT="${PGPORT:-5432}" \
      -e PGUSER="${PGUSER:-counterattack_offer_app}" \
      -e PGPASSWORD="${PGPASSWORD:-}" \
      -e PGDATABASE="${PGDATABASE:-counterattack_offer}" \
      "$PG_DUMP_CONTAINER" \
      pg_dump --format=custom --no-owner --no-acl "$@" > "$plain_backup_path"
    return
  fi

  if ! command -v pg_dump >/dev/null 2>&1; then
    echo "pg_dump not found; install postgresql-client or set PG_DUMP_CONTAINER" >&2
    exit 1
  fi

  pg_dump --format=custom --no-owner --no-acl "$@" --file="$plain_backup_path"
}

remove_sensitive_file() {
  local file_path="$1"

  if command -v shred >/dev/null 2>&1; then
    shred -u "$file_path"
    return
  fi

  rm -f "$file_path"
}

if [[ -n "${BACKUP_DATABASE_URL:-}" ]]; then
  run_pg_dump --dbname="$BACKUP_DATABASE_URL"
else
  : "${PGHOST:=127.0.0.1}"
  : "${PGPORT:=5432}"
  : "${PGUSER:=counterattack_offer_app}"
  : "${PGDATABASE:=counterattack_offer}"
  export PGHOST PGPORT PGUSER PGDATABASE
  run_pg_dump
fi

if [[ -n "${BACKUP_ENCRYPTION_PASSPHRASE:-}" ]]; then
  openssl enc -aes-256-cbc -salt -pbkdf2 \
    -in "$plain_backup_path" \
    -out "$encrypted_backup_path" \
    -pass env:BACKUP_ENCRYPTION_PASSPHRASE
  remove_sensitive_file "$plain_backup_path"
  echo "backup written: $encrypted_backup_path"
else
  if [[ "${REQUIRE_BACKUP_ENCRYPTION:-false}" == "true" ]]; then
    rm -f "$plain_backup_path"
    echo "BACKUP_ENCRYPTION_PASSPHRASE is required when REQUIRE_BACKUP_ENCRYPTION=true" >&2
    exit 1
  fi
  echo "backup written without encryption: $plain_backup_path" >&2
fi

find "$backup_dir" -type f \( -name '*.dump' -o -name '*.dump.enc' \) -mtime +"$retention_days" -delete
