import amqp from "amqplib/callback_api";

export const CreateRabbitMQSubscriber = () => {
  amqp.connect("amqp://localhost", (connectError, connection) => {
    if (connectError) {
      throw connectError;
    }

    connection.createChannel((channelError, channel) => {
      if (channelError) {
        throw channelError;
      }

      const exchange_name = "logs";
      const queue_name = "";

      channel.assertExchange(exchange_name, "fanout", { durable: false });

      channel.assertQueue(
        queue_name,
        { exclusive: true },
        function (error2, q) {
          if (error2) {
            throw error2;
          }

          channel.bindQueue(q.queue, exchange_name, "");

          console.log(
            `[RabbitMQ] listenning at ${exchange_name}:${queue_name}:${q.queue}`
          );

          channel.consume(
            q.queue,
            (msg) => {
              if (msg!.content) {
                console.log("[RabbitMQ]: %s", msg!.content.toString());
              }
            },
            {
              noAck: true,
            }
          );
        }
      );
    });
  });

  return amqp;
};
