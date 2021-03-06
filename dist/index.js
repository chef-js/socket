"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const chef_core_1 = __importDefault(require("chef-core"));
const server_1 = require("./server");
async function startChef(userConfig) {
  return await (0, chef_core_1.default)(
    { ...userConfig, type: "express" },
    {
      createServer: server_1.createServer,
      requestHandler: server_1.requestHandler,
    }
  );
}
exports.default = startChef;
