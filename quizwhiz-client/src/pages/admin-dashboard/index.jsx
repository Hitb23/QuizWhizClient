import * as React from "react";
import { Box, Button } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import classes from "./style.module.css";
import { MdArrowForward } from "react-icons/md";
import { Category } from "../../utils/dummyData";
import CardComponent from "../../components/admin-cards/quiz-category";
import {
  faQuestionCircle,
  faCalendarAlt,
  faPlay,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { DrawerHeader } from "../../components/admin-components";
import AdminSlider from "../../components/header/admin-header";
import QuizCard from "../../components/admin-cards/quiz-card";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/admin-components";
import SearchIcon from "@mui/icons-material/Search";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const navigateToCategory = (id) => {
    if (id === "pending") navigate(`/admin-dashboard`);
    else navigate(`/contest/${id}`);
  };
  return (
    <Box
      sx={{ display: "flex", background: "#f8f8ff" }}
      className={`${classes["bgimage"]}`}
    >
      <CssBaseline />
      {/* Admin offcanvas with navbar */}
      <AdminSlider />
      {/* Main Content */}
      <Box className={` container`} component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <div className="mt-5 row">
          <CardComponent
            count={3}
            text="Upcoming"
            icon={faCalendarAlt}
            onClickHandler={navigateToCategory}
            active={"total"}
          />
          <CardComponent
            count={5}
            text="Active"
            icon={faPlay}
            onClickHandler={navigateToCategory}
            active={"total"}
          />
          <CardComponent
            count={2}
            text="Completed"
            icon={faCheckCircle}
            onClickHandler={navigateToCategory}
            active={"total"}
          />
          <CardComponent
            count={10}
            text="Pending"
            icon={faQuestionCircle}
            onClickHandler={navigateToCategory}
            active={"pending"}
          />
        </div>
        <div className="d-flex justify-content-between align-items-center flex-wrap column-gap-2 my-2">
          <Search>
            <SearchIconWrapper>
              <SearchIcon  sx={{color:'#F47D0A'}}/>
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <button className={`${classes["add-quiz-btn"]}`}>Add Quiz</button>
        </div>
        <h4>Active Contest</h4>
        <div className="row">
          {Category.map((ele) => (
            <QuizCard
              title={ele.title}
              description={ele.description}
              date={ele.date}
              time={ele.time}
            />
          ))}
        </div>

        <h4>Ongoing Contest</h4>

        <Box className="row">
          {Category.map((ele) => (
            <QuizCard
              title={ele.title}
              description={ele.description}
              date={ele.date}
              time={ele.time}
            />
          ))}
        </Box>

        <h4>Completed Contest</h4>
        <Box className="row">
          {Category.map((ele) => (
            <QuizCard
              title={ele.title}
              description={ele.description}
              date={ele.date}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
export default AdminDashboard;
