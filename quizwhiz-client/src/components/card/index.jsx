import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faCalendarAlt, faPlay, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const CardComponent = ({ count, text, icon }) => {
  return (
    <div className="col-md-3 mb-4">
      <div className="card">
        <div className="card-body text-center">
          <FontAwesomeIcon icon={icon} size="3x" />
          <h5 className="card-title mt-3">{text}</h5>
          <p className="card-text">{count}</p>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;