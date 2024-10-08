import {
  Config,
  Event,
  FileReaderResponse,
  Plugin,
  Server,
  getPlugin,
  getUrl,
} from "chef-core";
import { Socket, Server as SocketServer } from "socket.io";
import { debug, folder } from "chef-core/config";
import express, { NextFunction, Request, Response } from "express";
import http, { RequestListener } from "http";

import { Cache } from "@pietal.dev/cache";
import https from "https";
import { readFileSync } from "fs";

export async function createServer(config: Config): Promise<Server> {
  const app: Express.Application = express();
  const server: http.Server | https.Server = createExpressServer(config, app);

  if (Object.keys(config.plugins).length) {
    const io = new SocketServer(server);

    // when there is a connection from new user socket
    io.on("connection", (socket: Socket) => {
      const id: string = socket.id;

      // wait for handshake events
      socket.on(config.join, (topic: string) => {
        const joinEvent: Event = { event: config.join, id, data: topic };
        const plugin: Plugin | undefined = getPlugin(config, topic);

        // check if we have such plugin
        if (plugin) {
          // socket joins room
          socket.join(topic);

          // notifies everybody
          io.to(topic).emit(joinEvent.event, joinEvent.id, topic);

          if (config.debug) {
            console.info(joinEvent);
          }

          // on all actions from socket, use plugin
          socket.onAny((event, data) => {
            if (config.debug) {
              console.info({ event, id, data });
            }

            // bind io to context for plugin to have access
            plugin?.call(io, socket, { event, id, data });
          });

          socket.on("disconnect", () => {
            socket.leave(topic);

            const leaveEvent: Event = {
              event: config.leave,
              id,
              data: topic,
            };

            if (config.debug) {
              console.info(leaveEvent);
            }

            // handle leave event in plugins
            const plugin: Plugin | undefined = getPlugin(config, topic);

            plugin?.call(io, socket, leaveEvent);
          });
        }
      });
    });
  }

  (app as Server).start = function (port: number) {
    return new Promise((resolve) => {
      // ensure port is number
      server.listen(+port, () => resolve(app as Server));
    });
  };

  return app as Server;
}

function createExpressServer(
  config: Config,
  app: Express.Application,
): http.Server | https.Server {
  // spread ssl from config
  const { ssl } = config;

  // if config key and cert present
  if (ssl?.key && ssl?.cert) {
    const { key, cert } = ssl;

    // start ssl app and finish
    return https.createServer(
      { key: readFileSync(key), cert: readFileSync(cert) },
      app as RequestListener,
    );
  }

  // else start normal app
  return http.createServer(app);
}

export function requestHandler(
  fileReaderCache: Cache<FileReaderResponse>,
): (req: Request, res: Response, next: NextFunction) => boolean | void {
  return (req: Request, res: Response, next: NextFunction) => {
    const url: string = getUrl(req.originalUrl);
    const get = fileReaderCache.get(url);
    if (!get) {
      return next();
    }

    const { status, mime, body } = get;
    if (debug) {
      console.info(status, mime, url);
    }

    // header sets content type
    res.header("Content-Type", mime);
    // write header sets status
    res.writeHead(status);

    res.end(body);

    return true;
  };
}
