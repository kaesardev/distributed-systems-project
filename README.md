docker-compose up -d
docker exec -it rabbitmq bash

## Sending messages

rabbitmqadmin publish exchange=amq.default routing_key=hello payload="mensagem direto do console"

## Listing queues

rabbitmqctl list_queues
rabbitmqctl list_queues name messages_ready messages_unacknowledged

## Listing exchanges

rabbitmqctl list_exchanges

## Listing bindings

rabbitmqctl list_bindings
