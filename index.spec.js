"use strict";

describe("GIVEN chef is provided", () => {
  it("THEN requiring the library does not throw an error", () => {
    require(".");
  });

  describe("WHEN it is instantiated", () => {
    it("THEN it should initialize without throwing error", () => {
      const { cook } = require(".");

      expect(() => cook({ folder: "demo", port: 3001 })).not.toThrow();
    });

    it("THEN initialization should return a truthy instance", async () => {
      const { cook } = require(".");

      expect(await cook({ folder: "demo", port: 3002 })).toBeTruthy();
    });
  });

  describe("WHEN chef is initialized in ssl mode", () => {
    it("THEN it should not throw error", async () => {
      const { cook } = require(".");
      const api = await cook({
        debug: true,
        ssl: {
          key: "node_modules/chef-core/ssl/example.key",
          cert: "node_modules/chef-core/ssl/example.crt",
        },
        folder: "demo",
        port: 3010,
      });

      expect(api).toBeTruthy();
    });
  });

  describe("WHEN chef is initialized in debug mode", () => {
    it("THEN it should not throw error", async () => {
      const { cook } = require(".");
      const api = await cook({
        folder: "demo",
        debug: true,
        port: 3003,
      });

      expect(api).toBeTruthy();
    });
  });

  describe("WHEN chef is run on demo folder", () => {
    it("THEN it should not throw error", async () => {
      const { cook } = require(".");
      const test = async () =>
        await cook({ debug: true, folder: "demo", port: 3004 });

      expect(test).not.toThrow();
    });
  });

  describe("WHEN chef is initialized on specified port", () => {
    it("THEN it should start without error", async () => {
      const { cook } = require(".");
      const server = await cook({ folder: "demo", port: 8080 });

      expect(server).toBeTruthy();
    });
  });

  describe("WHEN chef is initialized with plugin", () => {
    it("THEN it should start without error", (done) => {
      const { cook, config } = require(".");

      cook({
        folder: "demo",
        port: 3000,
        plugins: {
          chat: function () {
            done();
          },
        },
      }).then(() => {
        const io = require("socket.io-client");
        const socket = new io("ws://localhost:3000", {
          transports: ["websocket"],
        });

        socket.onAny((event, id, data) => {
          expect(data).toBeTruthy();
          expect(id).toBeTruthy();
          expect(event).toBe(config.join);

          socket.close();
        });

        socket.on("connect", () => {
          socket.emit(config.join, "chat");
        });
      });
    });
  });
});
