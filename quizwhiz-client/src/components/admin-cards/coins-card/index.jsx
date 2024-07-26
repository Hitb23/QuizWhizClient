import React from 'react'
import classes from './style.module.css';
const CoinsCard = ({imageUrl,value,priceIcon,totalLifeline,incrementCount,NotEnoughCoinsHandler}) => {
  return (
    <>
            <div
              className="d-flex flex-column align-items-center gap-3 rounded-2 flex-grow-1 "
              style={{ background: "#3d3189" }}
              onClick={()=> incrementCount(totalLifeline)}
            >
              <img
                src={imageUrl}
                height={110}
                className={`${classes["hanging-image"]} mx-5 mt-4`}
              />
              <div className="d-flex justify-content-between align-items-center gap-3 bg-gradient px-3 rounded-3">
                <img src={priceIcon} height={25} />
                <h5 className={`${classes["text-bg"]} text-white mt-2`}>{value}</h5>
              </div>
              <div className="d-flex justify-content-between align-items-center gap-3 pb-3">
                <div className={` ${classes["coin-btn"]} `}>
                  <button
                    className={` ${classes["coin-btn"]} ${classes["text-bg"]} ` }
                    onClick={()=> NotEnoughCoinsHandler()}
                  >
                    + Add
                  </button>
                </div>
                <div className={`${classes["count-of-lifeline"]}`}>
                  <span className={` ${classes["text-bg"]}`}>{totalLifeline}</span>
                </div>
              </div>
              
            </div>
    </>
  )
}

export default CoinsCard