import React from "react";
import classes from '../profile-photo/style.module.css';
const ImageComponent = ({ alter, widthVal, heightVal, objFit, userName }) => {
  const fullImagePath = `${import.meta.env.VITE_PUBLIC_URL}ProfilePhoto/${userName}/${userName}.jpg`;

  return (
    <div>
      <img
        src={fullImagePath}
        alt={alter}
        className={classes["profilePhoto"]}
        style={{ width: widthVal, height: heightVal, objectFit: objFit }}
      />
    </div>
  );
};

export default ImageComponent;
