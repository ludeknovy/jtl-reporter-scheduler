import { client } from "../db/dbClient"

const DELETE_QUERY = `DELETE FROM jtl.items WHERE id IN (
        SELECT it.id FROM jtl.items it LEFT JOIN jtl.scenario sc on it.scenario_id = sc.id
        WHERE sc.keep_test_runs_period > 0
        AND it.start_time < now() - interval '1 day' * sc.keep_test_runs_period
        AND it.base IS NOT TRUE) 
    RETURNING id, start_time`


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
