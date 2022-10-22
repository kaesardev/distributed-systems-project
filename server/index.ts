import {
  Server as WebSocketServer,
  AddressInfo,
  WebSocket as Client,
} from "ws";

const wss = new WebSocketServer({ port: 8080, path: "/finance" });

wss.on("listening", () => {
  const { address, port } = wss.address() as AddressInfo;
  const path = wss.options.path;
  console.log(`Websocket listening at ${address}${path}:${port}`);
});

var connections = new Set<Client>();
wss.on("connection", (wsc) => {
  if (!connections.has(wsc)) {
    connections.add(wsc);
  }

  wsc.on("message", function (message) {
    console.log("%s", message);

    connections.forEach((c) => {
      c.send(`${message}`);
    });
  });

  wsc.send("Hi!");
});

wss.on("close", () => console.log("Websocket closed!"));
