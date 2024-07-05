import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import Imgurl from "../../../assets/gk.jpg";
import { IoTimeOutline } from "react-icons/io5";
import { LuFileSpreadsheet } from "react-icons/lu";
import { FaListCheck } from "react-icons/fa6";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { HiOutlineTrophy } from "react-icons/hi2";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
const QuizCard = ({
  title,
  description,
  date,
  categoryName,
  time,
  Link,
  onClickHandler,
}) => {
  console.log(description);
  var name = categoryName.toLowerCase();
  console.log("Category name : " + name);
  var imageUrl = `${import.meta.env.VITE_PUBLIC_URL}src/assets/${name}.jpg`;
  if (name == "general knowledge") {
    imageUrl = `${import.meta.env.VITE_PUBLIC_URL}src/assets/gk.jpg`;
  }

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = new Date(`1970-01-01T${time}Z`).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
  const AnimatedButton = styled(Button)({
    position: "relative",
    overflow: "hidden",
    transition: "background-color 0.3s ease, transform 0.3s ease",
    "&:hover": {
      backgroundColor: "#4caf50", // Change to your preferred hover color
      transform: "scale(1.05)",
    },
    "& .MuiButton-endIcon": {
      transition: "transform 0.3s ease, margin-left 0.3s ease",
    },
    "&:hover .MuiButton-endIcon": {
      transform: "translateX(5px)",
    },
  });

  return (
    <>
      <div
        className="row gy-3 py-2 rounded-2"
        style={{ background: "#3d3189" }}
      >
        <div className="col-xl-3 col-sm-6 col text-center my-auto">
          <img src={Imgurl} height={120} width={250} />
        </div>
        <div className="col-xl-5 col-sm-6 text-xl-start my-2 text-center">
          <h6 className="text-white my-1">{formattedDate}</h6>
          <h3 className="text-white my-1">
            {title} <small>(Medium)</small>
          </h3>
          <h6 className="text-white my-1">{categoryName}</h6>
          <div className="d-flex  gap-2 my-2">
            <div>
              
              <IoTimeOutline color="white" size={25} />
              <small className="text-white m-2">1 Hour</small>
            </div>
            <div>
              
              <LuFileSpreadsheet color="white" size={25} />
              <small className="text-white m-2">{100} Marks</small>
            </div>
            <div>
              
              <FaListCheck color="white" size={25} />
              <small className="text-white m-2">40 Questions</small>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-sm-12   text-white my-auto float-lg-start float-end">
          {/* <div className="d-flex gap-2 align-items-center justify">
            <HiOutlineTrophy size={25} />
            <h3 className="pt-2">Winning Amount</h3>
          </div> 
          <h5>1000$(1st price)</h5> */}
          <AnimatedButton
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            color="primary"
            className="text-start text-md-center w-100"
          >
            Join Now
          </AnimatedButton>
        </div>
      </div>
    </>
  );
};

export default QuizCard;
