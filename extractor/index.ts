import yahooFinance from "yahoo-finance2";

(async () => {
  const results = await yahooFinance.quote("AAPL");

  console.log(results);
})();
