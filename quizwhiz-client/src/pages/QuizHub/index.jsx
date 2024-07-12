import React, { useState, useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

const Quiz = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const [isContestActive, setIsContestActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [showJoinButton, setShowJoinButton] = useState(false);

  const formatTime = (time) => {
    const seconds = String(time.seconds).padStart(2, "0");
    const minutes = String(time.minutes).padStart(2, "0");
    const hours = String(time.hours).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:44361/quizhub")
      .withAutomaticReconnect()
      .build();

    setConnection(connection);

    connection.on("ReceiveMessage", (user, message) => {
      setMessages((prevMessages) => [...prevMessages, { user, message }]);
    });

    connection.on("ReceiveQuestion", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "System", message },
      ]);
    });
    connection.on("ContestActivated", (message) => {
      console.log(message);
      setIsContestActive(true);
    });
    connection.on("ReceiveRemainingTime", (contestId, time) => {
      setRemainingTime(time);
      console.log(time);
      const minutesRemaining =
        time.minutes + time.hours * 60 + time.days * 24 * 60;
      if (minutesRemaining <= 15) {
        setShowJoinButton(true);
      }
    });

    connection
      .start()
      .catch((error) => console.error("Connection failed: ", error));

    // return () => {
    //     connection.off("ReceiveRemainingTime");
    // };
  }, []);

  const handleSendMessage = () => {
    if (connection) {
      connection
        .invoke("SendMessage", "User", newMessage)
        .catch((error) => console.error("SendMessage failed: ", error));
      setNewMessage("");
    }
  };

  return (
    <div>
      <h1>Quiz Whiz</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            {message.user}: {message.message}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={(event) => setNewMessage(event.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
      <div>
        {isContestActive ? (
          <button>Join Now</button>
        ) : (
          <p className="text-white">Contest will start soon. Please wait...</p>
        )}
      </div>
      <div>
        {showJoinButton ? (
          <button className="text-white">Join Now</button>
        ) : (
          <p className="text-white">Contest will start soon. Please wait...</p>
        )}
        {remainingTime && (
          <div className="text-white">
            Time Remaining: {formatTime(remainingTime)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
