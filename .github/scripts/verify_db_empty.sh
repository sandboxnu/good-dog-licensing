#!/bin/bash
set -e

tables=$(PGPASSWORD="$PG_PASSWORD" psql -h localhost -U user -d $PG_DB -t -c "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';")
non_empty_tables=0
echo "Checking all tables for data..."
for table in $tables; do
  table=$(echo $table | xargs)
  if [ ! -z "$table" ]; then
    count=$(PGPASSWORD="$PG_PASSWORD" psql -h localhost -U user -d $PG_DB -t -c "SELECT COUNT(*) FROM \"$table\";" | xargs)
    if [ "$count" -ne "0" ]; then
      echo "Table '$table' is not empty! ($count records)"
      non_empty_tables=$((non_empty_tables+1))
    else
      echo "Table '$table' is empty."
    fi
  fi
done
if [ "$non_empty_tables" -ne "0" ]; then
  echo "Error: $non_empty_tables tables contain data! Tests and migrations did not clean up properly."
  exit 1
else
  echo "Success: All tables are empty."
fi