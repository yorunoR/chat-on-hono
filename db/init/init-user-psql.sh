#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER developer WITH PASSWORD 'password' LOGIN CREATEDB;
    CREATE USER ai WITH PASSWORD 'password' LOGIN CREATEDB;

    CREATE DATABASE api_ai OWNER ai;
    CREATE DATABASE api_dev OWNER developer;
    CREATE DATABASE api_test OWNER developer;

    REVOKE CONNECT ON DATABASE api_ai, api_dev, api_test FROM PUBLIC;
EOSQL
