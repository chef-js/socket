# chef-socket

<img style="max-width: 100%;" src="https://raw.githubusercontent.com/chef-js/socket/main/chef.png" width="150" />

<a href="https://badge.fury.io/js/chef-socket"><img src="https://badge.fury.io/js/chef-socket.svg" alt="npm package version" /></a> <a href="https://circleci.com/gh/chef-js/socket"><img src="https://circleci.com/gh/chef-js/socket.svg?style=shield" alt="tests status" /></a>

**web-sockets** micro-service manager and **static files server** at the same port,

designed for **node** written in **typescript**, with **tests**

- `express` for routing (and `socket.io` for websockets)

## Minimal Chat Demo

https://chef-js-socket.herokuapp.com/

```bash
$ yarn add chef-socket
$ yarn chef-socket node_modules/chef-socket/demo --plugin node_modules/chef-core/chat.js
```

## Running

```bash
$ [PORT=4200] [yarn|npx] chef-socket folder [--debug] [--ssl] [--key example.key] [--cert example.crt] [--plugin path/to/file.js]
```

```ts
const startServer = require("chef-socket");

startServer({
  // this enables http/ws logs
  debug: process.argv.includes("--debug"),
  // port on which the server listens
  port: Number(process.env.PORT || 4200),
  // you can use --plugin ./path/to/plugin.js any number of times
  plugins: {},
  // handshake event
  join: "/join",
  // disconnect from room event
  leave: "/leave",
  // folder to static serve files
  folder: process.argv[2],
  // ssl = undefined | { key, cert }
  ssl: process.argv.includes("--ssl") ? ssl : undefined,
}).then((server: Express.Application) => {
  // server api is get, post, any
  server.any("/*", (req: Express.Request, res: Express.Response) => {
    res.end("200 OK");
  });
});
```

- `PORT=4200` - choose server port
- `folder` - folder you want to serve static files from
- `--debug` - show logs
- `--ssl` - start as https server, with self signed certificate
- `--key example.key` - path to real certificate key, use with `--ssl`
- `--cert example.crt` - path to real certificate, use with `--ssl`
- `--plugin path/to/file.js` - path to `WSPlugin`, can use multiple times

## Install

```bash
$ yarn add chef-socket
```

## Plugins

The **plugins** are a mighty thing, think of them like **chat rooms**,

after a client **handshakes** the chat room, his messages start being **forwarded** to that room,

and it is being handled there by the **room's own plugin**.

This means you can have for example: a **chat** server and other unrelated **websocket services**

at the **same port** as the **files server** too. **One** client may be in **many** rooms.

### STEP 1: Before Connection

- client -> `socket.io-client` connects to `location.origin.replace(/^http/, 'ws')`
- server -> waits for any incoming `config.join` events

### STEP 2: Connection

- client -> sends `join` event with room name (topic/plugin name)
- server -> if such plugin is configured joins client to that plugin

### STEP 3: After Connection

- client -> does some actions (emits, receives)
- server -> plugin responds to websocket actions

### STEP 4: Finish Connection

- client -> disconnects after some time
- server -> broadcasts to all plugins from room that client left (`config.leave`)

## API

- a plugin is a function `(ws, { id, event, data })` that is called **each time** the frontend websocket emits to server
- context (`this`) of each plugin is the `server` instance.
- plugins receive (and send) the data in the format of:

```ts
{
  id,    // WebSocket id - this is automatically added
  event, // event name as string
  data,  // any data accompanying the event
}
```

## License

MIT
