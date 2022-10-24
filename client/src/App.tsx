import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { ChartComponent } from "./Chart";
import { STOCKS } from "./enums/Stocks";

function App() {
  const chartRef = useRef<any>();
  const socketUrl = "ws://localhost:8080/finance";
  const [history, setHistory] = useState<string[]>([]);
  const [wallet, setWallet] = useState<number>(0);
  const [stock, setStock] = useState<string>("");
  const [currentMessage, setCurrentMessage] = useState("");

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      const { type, payload } = JSON.parse(lastMessage.data);
      if (type === "GET_PROFILE") {
        setWallet(payload.wallet);
        setHistory(payload.history);
      } else if (type === "GET_STOCK") {
        let chart = chartRef!.current!.getChart();

        chart.data.datasets.forEach((dataset: any) => {
          if (dataset.label === "Dataset 1") {
            dataset.data.push({
              x: new Date(payload.date).getTime(),
              y: payload.close,
            });
          }
        });
      }
    }
  }, [lastMessage, setHistory, setWallet]);

  const handleClickSendMessage = useCallback<any>(
    (e: any) => {
      e.preventDefault();
      sendMessage(currentMessage);
      setCurrentMessage("");
    },
    [currentMessage, sendMessage, setCurrentMessage]
  );

  const handleStockChange = (event: SelectChangeEvent<string>) => {
    const payload = event.target.value;
    sendMessage(JSON.stringify({ type: "SET_STOCK", payload }));
    setStock(payload);
  };

  const handleButtonDown = useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(
    (e) => {
      e.preventDefault();
      const payload = "DOWN";
      sendMessage(JSON.stringify({ type: "SET_BET", payload }));
    },
    [sendMessage]
  );

  const handleButtonUp = useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(
    (e) => {
      e.preventDefault();
      const payload = "UP";
      sendMessage(JSON.stringify({ type: "SET_BET", payload }));
    },
    [sendMessage]
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <Grid container spacing={2} className="App" padding={10}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h2">
          Yet Another Gambling App ({connectionStatus})
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControl onSubmit={handleClickSendMessage} fullWidth>
          <InputLabel id="stock-label">Stock</InputLabel>
          <Select
            id="stock"
            label="Stock"
            labelId="stock-label"
            onChange={handleStockChange}
            autoWidth={false}
            defaultValue={""}
            fullWidth
          >
            {STOCKS.map((stock) => {
              return (
                <MenuItem key={stock} value={stock}>
                  {stock}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5" component="h2" textAlign="right">
          Wallet: {wallet}
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ height: 300 }}>
        <ChartComponent ref={chartRef} stock={stock} />
      </Grid>
      <Grid item xs={6}>
        <Button
          color="warning"
          variant="contained"
          onClick={handleButtonDown}
          fullWidth
        >
          Down
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          color="success"
          variant="contained"
          onClick={handleButtonUp}
          fullWidth
        >
          Up
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="h6">
          Histórico
        </Typography>
        <List>
          {history.map((h, id) => {
            return <ListItemText key={id} primary={h} />;
          })}
        </List>
      </Grid>
    </Grid>
  );
}

export default App;
