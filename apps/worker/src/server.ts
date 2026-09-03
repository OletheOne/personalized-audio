import { createServer, type Server } from "node:http";
import { CONFIG_PACKAGE } from "@pa/config";
import { resolveHealthPort, routeWorkerRequest } from "./health.js";

export function startWorker(options?: { port?: number }): Server {
  const port = options?.port ?? resolveHealthPort(process.env["WORKER_HEALTH_PORT"]);
  const server = createServer((request, response) => {
    const routed = routeWorkerRequest(request.method ?? "GET", request.url ?? "/");
    response.writeHead(routed.status, {
      "content-type": "application/json; charset=utf-8",
    });
    response.end(JSON.stringify(routed.body));
  });

  server.listen(port, () => {
    process.stdout.write(
      `${JSON.stringify({
        status: "ok",
        service: "worker",
        port,
        configPackage: CONFIG_PACKAGE.name,
      })}\n`,
    );
  });

  const shutdown = () => {
    server.close();
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  return server;
}
