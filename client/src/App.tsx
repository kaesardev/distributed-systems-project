import React, {
  useEffect,
  useState,
  useCallback,
  FormEventHandler,
} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

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
    <div className="App">
      <p>Socket Status: {connectionStatus}</p>
      <form onSubmit={handleClickSendMessage}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <input type="submit" value="Send" />
      </form>
      <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul>
    </div>
  );
}

export default App;
