import * as React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  // makeStyles,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Pagination from "@mui/material/Pagination";
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
import jwtDecoder from "../../services/jwtDecoder";
const AdminCategory = () => {
  const navigate = useNavigate();
  const params = useParams();
  const Updatedtext =
    params.id.substring(0, 1).toUpperCase() + params.id.substring(1);
  const navigateToCategory = (id) => {
    if (id === "total") navigate(`/admin-dashboard`);
    else navigate(`/contest/${id}`);
  };
  const [Records, setRecords] = React.useState(4);

  const handleChange = (event) => {
    setRecords(event.target.value);
  };
  const handlePageChange = async (event, value) => {
    const data = {
      Token: jwtDecoder(),
      Category: params.id,
      CurrentPage: value,
      PageSize: 5,
    };
    const result = await getContestRecords();
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
        <Box className="row g-1">
          {Category.map((ele) => (
            <QuizCard
              title={ele.title}
              description={ele.description}
              date={ele.date}
              time={ele.time}
            />
          ))}
        </Box>
        <div className="d-flex justify-content-between mt-3 align-items-center">
          <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
            <InputLabel id="demo-simple-select-autowidth-label">
              Page
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={Records}
              onChange={handleChange}
              autoWidth
              label="Page"
            >
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={12}>12</MenuItem>
            </Select>
          </FormControl>
          <Pagination
            count={10}
            color="primary"
            onChange={handlePageChange}
            sx={{
              "& .MuiPaginationItem-root": {
                backgroundColor: "white", 
                color: "black", 
                "&:hover": {
                  backgroundColor: "#F47D0A", 
                  color: "#ffffff", 
                },
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#F47D0A", 
                color: "#ffffff", 
              },
              "& .MuiPaginationItem-ellipsis": {
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "transparent", 
                  color: "#ffffff", 
                }, 
              },
            }}
          />
        </div>
      </Box>
    </Box>
  );
};
export default AdminCategory;
