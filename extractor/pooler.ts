import { map, Observable } from "rxjs";
import yahooFinance from "yahoo-finance2";
import {
  HistoricalResult,
  HistoricalRow,
} from "yahoo-finance2/dist/esm/src/modules/historical";

export const GetQuoteData = async (stockName: string) => {
  const quote = await yahooFinance.quote(stockName);
  return quote;
};

export const GetHistoricalData = async (stockName: string) => {
  const quote = await GetQuoteData(stockName);
  const firstDate = new Date(quote.firstTradeDateMilliseconds!);

  const queryOptions = {
    period1: firstDate,
  };
  const historic = await yahooFinance.historical(stockName, queryOptions);
  return CreateObservableYoYo(historic);
};

export const CreateObservableYoYo = (historic: HistoricalResult) =>
  new Observable<HistoricalRow>((s) => {
    let i = 0;
    let asc = true;

    setInterval(() => {
      if (i === 0) {
        asc = true;
      } else if (i === historic.length - 1) {
        asc = false;
      }

      let nextValue = historic[i];
      s.next(nextValue);

      if (asc) {
        i++;
      } else {
        i--;
      }
    }, 1000);
  }).pipe(map((d) => ({ ...d, date: new Date().toISOString() })));
