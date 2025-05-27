import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

const streams = new Set();

app.get("/ping", (c) => {
	return streamSSE(c, async (stream) => {
		while (true) {
			await stream.writeSSE({
				data: `${Date.now()}`,
			});

			await stream.sleep(3000);
		}
	});
});

app.get("/api/chat", (c) => {
	return streamSSE(c, async (stream) => {
		streams.add(stream);

		while (!stream.aborted && !stream.closed) {
			await stream.sleep(1000);
		}

		streams.delete(stream);
	});
});

app.post("/api/chat", async (c) => {
	const formData = await c.req.formData();
	const data = Object.fromEntries(formData);

	for (const stream of streams) {
		try {
			stream.writeSSE({
				data: JSON.stringify(data),
			});
		} catch (e) {
			console.log(e);
		}
	}

	return c.json({ status: "ok" });
});

app.use("*", serveStatic({ root: "./dist" }));

serve({
	fetch: app.fetch,
	port: 5000,
});
