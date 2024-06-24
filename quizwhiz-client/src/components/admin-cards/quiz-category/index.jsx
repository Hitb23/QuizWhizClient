import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from "./style.module.css"
const CardComponent = ({ count, text, icon , active ,onClickHandler }) => {
 
  // console.log(text,active)
  return (
    <div className={`col-lg-3 mb-4 col-sm-6 col-6`}>
      <div className="card" >
        <div className={`${classes["total-category"]} card-body text-center rounded-2 ${text.toLowerCase()===active ? classes['total-category-active']: ''}`} onClick={()=> onClickHandler(text.toLowerCase())}>
          <FontAwesomeIcon icon={icon} size="2x" color='white'/>
          <h5 className={`card-title mt-3 fw-bold text-white ${classes['title-size']}`}>{text}</h5>
          <p className={`card-text fs-5 fw-semibold text-white ${classes['count-size']}`}>{count}</p>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;