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

    

    connection.on("ReceiveRemainingTime_WJqpRNMN", (minutes, seconds) => {
      console.log(minutes + "-" + seconds);
      SetMinutes(minutes);
      SetSeconds(seconds);
    });
    connection.on("ReceiveQuestion_WJqpRNMN", async(questionNo,Question,seconds) => {
      const data=await Question;
      console.log(data)
      console.log("QuestionNo : "+ questionNo +" : " + Question)
      SetQuestion(Question.question.questionText);
      // SetSeconds(seconds)
    });
    connection.on("ReceiveTimerSeconds_WJqpRNMN", async(TimerSeconds) => {
      console.log("TimerSeconds : "+ TimerSeconds)
      SetSeconds(TimerSeconds);
      // SetSeconds(seconds)
    });
    connection.on("ReceiveAnswer_WJqpRNMN", async(ans,seconds) => {
      try{
        const data=await ans;
        console.log("Answer : "+ data.message)
        SetSeconds(seconds)
      }
      catch(error){
        console.log(error);
      }
    });
  

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
      <h1 className="text-white">{Question}</h1>
      <h1 className="text-white">{Seconds}</h1>

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
