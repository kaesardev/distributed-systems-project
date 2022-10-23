import amqp from "amqplib/callback_api";

const URL = "amqp://localhost";
const EXCHANGE = "logs";
const QUEUE = "";

export const CreateRabbitMQSubscriber = () => {
  amqp.connect(URL, (connectError, connection) => {
    if (connectError) throw connectError;

    connection.createChannel((channelError, channel) => {
      if (channelError) throw channelError;

      channel.assertExchange(EXCHANGE, "fanout", { durable: false });

      channel.assertQueue(QUEUE, { exclusive: true }, function (queueError, q) {
        if (queueError) throw queueError;

        channel.bindQueue(q.queue, EXCHANGE, "");

        console.log(`[RabbitMQ] listenning at ${EXCHANGE}:${QUEUE}:${q.queue}`);

        channel.consume(
          q.queue,
          (msg) => {
            if (msg!.content) {
              console.log("[RabbitMQ]: %s", msg!.content.toString());
            }
          },
          { noAck: true }
        );
      });
    });
  });

  return amqp;
};
