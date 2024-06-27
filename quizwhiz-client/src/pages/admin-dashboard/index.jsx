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
import jwtDecoder from "../../services/jwtDecoder";
import { getUserDetails } from "../../services/auth.service";
const AdminDashboard = () => {
  const [firstName, setFirstName] = useState('');  
  const [lastName, setLastName] = useState('');

  const navigate = useNavigate();
  const navigateToCategory = (id) => {
    if (id === "total") navigate(`/admin-dashboard`);
    else navigate(`/contest/${id}`);
  };
  var username = "";

  useEffect(() => {
    const data = jwtDecoder();
    username = data["Username"];
    console.log("Username in dahsboard: " + username);
    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetails(data["Username"]);
        setFirstName(response.data.data.FirstName);
        setLastName(response.data.data.LastName);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <Box
      sx={{ display: "flex", background: "#f8f8ff" }}
      className={`${classes["bgimage"]}`}
    >
      <CssBaseline />
      {/* Admin offcanvas with navbar */}
      <AdminSlider firstName={firstName.toString()} lastName={lastName.toString()} />
      {/* Main Content */}
      <Box className={` container`} component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <div className="mt-5 row">
          <CardComponent
            count={10}
            text="Total"
            icon={faQuestionCircle}
            onClickHandler={navigateToCategory}
            active={"total"}
          />
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
        </div>
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <button className={`${classes["add-quiz-btn"]}`}>Add Quiz</button>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h4>Active Contest</h4>
          <Link className={`${classes["link-style"]}`} to={"/contest/active"}>

            View All <MdArrowForward />
          </Link>
        </div>
        <Box className="row">
          {Category.map((ele, index) => (
            <QuizCard
              key={index}
              title={ele.title}
              description={ele.description}
              date={ele.date}
              time={ele.time}
            />
          ))}
        </Box>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <h4>Ongoing Contest</h4>
          <Link className={` ${classes["link-style"]}`} to={"/contest/ongoing"}>
            View All <MdArrowForward />
          </Link>
        </div>
        <Box className="row">
          {Category.map((ele, index) => (
            <QuizCard
              key={index}
              title={ele.title}
              description={ele.description}
              date={ele.date}
              time={ele.time}
            />
          ))}
        </Box>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <h4>Completed Contest</h4>
          <Link
            className={` ${classes["link-style"]}`}
            to={"/contest/completed"}
          >
            View All <MdArrowForward />
          </Link>
        </div>
        <Box className="row">
          {Category.map((ele, index) => (
            <QuizCard
              key={index}
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
