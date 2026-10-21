#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER developer WITH PASSWORD 'password' LOGIN;
    ALTER USER developer CREATEDB CREATEROLE;
EOSQL

psql -v ON_ERROR_STOP=1 --username "developer" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE api_dev;
    CREATE DATABASE api_test;
EOSQL
