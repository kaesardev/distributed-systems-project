import { Server as WebSocketServer, AddressInfo, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

interface Bet {
  isWin: boolean;
  value: number;
  timestamp: number;
}

interface Client extends WebSocket {
  uuid: string;
  wallet: number;
  historic: Bet[];
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
    wsc.historic = [];

    if (!connections.has(wsc)) {
      connections.add(wsc);
    }

    wsc.on("message", function (message) {
      console.log("[Websocket]: %s", message);

      connections.forEach((c) => {
        c.send(`${message}`);
      });
    });

    wsc.send(
      JSON.stringify({
        wallet: wsc.wallet,
        history: wsc.historic,
      })
    );
  });

  wss.on("close", () => console.log("[Websocket] closed!"));

  return wss;
};
