import Bree from "bree"
import * as path from "node:path"
// eslint-disable-next-line @typescript-eslint/no-var-requires
Bree.extend(require("@breejs/ts-worker"))


const bree = new Bree({
    root: path.join(__dirname, "jobs"),
    defaultExtension: process.env.TS_NODE ? "ts" : "js",
    jobs: [
        {
            name: "test-run-housekeeping",
            interval: "every 5 seconds",
        },
    ],
})

bree.start()
