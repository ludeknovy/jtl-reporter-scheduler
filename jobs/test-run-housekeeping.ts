import { Client } from "pg"

const PG_DEFAULT_PORT = 5432
const DELETE_QUERY = `DELETE FROM jtl.items WHERE id IN (
        SELECT it.id FROM jtl.items it LEFT JOIN jtl.scenario sc on it.scenario_id = sc.id
        WHERE sc.keep_test_runs_period > 0
        AND it.start_time < now() - interval '1 day' * sc.keep_test_runs_period) 
    RETURNING id, start_time`

export const client = new Client({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || PG_DEFAULT_PORT,
    database: process.env.DB_NAME || "jtl_report",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS,
    max: 60,
})

client.connect((err: { stack: unknown }) => {
    if (err) {
        console.error("connection error", err.stack)
        throw err
    } else {
        console.log("connected to DB")
    }
})

client.query(DELETE_QUERY, (err, res) => {
    if (err) throw err
    console.log(`Deleted following ${res.rows.length} test(s): ` + JSON.stringify(res.rows))
    if (res.rows.length > 0) {
        console.log("Running vacuum on jtl.samples")
        client.query("VACUUM FULL jtl.samples", (vacuumError) => {
            if (vacuumError) throw vacuumError
            client.end()
            process.exit(0)
        })
    } else {
        client.end()
        process.exit(0)
    }

})
