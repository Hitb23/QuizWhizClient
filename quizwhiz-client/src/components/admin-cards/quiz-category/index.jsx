import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from "./style.module.css";

const CardComponent = ({ count, text, icon, active, onClickHandler }) => {
  return (
    <div className="col-lg-3 mb-4 col-sm-6 col-6 " style={{boxSizing:'border-box'}}>
      <div
        className={`${classes["total-category"]} ${text.toLowerCase() === active ? classes['total-category-active'] : ''} card-body text-center rounded-2 p-3`}
        onClick={() => onClickHandler(text.toLowerCase())}
      >
        <div className={classes["glass-effect"]}>
          <FontAwesomeIcon icon={icon} size="2x" className={classes['card-icon']} />
          <h5 className={`card-title mt-3 text-Black-50 ${classes['title']}`}>{text}</h5>
          <p className={`card-text fs-5 text-Black-50 ${classes['count']}`}>{count}</p>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
