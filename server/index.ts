import {
  Server as WebSocketServer,
  AddressInfo,
  WebSocket as Client,
} from "ws";

import * as amqp from "amqplib/callback_api";

/*
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
*/

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'hello';

    channel.assertQueue(queue, {
      durable: false
    });
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, function(msg: any) {
    console.log(" [x] Received %s", msg.content.toString());
    }, {
      noAck: true
    });
  });
});