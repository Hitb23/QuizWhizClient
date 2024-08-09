import React from "react";
import classes from '../profile-photo/style.module.css';
const ImageComponent = ({ alter, widthVal, heightVal, objFit, userName }) => {
  const fullImagePath = `192.168.1.20:8002/ProfilePhoto/${userName}/${userName}.jpg`;

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
