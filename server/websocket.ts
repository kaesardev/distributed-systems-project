import { Server as WebSocketServer, AddressInfo, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

interface Bet {
  stock: string;
  isWin: boolean;
  value: number;
  timestamp: number;
}

interface Client extends WebSocket {
  uuid: string;
  stock: string;
  wallet: number;
  history: Bet[];
}

export const CreateWebSocketServer = () => {
  const wss = new WebSocketServer({ port: 8080, path: "/finance" });

  wss.on("listening", () => {
    const { address, port } = wss.address() as AddressInfo;
    const path = wss.options.path;
    console.log(`[Websocket] listening at ${address}${path}:${port}`);
  });

  var connections = new Set<Client>();
  wss.on("connection", (wsc: Client) => {
    wsc.uuid = uuidv4();
    wsc.wallet = 100.0;
    wsc.history = [];

    if (!connections.has(wsc)) {
      connections.add(wsc);
    }

    wsc.on("message", function (message) {
      console.log("[Websocket]: %s", message);
      const { type, payload } = JSON.parse(message.toString());
      if (type === "SET_STOCK") {
        wsc.stock = payload as string;
      } else if (type === "SET_BET") {
      }

      connections.forEach((c) => {
        c.send(`${message}`);
      });
    });

    wsc.send(
      JSON.stringify({
        type: "GET_PROFILE",
        payload: {
          wallet: wsc.wallet,
          history: wsc.history,
        },
      })
    );
  });

  wss.on("close", () => console.log("[Websocket] closed!"));

  return wss;
};
