const Numbers = (props) => { 
	const numberClassName = (number) => {
  	if (props.usedNumbers.includes(number)) 		{ return 'used' }
  	if (props.selectedNumbers.includes(number)) { return 'selected' }
  }
  return (
    <div className="card text-center">
      <div>
        {Numbers.list.map((num, i) => 
      		<span key={i} className={numberClassName(num)}
                onClick={() => props.selectNumber(num)}>
            {num}
          </span>
        )}
      </div>
    </div>
  );
};

// Generate and store an array into the Numbers function object, 
// so it won't be generated every time the function is refreshed
Numbers.list = range(1, 10);

export default Numbers;