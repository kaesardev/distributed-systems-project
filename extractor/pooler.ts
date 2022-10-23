import yahooFinance from "yahoo-finance2";

export const CreateFinanceStream = async () => {
  const results = await yahooFinance.quote("AAPL");

  console.log(results);
};
