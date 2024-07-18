import React, { useState, useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import jwtDecoder from "../../services/jwtDecoder";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
const Quiz = () => {
  const [minutes, SetMinutes] = useState(0);
  const [Seconds, SetSeconds] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [Question,SetQuestion]=useState("");
  const [connection, setConnection] = useState(null);
  const [isContestActive, setIsContestActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [showJoinButton, setShowJoinButton] = useState(false);
  const [questiontext,SetQuestiontext]=useState('');
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

    // connection.on("ReceiveMessage", (user, message) => {
    //   setMessages((prevMessages) => [...prevMessages, { user, message }]);
    // });

    // connection.on("ReceiveQuestion", (message) => {
    //   setMessages((prevMessages) => [
    //     ...prevMessages,
    //     { user: "System", message },
    //   ]);
    // });
    // connection.on("ContestActivated", (message) => {
    //   console.log(message);
    //   setIsContestActive(true);
    // });
    // connection.on("ReceiveRemainingTime_PEPa86wz", (minutes, seconds) => {
    //   connection
    //   .invoke("SendAnswer", user,4)
    //   .catch((error) => console.error("SendMessage failed: ", error));
    //   console.log(minutes + "-" + seconds);
    //   SetMinutes(minutes);
    //   SetSeconds(seconds)
    // });
    // connection.on("ReceiveQuestion_PEPa86wz", (questionNo,Question,seconds) => {
    //   console.log("QuestionNo : "+ questionNo +" : " + Question)
    //   SetQuestion(Question);
    //   // SetSeconds(seconds)
    // });
    // connection.on("ReceiveTimerSeconds_PEPa86wz", (seconds) => {
    //   console.log("TimerSeconds : "+ seconds)
    //   // SetSeconds(seconds)
    // });
    // connection.on("ReceiveAnswer_PEPa86wz", (questionNo,ans,seconds) => {
    //   console.log("questionNo : "+questionNo +" : "+"Answer : "+ans)
    //   // console.log(ans);
    //   // SetSeconds(seconds)
    // });
    // var user = jwtDecoder();
    // console.log(user);
    // console.log(connection);
      connection
        .start()
        .catch((error) => console.error("Connection failed: ", error));

      return () => {
          connection.stop();
      }
  }, [Seconds,Question]);


  const fun=async()=>{
    console.log(connection)
    if(connection){
      await connection

        .invoke("SendAnswer",'WJqpRNMN',59,'ishanbhatt',[1])

        .catch((error) => console.error("SendMessage failed: ", error));
    }
  }

  return (
    <div>
       <Confetti
       className="h-100 w-100"
    
    />
      <h1>Quiz Whiz</h1>
      <button onClick={fun}>Send Message</button>

      {/* <ul>
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
      </div> */}
    </div>
  );
};

export default Quiz;
