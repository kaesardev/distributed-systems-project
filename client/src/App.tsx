import { Button, FormControl, Grid, InputLabel, List, ListItemText, MenuItem, Select, Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
  useCallback, useEffect,
  useState
} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { ChartComponent } from "./Chart";
import { STOCKS } from "./enums/Stocks";

function App() {
  const socketUrl = "ws://localhost:8080/finance";
  const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [stock, setStock] = useState(null)

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickSendMessage = useCallback<any>(
    (e: any) => {
      e.preventDefault();
      sendMessage(currentMessage);
      setCurrentMessage("");
    },
    [currentMessage, sendMessage, setCurrentMessage]
  );

  const handleStockChange = (event: any) => {
    setStock(event.target.value);
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <Grid container spacing={2} className="App">
      <Grid item xs={12}>
        <Typography variant="h4" component="h2">
          Yet Another Gambling App
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControl onSubmit={handleClickSendMessage}>
          {/* <TextField
            value={currentMessage}
            margin="normal"
            id="standard-basic"
            label="Stock"
            variant="standard"
            onChange={(e) => setCurrentMessage(e.target.value)} /> */}
          <Box sx={{ minWidth: 200 }}>
            <InputLabel id="demo-simple-select-label">Stock</InputLabel>
            <Select size="small"
              margin="dense"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={stock}
              label="Stock"
              onChange={handleStockChange}
            >
              {STOCKS.map(stock => {
                return (
                  <MenuItem value={stock}>{stock}</MenuItem>
                )
              })}
            </Select>
          </Box>
          <Button sx={{ width: '100px', alignSelf: 'end' }} size="large" variant="contained" type="submit">Send</Button>
        </FormControl>
      </Grid>
      {/* <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul> */}
      <Grid item xs={12} lg={8}>
        <ChartComponent></ChartComponent>
      </Grid>
      <Grid item xs={6}>
        <Button variant="outlined">Down</Button>
      </Grid>
      <Grid item xs={6}>
        <Button variant="outlined">Up</Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2">Carteira: R$100,00</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="h6">Histórico</Typography>
        <List>
          <ListItemText primary="Vitória" />
          <ListItemText primary="Derrota" />
          <ListItemText primary="Derrota" />
        </List>
      </Grid>
    </Grid>
  );
}

export default App;
