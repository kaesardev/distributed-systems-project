import amqp from "amqplib/callback_api";
import { Observable } from "rxjs";

export const GetStockStream = (stockName: string) => {
  let observable = new Observable<any>((s) => {
    amqp.connect("amqp://localhost", (connectError, connection) => {
      if (connectError) throw connectError;

      connection.createChannel((channelError, channel) => {
        if (channelError) throw channelError;

        channel.assertExchange(stockName, "fanout", { durable: false });

        channel.assertQueue("", { exclusive: true }, function (queueError, q) {
          if (queueError) throw queueError;

          channel.bindQueue(q.queue, stockName, "");

          console.log(`[${stockName}] listenning at ${stockName}:${q.queue}`);

          channel.consume(
            q.queue,
            (data) => {
              if (data!.content) {
                var message = JSON.parse(data!.content.toString());
                // console.log(`[${stockName}]: %s`, message);
                s.next(message);
              }
            },
            { noAck: true }
          );
        });
      });
    });
  });

  return observable;
};
