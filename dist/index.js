"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = exports.config = void 0;
exports.cook = cook;
const chef_core_1 = require("chef-core");
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function () {
    return chef_core_1.config;
  },
});
const server_1 = require("./server");
var chat_1 = require("./chat");
Object.defineProperty(exports, "chat", {
  enumerable: true,
  get: function () {
    return chat_1.chat;
  },
});
async function cook(config = {}) {
  return await (0, chef_core_1.cook)(
    { ...config, type: "socket" },
    {
      createServer: server_1.createServer,
      requestHandler: server_1.requestHandler,
    },
  );
}
