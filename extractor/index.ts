import { CreateRabbitMQPublisher } from "./publisher";
import { CreateFinanceStream } from "./pooler";

CreateFinanceStream();
CreateRabbitMQPublisher();
