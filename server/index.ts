import { Server as WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080, path: "/chat" });

var connections = new Set();
wss.on("connection", (wsc) => {
  if (!connections.has(wsc)) {
    connections.add(wsc);
  }

  wsc.on("message", function (message) {
    console.log("%s", message);
  });

  wsc.send("Hi!");
});

wss.on("close", () => {});
