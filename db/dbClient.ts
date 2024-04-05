import { Client } from "pg"

const PG_DEFAULT_PORT = 5432

export const client = new Client({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || PG_DEFAULT_PORT,
    database: process.env.DB_NAME || "jtl_report",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS,
    max: 60,
})
