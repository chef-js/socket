"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = chat;
// for all sockets inside chat topic
function chat(_ws, { id, event, data }) {
  this.to("chat").emit(event, id, data);
}
