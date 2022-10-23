import amqp from "amqplib/callback_api";

export const CreateRabbitMQPublisher = () => {
  amqp.connect("amqp://localhost", (connectError, connection) => {
    if (connectError) {
      throw connectError;
    }

    connection.createChannel(function (channelError, channel) {
      if (channelError) {
        throw channelError;
      }

      var msg = process.argv.slice(2).join(" ") || "Hello World!";

      const exchange = "logs";
      const queue = "";

      channel.assertExchange(exchange, "fanout", { durable: false });

      channel.publish(exchange, queue, Buffer.from(msg));

      console.log(" [x] Sent %s", msg);
    });

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });

  return amqp;
};
