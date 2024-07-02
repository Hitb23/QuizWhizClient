import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";

const QuizCard = ({ title, description, date, categoryName, time }) => {
  console.log(description);
  console.log("Category name : " + categoryName);
  var imageUrl = `src/assets/${categoryName}.jpg`;
  if(categoryName === "general knowledge"){
    imageUrl = `src/assets/general-knowledge.jpg`;
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
  return (
    <div className="col-lg-3 col-md-6 col-12 mb-2">
      <Card
        className="rounded-3 custom-card"
        sx={{
          cursor: "pointer",
          margin: "9px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <CardMedia
          component="img"
          alt="image"
          height="140"
          image={imageUrl}
          sx={{
            width: "100%",
            objectFit: "cover",
          }}
        />
        <CardContent
          className="d-flex flex-column"
          sx={{
            paddingTop: "16px",
            paddingBottom: "16px",
            textAlign:'center'
          }}
        >
          <Typography
            variant="h5"
            className="fw-semibold"
            sx={{ marginBottom: "8px" }}
          >
            {title.substring(0,14)}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className="fw-semibold text-center"
            sx={{ marginBottom: "16px" }}
          >
            {description.substring(0,14)}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ marginBottom: "8px" }}
          >
            Contest Starts In
          </Typography>
          <h5 variant="h6" className="text-black fw-semibold">
            {formattedDate}
          </h5>
          <Button
            className="mt-2"
            sx={{
              outline: "1px solid #5f071c",
              fontWeight: "bold",
              color: "#5f071c",
              "&:hover": {
                backgroundColor: "#5f071c",
                color: "white",
                borderColor: "primary.main",
                fontWeight: "bold",
              },
            }}
            >
            View Details
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCard;
