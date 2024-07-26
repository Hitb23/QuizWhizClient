import React from "react";
import QuizHeader from "../../components/header/quizzes-header";
import jwtDecoder from "../../services/jwtDecoder";
import classes from "./style.module.css";
import { Typography, useMediaQuery } from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { AvatarGroup, Avatar } from "@mui/material";
const ContestantLeaderboard = () => {
  const PaticipantDetails = [
    { rank: 1, username: "hit", score: 80, Price: 600 },
    { rank: 1, username: "hit2", score: 80, Price: 600 },
    { rank: 2, username: "hit3", score: 70, Price: 600 },
    { rank: 3, username: "hit2", score: 60, Price: 600 },
    { rank: 3, username: "hit3", score: 60, Price: 600 },
    { rank: 4, username: "hit2", score: 50, Price: 600 },
    { rank: 5, username: "hit3", score: 40, Price: 600 }
  ];

  const getParticipantsByRank = (rank) => {
    return PaticipantDetails.filter(participant => participant.rank === rank);
  };
  
   const isSmallScreen = useMediaQuery('(max-width:458px)');

  return (
    <div className={classes["live-quiz-div"]}>
      <div>
        <QuizHeader userName={jwtDecoder().userName} />
      </div>
      <div className={`container ${classes["leaderboard-area"]}`}>
        <div className={` ${classes["title-div"]} p-2 `}>
          <div>
            <Typography variant="h4">Leaderboard</Typography>
          </div>
          <div className={classes["quiz-name-div"]}>
            <Typography variant="h6">Quiz Mania master</Typography>
          </div>
        </div>
        <div className="border p-4 text-white mt-3 border rounded">
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-4">
            <Typography variant="h5" className={`${classes["gaming-effect"]} border p-2`}>
              Your Score: 50/100
            </Typography>
            <Typography variant="h5"  className={`${classes["gaming-effect"]} border p-2`}>
              Your Rank: 2
            </Typography>
          </div>
          <Typography  variant={isSmallScreen ? 'h5' : 'h4'} className={`text-center mt-5 mb-3 `}>
            Congratulation, You Won 5000 Rs
            {/* <CurrencyRupeeIcon
              style={{ marginBottom: "5px", width: "35", height: "35" }}
            />{" "} */}

          </Typography>
        </div>
        <div className="border mt-3 p-2 rounded">
          <div className={` ${classes["podium-container"]} mt-4 p-2`}>
            <div className={classes["podium-item"]}>
              <p className={classes["podium-city"]}>
                <AvatarGroup total={getParticipantsByRank(1).length}>
                  <Avatar
                    alt="First Winner"
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
                <AvatarGroup total={getParticipantsByRank(2).length}>
                  <Avatar
                    alt="Second Winner"
                    src="/static/images/avatar/1.jpg"
                    sx={{ bgcolor: "#070033" }}
                  />
                </AvatarGroup>
              </p>
              <div className={`${classes["podium-rank"]} ${classes["first"]}`}>
                <Typography style={{ marginBottom: "-23px" }} variant="h1">
                  1
                </Typography>
              </div>
            </div>
            <div className={classes["podium-item"]}>
              <p className={classes["podium-city"]}>
                <AvatarGroup total={getParticipantsByRank(3).length}>
                  <Avatar
                    alt="Third Winner"
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
          <div className="text-center">
            <Typography variant="h5" style={{ color: "white" }}>Top Rankers</Typography>
          </div>
        </div>
        <div className="mt-5 table-responsive ">
          <table className="table border">
            <thead>
              <tr>
                <th
                  style={{ backgroundColor: "#a89ee9" }}
                  className="text-center"
                  scope="col"
                >
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
                <th
                  style={{ backgroundColor: "#a89ee9" }}
                  className="text-center"
                  scope="col"
                >
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
                <tr key={index}  >
                  <th className="text-center" style={{ backgroundColor: "#3d3189", color:"white" }} scope="row">
                    {item.rank}
                  </th>
                  <td className="text-center" colSpan="5" style={{ backgroundColor: "#3d3189", color:"white" }}>
                    {item.username}
                  </td>
                  <td className="text-center" style={{ backgroundColor: "#3d3189", color:"white" }}> {item.score}</td>
                  <td className="text-center" style={{ backgroundColor: "#3d3189", color:"white" }} colSpan="4">
                    {item.Price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContestantLeaderboard;
