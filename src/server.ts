import * as express from "express";
import * as http from "http";

export const PORT = normalizePort(process.env.PORT || "3000");
let server: http.Server;

/**
 * Bootstraps a HTTP Server for an Express Application.
 */
export const createServer = (app: express.Application): http.Server => {
  server = http.createServer(app);

  server.listen(PORT);
  server.on("error", onError);
  server.on("listening", onListening);
  return server;
};

/**
 * Normalizes a port received as a parameter.
 * @param val port to normalize
 */
function normalizePort(val: string): any {
  const p = parseInt(val, 10);

  if (isNaN(p)) {
    // named pipe
    return val;
  }

  if (p >= 0) {
    // port number
    return p.toString();
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 * @param error Error event parameter.
 */
function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind: string =
    typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}
