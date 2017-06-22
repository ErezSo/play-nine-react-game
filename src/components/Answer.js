import React from 'react';

const Answer = (props) => {
	return (
  	<div className="col-5">
      {props.selectedNumbers.map((num, i) => 
        <span key={i}
              onClick={() => props.rollbackNumber(num)}>
          {num}
        </span>
      )}
    </div>
  )
}

export default Answer;