import yahooFinance from "yahoo-finance2";
import * as amqp from "amqplib/callback_api";

(async () => {
  const results = await yahooFinance.quote("AAPL");

  console.log(results);
})();

function send() {
  amqp.connect('amqp://localhost', function(error, connection) {
    if (error) {
      throw error;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }
      var queue = 'hello';
      var msg = 'Hello world';

      channel.assertQueue(queue, {
        durable: false
      });

      channel.sendToQueue(queue, Buffer.from(msg));
      console.log(" [x] Sent %s", msg);
    });
    setTimeout(function() {
      connection.close();
      process.exit(0)
    }, 500);
  });
}