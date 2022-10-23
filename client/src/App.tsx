import { Button, Grid, List, ListItemText, TextField, Typography } from "@mui/material";
import {
  FormEventHandler, useCallback, useEffect,
  useState
} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { ChartComponent } from "./Chart";

function App() {
  const socketUrl = "ws://localhost:8080/finance";
  const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickSendMessage = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      sendMessage(currentMessage);
      setCurrentMessage("");
    },
    [currentMessage, sendMessage, setCurrentMessage]
  );

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
        <form style={{
          display: 'flex',
          flexDirection: 'column'
        }} onSubmit={handleClickSendMessage}>
          <TextField
            value={currentMessage}
            margin="normal"
            id="standard-basic"
            label="Stock"
            variant="standard"
            onChange={(e) => setCurrentMessage(e.target.value)} />
          <Button sx={{ width: '100px', alignSelf: 'end' }} size="large" variant="contained" type="submit">Send</Button>
        </form>
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
      <Grid item xs={6}>
        <Typography variant="h6" component="h6">Vencedores</Typography>
        <List>
          <ListItemText primary="Fulano" />
          <ListItemText primary="Ciclano" />
          <ListItemText primary="Corno" />
        </List>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6" component="h6">Perdedores</Typography>
        <List>
          <ListItemText primary="Fulano" />
          <ListItemText primary="Ciclano" />
          <ListItemText primary="Corno" />
        </List>
      </Grid>
    </Grid>
  );
}

export default App;
