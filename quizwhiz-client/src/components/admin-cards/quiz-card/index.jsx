import { Card, CardContent, CardMedia, Typography } from '@mui/material'
import React from 'react'

const QuizCard = (ele) => {
  return (
    <Card className="col-lg-3 col-md-6 col-12">
    <CardMedia
      component="img"
      alt="green iguana"
      height="140"
      image="https://picsum.photos/200/300?nature=0"
    />
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {ele.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {ele.description}
      </Typography>
      <Typography gutterBottom variant="p" component="div">
        {ele.date}
      </Typography>
    </CardContent>
  </Card>
  )
}

export default QuizCard;