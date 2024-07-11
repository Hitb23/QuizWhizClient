import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

const Quiz = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl('https://localhost:44361/quizhub')
      .withAutomaticReconnect()
      .build();

    setConnection(connection);

    connection.on('ReceiveMessage', (user, message) => {
      setMessages((prevMessages) => [...prevMessages, { user, message }]);
    });

    connection.on('ReceiveQuestion', (message) => {
      setMessages((prevMessages) => [...prevMessages, { user: 'System', message }]);
    });

    connection.start()
      .catch((error) => console.error('Connection failed: ', error));

    return () => {
      connection.stop();
    };
  }, []);

  const handleSendMessage = () => {
    if (connection) {
      connection.invoke('SendMessage', 'User', newMessage)
        .catch((error) => console.error('SendMessage failed: ', error));
      setNewMessage('');
    }
  };

  return (
    <div>
      <h1>Quiz Whiz</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message.user}: {message.message}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={(event) => setNewMessage(event.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Quiz;
