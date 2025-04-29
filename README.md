# chef-socket

<img style="max-width: 100%; float: right;" src="https://raw.githubusercontent.com/chef-js/core/main/chef.svg" alt="kisscc0" width="200" height="200" />

<a href="https://badge.fury.io/js/chef-socket"><img src="https://badge.fury.io/js/chef-socket.svg" alt="npm package version" /></a> <a href="https://circleci.com/gh/chef-js/socket"><img src="https://circleci.com/gh/chef-js/socket.svg" alt="tests status" /></a>

**static files server** designed for **node** written in **typescript**, with **tests**

with **web-sockets** micro-service manager, at the **same port**

- `express` for routing
- `socket.io` for websockets

## Command-Line

```bash
$ npx chef-socket folder [--debug] [--ssl] [--port 443] [--plugin path/to/plugin.js]
```

## Chat Demo

https://chef-socket.pietal.dev/

to have the same demo run locally just do

```bash
$ yarn add chef-socket
$ yarn chef-socket node_modules/chef-socket/demo --plugin node_modules/chef-core/chat.js
```

## Using as a library

```ts
const { cook } = require("chef-socket");
const config = require("./your-config");

cook(config).then((server: Express.Application) => {
  // server api is get, post, any
  server.any("/*", (req: Express.Request, res: Express.Response) => {
    res.end("200 OK");
  });
});
```

- minimal configuration is zero configuration (`{}`)
- if `folder` param is omitted default `index.html` is read from `folder = '.'`
- serves from http://localhost:3000 unless `port` specified

## Configuration

For more information about config parameters read:

- The default configuration https://github.com/chef-js/core#configuration
- The parameters types https://chef-js.github.io/core/types/Config.html

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

- a plugin is a function `(ws, { id, event, data })`
- it is called **each time** the frontend websocket emits to server
- you have to handle first join etc. yourself
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
