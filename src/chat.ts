import { Event } from "chef-core";

// for all sockets inside chat topic
export function chat(_ws: WebSocket, { id, event, data }: Event) {
  this.to("chat").emit(event, id, data);
}
