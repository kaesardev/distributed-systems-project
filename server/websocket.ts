import { Server as WebSocketServer, AddressInfo } from "ws";
import { v4 as uuidv4 } from "uuid";
import { Client } from "./interfaces/client";
import { GetStockStream } from "./subscriber";
import { Observable } from "rxjs";

export const CreateWebSocketServer = () => {
  const stocks: { [key: string]: Observable<any> } = {};
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
        let stock = payload as string;
        wsc.stock = stock;

        if (!(stock in stocks)) {
          stocks[stock] = GetStockStream(stock);
        }

        if (wsc.subscription) {
          wsc.subscription.unsubscribe();
        }
        wsc.subscription = stocks[stock].subscribe((payload) => {
          wsc.send(JSON.stringify({ type: "GET_STOCK", payload }));

          if (wsc.bet) {
            if (
              wsc.bet.open === 0 &&
              wsc.bet.openTimestamp <= new Date(payload.date)
            ) {
              wsc.bet.open = payload.close;
              wsc.send(JSON.stringify({ type: "OPEN_BET", payload }));
            }

            if (
              wsc.bet.close === 0 &&
              wsc.bet.closeTimestamp <= new Date(payload.date)
            ) {
              wsc.bet.close = payload.close;
              if (
                (wsc.bet.direction === "UP" && wsc.bet.open < payload.close) ||
                (wsc.bet.direction === "DOWN" && wsc.bet.open > payload.close)
              ) {
                wsc.bet.isWin = true;
                wsc.bet.value *= 2;
              }

              if (wsc.bet.isWin) {
                wsc.wallet += wsc.bet.value;
              } else {
                wsc.wallet -= wsc.bet.value;
              }

              wsc.history.push(wsc.bet);
              wsc.bet = null;

              wsc.send(JSON.stringify({ type: "CLOSE_BET", payload }));
              wsc.send(
                JSON.stringify({
                  type: "GET_PROFILE",
                  payload: {
                    wallet: wsc.wallet,
                    history: wsc.history,
                  },
                })
              );
            }
          }
        });
      } else if (type === "SET_BET") {
        var now = new Date(Date.now());

        var openTimestamp = new Date(now);
        openTimestamp.setSeconds(
          openTimestamp.getSeconds() + (10 - (openTimestamp.getSeconds() % 10))
        );

        var closeTimestamp = new Date(openTimestamp);
        closeTimestamp.setSeconds(closeTimestamp.getSeconds() + 10);

        wsc.bet = {
          isWin: false,
          stock: wsc.stock,
          timestamp: new Date(Date.now()).toISOString(),
          value: 10.0,
          openTimestamp,
          open: 0,
          closeTimestamp,
          close: 0,
          direction: payload,
        };
      }
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
