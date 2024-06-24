import * as React from "react";
import { Box } from "@mui/material";
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
const AdminDashboard = () => {
  const navigate=useNavigate();
  const navigateToCategory=(id)=>{
    // console.log("hello",id)
    if(id==='total') navigate(`/admin-dashboard`);
    else navigate(`/contest/${id}`);
  }
  return (
    <Box sx={{ display: "flex",background: '#f8f8ff' }}>
      <CssBaseline />
      {/* Admin offcanvas with navbar */}
      <AdminSlider/>
      {/* Main Content */}
      <Box
        className={`${classes["bgimage"]} container`}
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
      >
        <DrawerHeader />
        <div className="mt-5 row">
        <CardComponent count={10} text="Total" icon={faQuestionCircle} onClickHandler={navigateToCategory} active={'total'}/>
          <CardComponent count={3} text="Upcoming" icon={faCalendarAlt} onClickHandler={navigateToCategory} active={'total'}/>
          <CardComponent count={5} text="Active" icon={faPlay} onClickHandler={navigateToCategory} active={'total'}/>
          <CardComponent count={2} text="Completed" icon={faCheckCircle} onClickHandler={navigateToCategory} active={'total'}/>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <h4 >Active Contest</h4>
          <Link className="underline-none" to={"/contest/active"}>
            View All <MdArrowForward />
          </Link>
        </div>
        <Box className="row">
          {Category.map((ele) => (
            <QuizCard title={ele.title} description={ele.description} date={ele.date}/>
          ))}
        </Box>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <h4>Ongoing Contest</h4>
          <Link className="underline-none" to={"/contest/ongoing"}>
            View All <MdArrowForward />
          </Link>
        </div>
        <Box className="row">
          {Category.map((ele) => (
           <QuizCard title={ele.title} description={ele.description} date={ele.date}/>
          ))}
        </Box>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <h4 >Completed Contest</h4>
          <Link className="underline-none" to={"/contest/completed"}>
            View All <MdArrowForward />
          </Link>
        </div>
        <Box className="row">
          {Category.map((ele) => (
            <QuizCard title={ele.title} description={ele.description} date={ele.date}/>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
export default AdminDashboard;



