import React, { useState } from "react";
import classes from "./style.module.css";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  AvatarGroup,
  Avatar,
} from "@mui/material";
import { useParams } from "react-router-dom";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { height } from "@mui/system";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const ViewQuizResult = () => {
  const { quizLink } = useParams();
  
  const PaticipantDetails = [
    { rank: 1, username: "hit", score: 80, Price: 600 },
    { rank: 1, username: "hit2", score: 80, Price: 600 },
    { rank: 2, username: "hit3", score: 70, Price: 600 },
    { rank: 3, username: "hit2", score: 60, Price: 600 },
    { rank: 3, username: "hit3", score: 60, Price: 600 },
    { rank: 4, username: "hit2", score: 50, Price: 600 },
    { rank: 5, username: "hit3", score: 40, Price: 600 }
  ];

  const TopRankersDetails = PaticipantDetails.filter((participant)=>{
    return participant.rank <= 3 && participant.rank >= 1
  })
  
  console.log(TopRankersDetails);
  return (
    <main className={`${classes["live-quiz-div"]}`}>
      <div className="container p-2 ">
        <div className={` ${classes["title-div"]} p-2 `}>
          <div>
            <Typography variant="h4">Leaderboard</Typography>
          </div>
          <div className={classes["quiz-name-div"]}>
            <Typography variant="h6">Quiz Mania master</Typography>
          </div>
        </div>
        <div className="d-flex flex-column flex-sm-row gap-2 mt-3 justify-content-end ">
          <div
            className="d-flex flex-row gap-2  p-2 rounded"
            style={{ backgroundColor: "#fada65", color: "#070033" }}
          >
            <PeopleAltIcon style={{ width: "30", height: "30" }} />
            <Typography variant="h6">Participants: {100}</Typography>
          </div>
          <div
            className="d-flex flex-row gap-2  p-2 rounded"
            style={{ backgroundColor: "#fada65", color: "#070033" }}
          >
            <EmojiEventsIcon style={{ width: "30", height: "30" }} />
            <Typography variant="h6">
              Winning Price: {100}{" "}
              <CurrencyRupeeIcon
                style={{ marginLeft: "-5px", width: "25", height: "25" }}
              />
            </Typography>
          </div>
        </div>
        <div className="border mt-3 p-2 rounded">
          <div className={` ${classes["podium-container"]} mt-4 p-2`}>
            <div className={classes["podium-item"]}>
              <p className={classes["podium-city"]}>
                <AvatarGroup total={1}>
                  <Avatar
                    alt="Remy Sharp"
                    src="/static/images/avatar/1.jpg"
                    sx={{ bgcolor: "#070033" }}
                  />
                </AvatarGroup>
              </p>
              <div className={`${classes["podium-rank"]} ${classes["second"]}`}>
                <Typography variant="h2">2</Typography>
              </div>
            </div>
            <div className={classes["podium-item"]}>
              <p className={classes["podium-city"]}>
                <AvatarGroup total={1}>
                  <Avatar
                    alt="Remy Sharp"
                    src="/static/images/avatar/1.jpg"
                    sx={{ bgcolor: "#070033" }}
                  />
                </AvatarGroup>
              </p>
              <div className={`${classes["podium-rank"]} ${classes["first"]}`}>
                <Typography style={{marginBottom: "-23px"}} variant="h1">1</Typography>
              </div>
            </div>
            <div className={classes["podium-item"]}>
              <p className={classes["podium-city"]}>
                <AvatarGroup total={4}>
                  <Avatar
                    alt="Semy Sharp"
                    src="/static/images/avatar/1.jpg"
                    sx={{ bgcolor: "#070033" }}
                  ></Avatar>
                </AvatarGroup>
              </p>
              <div className={`${classes["podium-rank"]} ${classes["third"]}`}>
                <Typography variant="h3">3</Typography>
              </div>
            </div>
          </div>
          <div className="text-center" style={{ color: "#070033" }}>
            <Typography variant="h5">Top Rankers</Typography>
          </div>
        </div>
        <div className="mt-5 table-responsive ">
          <table className="table border">
            <thead>
              <tr>
                <th style={{ backgroundColor: "#a89ee9" }} className="text-center" scope="col">
                  Rank
                </th>
                <th
                  style={{ backgroundColor: "#a89ee9" }}
                  className="text-center"
                  scope="col"
                  colSpan="5"
                >
                  Username
                </th>
                <th style={{ backgroundColor: "#a89ee9" }} className="text-center" scope="col">
                  Score/{100}
                </th>
                <th
                  style={{ backgroundColor: "#a89ee9" }}
                  scope="col"
                  colSpan="4"
                  className="text-center"
                >
                  Price(Rs)
                </th>
              </tr>
            </thead>
            <tbody>
              {PaticipantDetails?.map((item, index) => (
                <tr key={index}>
                  <th className="text-center" scope="row">{item.rank}</th>
                  <td className="text-center" colSpan="5">{item.username}</td>
                  <td className="text-center"> {item.score}</td>
                  <td className="text-center" colSpan="4">{item.Price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default ViewQuizResult;
