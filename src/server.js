import { Hono } from "hono"
import { streamSSE } from "hono/streaming"
import { serve} from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"


const app = new Hono()

app.get("/ping", c => {
    
    return streamSSE(c, async (stream) => {
        while(true) {
            await stream.writeSSE({
                data: `${Date.now()}`
            })

            await stream.sleep(3000)
        }
    })
})

app.use("*", serveStatic({ root: "./dist" }))

serve({
    fetch: app.fetch,
    port: 5000
})