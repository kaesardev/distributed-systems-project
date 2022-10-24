import amqp from "amqplib/callback_api";
import { GetHistoricalData } from "./pooler";

export const CreateRabbitMQPublisher = (symbol: string) => {
  amqp.connect("amqp://localhost", (connectError, connection) => {
    if (connectError) {
      throw connectError;
    }

    connection.createChannel(async (channelError, channel) => {
      if (channelError) {
        throw channelError;
      }

      channel.assertExchange(symbol, "fanout", { durable: false });

      var stream = await GetHistoricalData("AAPL");
      stream.subscribe((data) => {
        var msg = JSON.stringify(data);
        channel.publish(symbol, "", Buffer.from(msg));
        console.log("[RabbitMQ]: %s", msg);
      });
    });
  });

  return amqp;
};
