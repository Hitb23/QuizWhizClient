import React from "react";
import classes from "./style.module.css";
const CoinsCard = ({
  imageUrl,
  value,
  priceIcon,
  totalLifeline,
  incrementCount,
}) => {
  return (
    <>
      <div
        className="d-flex flex-column align-items-center gap-3 rounded-2 flex-grow-1 "
        style={{ background: "#3d3189" }}
        onClick={() => incrementCount(totalLifeline)}
      >
        <img
          src={imageUrl}
          height={87}
          width={100}
          className={`${classes["hanging-image"]} mx-5 mt-4`}
        />
        <div className="d-flex justify-content-between align-items-center gap-3">
          <div className={`${classes["count-of-lifeline"]}`}>
            <span className={` ${classes["text-bg"]}`}>
              {totalLifeline.LifelineCount}
            </span>
          </div>
        </div>
        <button
          className={`${classes["coin-btn"]} d-flex justify-content-between align-items-center gap-3 px-3 rounded-3 mb-3`}
          onClick={() =>
            incrementCount(
              totalLifeline.LifelineId,
              totalLifeline.LifelineCount
            )
          }
        >
          <img src={priceIcon} height={25} />
          <h5 className={`${classes["text-bg"]} text-white mt-2`}>{value}</h5>
        </button>
        
      </div>
    </>
  );
};

export default CoinsCard;
