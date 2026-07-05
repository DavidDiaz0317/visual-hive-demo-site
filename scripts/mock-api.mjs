#!/usr/bin/env node
import http from "node:http";

const port = Number.parseInt(valueAfter("--port") ?? process.env.MOCK_API_PORT ?? "4274", 10);

const payload = {
  service: "visual-hive-demo-mock-api",
  status: "ok",
  fixture: "commandGroup lifecycle target",
  generatedAt: "2026-07-04T12:00:00.000Z"
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "127.0.0.1"}`);
  if (url.pathname === "/health") {
    json(response, { ok: true, service: payload.service });
    return;
  }
  if (url.pathname === "/api/cluster-summary") {
    json(response, payload);
    return;
  }
  json(response, { error: "not_found", path: url.pathname }, 404);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`[mock-api] listening on http://127.0.0.1:${port}`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));

function valueAfter(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function json(response, body, status = 200) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*"
  });
  response.end(JSON.stringify(body, null, 2));
}
