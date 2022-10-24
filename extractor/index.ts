import { CreateRabbitMQPublisher } from "./publisher";
import { CreateFinanceStream, GetHistoricalData } from "./pooler";

CreateFinanceStream("AAPL");
GetHistoricalData('AAPL')
CreateRabbitMQPublisher();
