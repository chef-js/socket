"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
exports.requestHandler = requestHandler;
const chef_core_1 = require("chef-core");
const socket_io_1 = require("socket.io");
const config_1 = require("chef-core/config");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = require("fs");
async function createServer(config) {
  const app = (0, express_1.default)();
  const server = createExpressServer(config, app);
  if (Object.keys(config.plugins).length) {
    const io = new socket_io_1.Server(server);
    // when there is a connection from new user socket
    io.on("connection", (socket) => {
      const id = socket.id;
      // wait for handshake events
      socket.on(config.join, (topic) => {
        const joinEvent = { event: config.join, id, data: topic };
        const plugin = (0, chef_core_1.getPlugin)(config, topic);
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
            const leaveEvent = {
              event: config.leave,
              id,
              data: topic,
            };
            if (config.debug) {
              console.info(leaveEvent);
            }
            // handle leave event in plugins
            const plugin = (0, chef_core_1.getPlugin)(config, topic);
            plugin?.call(io, socket, leaveEvent);
          });
        }
      });
    });
  }
  app.start = function (port) {
    return new Promise((resolve) => {
      // ensure port is number
      server.listen(+port, () => resolve(app));
    });
  };
  return app;
}
function createExpressServer(config, app) {
  // spread ssl from config
  const { ssl } = config;
  // if config key and cert present
  if (ssl?.key && ssl?.cert) {
    const { key, cert } = ssl;
    // start ssl app and finish
    return https_1.default.createServer(
      { key: (0, fs_1.readFileSync)(key), cert: (0, fs_1.readFileSync)(cert) },
      app,
    );
  }
  // else start normal app
  return http_1.default.createServer(app);
}
function requestHandler(fileReaderCache) {
  return (req, res, next) => {
    const url = (0, chef_core_1.getUrl)(req.originalUrl);
    if (!url.match(new RegExp(`/${config_1.folder}/`))) {
      return next();
    }
    const get = fileReaderCache.get(url);
    if (!get) {
      return next();
    }
    const { status, mime, body } = get;
    if (config_1.debug) {
      console.info(status, mime, url);
    }
    // header sets content type
    res.header("Content-Type", mime);
    // write header sets status
    res.writeHead(status);
    res.end(body);
  };
}
