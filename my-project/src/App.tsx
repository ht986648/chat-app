import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessage] = useState(['hi there', 'how are you']);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'join',
          payload: {
            roomId: 'red',
          },
        })
      );
    };

    ws.onmessage = (e) => {
      // Assuming e.data is a JSON string with a 'message' property
      const data = JSON.parse(e.data);
      setMessage((prevMessages) => [...prevMessages, data.payload.message]);
    };

    ws.onclose = () => {
      console.log('connection closed');
    };
  }, []);

  return (
    <>
      <div>
        <div>
          {messages.map((message, index) => (
            
            <div key={index}>{message}</div>
            
          ))}
        </div>
        <div>
          <input id="message" type="text" />
          <button
            onClick={() => {
              const message = document.getElementById('message')?.value;
              wsRef.current.send(
                JSON.stringify({
                  type: 'chat',
                  payload: {
                    message: message,
                  },
                })
              );
            }}
          >
            send message
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
