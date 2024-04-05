import { client } from "../db/dbClient"

const DELETE_QUERY =
    `DELETE FROM jtl.items WHERE id IN (
        SELECT id FROM jtl.items items WHERE items.report_status = 'in_progress'::report_status 
        AND upload_time < now() - interval '8 hour'
        ) RETURNING id;
`

client.connect((err: { stack: unknown }) => {
    if (err) {
        console.error("Connection error", err.stack)
        throw err
    } else {
        console.log("Connected to DB")
    }
})

client.query(DELETE_QUERY, (err, res) => {
    if (err) throw err
    if (res.rows.length > 0) {
        console.log(`Deleted the following stale ${res.rows.length} test(s): ` + JSON.stringify(res.rows))
    } else {
        console.log("No stale test runs found, exiting.")
    }
    client.end()
    process.exit(0)

})
