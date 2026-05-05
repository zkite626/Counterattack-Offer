-- 以 postgres 超级用户执行，并先把占位密码替换为生产随机密码。
-- PostgreSQL 监听地址必须在 postgresql.conf 中限制为 127.0.0.1 或内网地址，
-- 云服务器安全组也必须拒绝公网 5432。

CREATE ROLE counterattack_offer_app LOGIN PASSWORD 'replace-with-strong-random-password';
CREATE DATABASE counterattack_offer OWNER counterattack_offer_app;

\connect counterattack_offer

CREATE SCHEMA IF NOT EXISTS public AUTHORIZATION counterattack_offer_app;
GRANT CONNECT ON DATABASE counterattack_offer TO counterattack_offer_app;
GRANT USAGE, CREATE ON SCHEMA public TO counterattack_offer_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO counterattack_offer_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO counterattack_offer_app;
