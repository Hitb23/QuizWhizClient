import { Card, CardContent, CardMedia, Chip, Typography } from '@mui/material'
import React from 'react'

const QuizCard = (ele) => {
  return (
    <Card className="col-lg-3 col-md-6 col-12 mb-2" sx={{cursor:"pointer"}}>
    <CardMedia
      component="img"
      alt="green iguana"
      height="140"
      image="https://picsum.photos/seed/picsum/200/300"
    />
    <CardContent className='d-flex align-items-center flex-column'>
      <h5 className='fw-semibold'>
        {ele.title.substring(0,15)}
      </h5>
      <Typography variant="body2" color="text.secondary" className='fw-semibold text-center'>
        {ele.description}
      </Typography>
      <small>Contest Start In</small>
      <br/>
      <p  className='text-black fw-semibold fs-4'>
        {ele.date}
      </p>
      <p  className='text-black fw-semibold fs-5'>
        {ele.time}
      </p>
    </CardContent>
  </Card>
  )
}

export default QuizCard;