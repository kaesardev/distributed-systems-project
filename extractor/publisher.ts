import amqp from "amqplib/callback_api";
import { GetHistoricalData } from "./pooler";

export const CreateRabbitMQPublisher = (stockName: string) => {
  amqp.connect("amqp://localhost", (connectError, connection) => {
    if (connectError) {
      throw connectError;
    }

    connection.createChannel(async (channelError, channel) => {
      if (channelError) {
        throw channelError;
      }

      channel.assertExchange(stockName, "fanout", { durable: false });

      var stream = await GetHistoricalData(stockName);
      stream.subscribe((data) => {
        var msg = JSON.stringify(data);
        channel.publish(stockName, "", Buffer.from(msg));
        console.log(`[${stockName}]: %s`, msg);
      });
    });
  });

  return amqp;
};
