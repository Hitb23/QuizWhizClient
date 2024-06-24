import * as React from "react";
import { Box, Stack } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Pagination from '@mui/material/Pagination';
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { DrawerHeader } from "../../components/admin-components";
import AdminSlider from "../../components/header/admin-header";
import QuizCard from "../../components/admin-cards/quiz-card";
const AdminCategory = () => {
  const navigate = useNavigate();
  const params = useParams();
  const Updatedtext=params.id.substring(0,1).toUpperCase()+params.id.substring(1);
  const navigateToCategory = (id) => {
    if (id === "total") navigate(`/admin-dashboard`);
    else navigate(`/contest/${id}`);
  };

  return (
    <Box sx={{ display: "flex", background: "#fffff",flexDirection:'column' }}>
      <CssBaseline />
      {/* Admin offcanvas with navbar */}
      <AdminSlider />
      {/* Main Content */}
      <Box
        className={`${classes["bgimage"]} container`}
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
      >
        <DrawerHeader />
        <div className="mt-5 row">
          <CardComponent
            count={10}
            text="Total"
            icon={faQuestionCircle}
            onClickHandler={navigateToCategory}
            active={params.id}
          />
          <CardComponent
            count={3}
            text="Upcoming"
            icon={faCalendarAlt}
            onClickHandler={navigateToCategory}
            active={params.id}
          />
          <CardComponent
            count={5}
            text="Active"
            icon={faPlay}
            onClickHandler={navigateToCategory}
            active={params.id}
          />
          <CardComponent
            count={2}
            text="Completed"
            icon={faCheckCircle}
            onClickHandler={navigateToCategory}
            active={params.id}
          />
        </div>
        <h4>{Updatedtext} Contest</h4>
        <Box className="row">
          {Category.map((ele) => (
            <QuizCard
              title={ele.title}
              description={ele.description}
              date={ele.date}
            />
          ))}
        </Box>
        <div className="d-flex justify-content-end mt-3">
      <Pagination count={10} color="secondary"/>
      </div>
      </Box>
      
    </Box>
  );
};
export default AdminCategory;
