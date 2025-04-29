# chef-socket

<img style="max-width: 100%; float: right;" src="https://raw.githubusercontent.com/chef-js/core/main/chef.svg" alt="kisscc0" width="200" height="200" />

[<img src="https://img.shields.io/npm/v/chef-socket?style=for-the-badge&color=success" alt="npm version" />](https://www.npmjs.com/package/chef-socket?activeTab=versions)
[<img src="https://img.shields.io/circleci/build/github/chef-js/socket/main?style=for-the-badge" alt="build status" />](https://app.circleci.com/pipelines/github/chef-js/socket)

**static files server** designed for **node** written in **typescript**, with **tests**

with **web-sockets** micro-service manager, at the **same port**

- `express` for routing
- `socket.io` for websockets

## Using CLI

```bash
$ npx chef-socket folder [--plugin node_modules/chef-socket/chat.js]
```

## Using as a library

```ts
const { cook } = require("chef-socket");

cook({ folder: "folder" }).then((server: Express.Application) => {
  // server api is get, post, any
  server.any("/*", (req: Express.Request, res: Express.Response) => {
    res.end("200 OK");
  });
});
```

- minimal configuration is zero configuration, all values have defaults
- if `folder` param is omitted default `index.html` is read from `folder = '.'`
- serves from http://localhost:3000 unless `port` specified

## Chat Demo

https://chef-socket.pietal.dev/

### Chat using CLI

```bash
$ yarn add chef-socket
$ yarn chef-socket node_modules/chef-socket/demo --plugin node_modules/chef-core/chat.js
```

### Chat using as a library

```ts
const { cook, chat } = require("chef-socket"); // or chef-uws

cook({
  folder: "node_modules/chef-socket/demo",
  plugins: { chat },
}).then((server) => {
  console.log(server.config);
});
```

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
