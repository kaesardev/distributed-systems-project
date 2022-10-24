import { from, defer } from 'rxjs';
import yahooFinance from "yahoo-finance2";

async function createFinanceQuery (stockName: string) {
  const results = await yahooFinance.quote(stockName);
  return results;
};

// Transforma a requisição a API em um Observable
// TODO: Deixar as requisições acontecerem uma após a outra automaticamente
export const CreateFinanceStream = (stockName: string) => {
  const query$ = defer(async () => createFinanceQuery(stockName))
  query$.subscribe(console.log)
}

// Feito para testar a ideia de ter uma base de dados histórica
// Guarda apenas dados diários, poderia ser útil para termos 365 previsões no estoque anyway
export const GetHistoricalData = async (stockName: string) => {
  const queryOptions = {
    period1: new Date('2022-10-21T08:00:00.000Z')
  };
  const results = await yahooFinance.historical(stockName, queryOptions)
  console.log(results)
}