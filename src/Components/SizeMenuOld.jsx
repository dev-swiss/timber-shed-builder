import { useState, useEffect } from "react";
import { connect } from "react-redux";
import "./SizeMenu.css";

const SizeMenu = (props) => {
  const {
    length,
    width,
    height,
    apexHeight,
    numberOfBays,
    customValue,
    baySize,
    dispatch,
  } = props;

  const handleLength = (e) => {
    const comparisonValue = localStorage.getItem('length');
    //for case of value obtained from front-end
    if(e && e.target && e.target.value !== undefined){
      const inputValue = Math.round(parseInt(e.target.value));
      const newLength = isNaN(inputValue) ? ' ' : Math.min(Math.max(inputValue, 30), 200);
      dispatch({ type: 'UPDATE_SIZE', payload: { length: newLength } });
      localStorage.setItem('length', newLength);
      const baySize = parseInt(localStorage.getItem('bay_size'));
      const newNumberOfBays =  parseInt(newLength/baySize);
      localStorage.setItem('bay_no', newNumberOfBays);
      dispatch({ type: 'UPDATE_SIZE', payload: { numberOfBays : newNumberOfBays } });
    }
    //for the case of value obtainer from Number of bays
    else if (e !== 'true') {
      //timeout before calculating newLength to wait for values
      setTimeout(() => {
        const newNumberOfBays = localStorage.getItem("bay_no");
        const newBaySize = localStorage.getItem("bay_size");
        const newLength = newBaySize * newNumberOfBays;
        dispatch({ type: 'UPDATE_SIZE', payload: { length: newLength } });
      }, 1000); 
    } 
    //for the case of value obtained from add bay button
    else if (e === 'true'){
      var length = parseInt(localStorage.getItem('length'));
      const baySize = parseInt(localStorage.getItem('bay_size'));
      length += baySize;
      localStorage.setItem('length', length);
      dispatch({ type: 'UPDATE_SIZE', payload: { length: length } });
      const newNumberOfBays =  length/baySize;
      dispatch({ type: 'UPDATE_SIZE', payload: { numberOfBays : newNumberOfBays } });
    }
  };

  var clickCounter = 0
  const handleAddBay = () => {
    clickCounter++;
    localStorage.setItem("click_counter", clickCounter);
    //call length handler to add bays
    handleLength('true')
  }

  localStorage.setItem('reset','false');
  const checkLocalStorageReset = () => {
    const intervalId = setInterval(() => {
      const resetFlag = localStorage.getItem('reset');
      if (resetFlag === 'true') {
        console.log("dispatching with flag: ", resetFlag)
        // dispatch({ type: 'UPDATE_SIZE', payload: { height: 5 } });
        // dispatch({ type: 'UPDATE_SIZE', payload: { width: 10 } });
        dispatch({ type: 'UPDATE_SIZE', payload: { length: 30 } });
        dispatch({ type: 'UPDATE_SIZE', payload: { numberOfBays: 3 } });
        dispatch({ type: 'UPDATE_SIZE', payload: { baySize: 10 } });
        //Rest local values
        localStorage.setItem('length', 30)
        localStorage.setItem('bay_no',3);
        localStorage.setItem('bay_size', 10);
        // setTimeout(() => {
        //   localStorage.setItem('height', 5);
        // }, 1000);
        // setTimeout(() => {
        //   localStorage.setItem('width', 10);
        // }, 2000);
        // Reset the flag to false
        localStorage.setItem('reset', 'false');
      }
    }, 1000); // Adjust the interval as needed (in milliseconds)
  
    // Return the interval ID in case you want to clear the interval later
    return intervalId;
  };
  // Call the function to start polling
  const intervalId = checkLocalStorageReset();

  const handleWidth = (e) => {
    const inputValue = Math.round(parseInt(e.target.value));
    const newWidth = isNaN(inputValue) ? ' ' : Math.min(Math.max(inputValue, 10), 60);
    dispatch({ type: 'UPDATE_SIZE', payload: { width: newWidth } });
    localStorage.setItem('width', newWidth);

    // Call handleApexHeight when width changes
    handleApexHeight();
  };

  const handleHeight = (e) => {
    const inputValue = Math.round(parseInt(e.target.value));
    const newHeight = isNaN(inputValue) ? ' ' : Math.min(Math.max(inputValue, 5), 10);
    if(newHeight == ' '){
      //do nothing
    }
    else{
      dispatch({ type: 'UPDATE_SIZE', payload: { height: newHeight } });
      localStorage.setItem('height', newHeight);
      // Call handleApexHeight when height changes
      handleApexHeight();
    }
  };

  const handleApexHeight = () => {
    setTimeout(() => {
      const newApex = localStorage.getItem('apex');
      if (newApex !== apexHeight) {
        dispatch({ type: 'UPDATE_SIZE', payload: { apexHeight: newApex } });
      }
    }, 1500); 
  };

  // // Attach the event listener
  // useEffect(() => {
  //   const storageEventListener = (e) => {
  //     if (e.key === 'apex') {
  //       // Update the local state variable when 'apex' changes in localStorage
  //       console.log("Apex changed");
  //       handleApexHeight();
  //     } else if (e.key === 'length'){
  //       console.log("length has changed");
  //     }
  //   };

  //   window.addEventListener('storage', storageEventListener);

  //   // Clean up: remove the event listener
  //   return () => {
  //     window.removeEventListener('storage', storageEventListener);
  //   };
  // }, []); // dependency

  const handleBayNumber = (action) => {
    const minBayNumber = 3;
    var maxBayNumber = 100;
  
    let newNumberofBays;
  
    // Use baySize to influence the logic for updating numberOfBays
    const newBaySize = parseInt(baySize);
    maxBayNumber = parseInt(200/baySize);
    const step = 1; 
    const currentValue = parseInt(numberOfBays);
  
    if (!isNaN(currentValue)) {
      let newValue;
      if (action === 'increment') {
        newValue = Math.min(currentValue + step, maxBayNumber);
      } else if (action === 'decrement') {
        newValue = Math.max(currentValue - step, minBayNumber);
      }
  
      dispatch({ type: 'UPDATE_SIZE', payload: { numberOfBays: newValue } });
      localStorage.setItem('bay_no', newValue);
      handleLength(length);
    }
  };

  const handleBaySize = (action) => {
    const step = 1; 
    const currentValue = parseFloat(baySize);
  
    if (!isNaN(currentValue)) {
      if (action === 'increment') {
        var newValue = Math.min(currentValue + step, 10);
      } else if (action === 'decrement') {
        newValue = Math.max(currentValue - step, 3);
      }
  
      dispatch({ type: 'UPDATE_SIZE', payload: { baySize: newValue } });
      localStorage.setItem('bay_size', newValue);
    }
  };
  
  const handleCustomValue = (e) => {
    const inputValue = Math.round(parseInt(e.target.value));
    const newPitch = isNaN(inputValue) ? '1' : Math.min(Math.max(inputValue, 1), 20);
    dispatch({ type: 'UPDATE_SIZE', payload: { customValue: newPitch } });
    localStorage.setItem('pitch', newPitch);

    //handle apex height when pitch changes
    handleApexHeight();
  };

  return (
    <>
      <div className="menu-container">
        <h2>Size</h2>
        <hr />
        <div className="upper-section">
          <p>Roof Top</p>
          <input type="button" value="generic roof type" />
          <br />
          <p>Roof Pitch</p>
          <select value={customValue} onChange={handleCustomValue}>
            <option value="">Select Any Value between 1 to 20</option>
            <option value={5}>5</option>
            <option value={11}>11</option>
          </select>
          <br />
          <p>Or choose Custom Value with Slider</p>
          <input
            type="range"
            value={customValue}
            min={1}
            max={20}
            onChange={handleCustomValue}
          />
          <input
            type="text"
            value={customValue}
            onChange={handleCustomValue}
          />
        </div>

        <hr />
        <div className="bottom-section">
          <p>Length (m):</p>
          <input
            type="range"
            value={length}
            min={30}
            max={200}
            //step={0.30222}
            onChange={handleLength}
          />
          <input
            className="sizeInput"
            type="text"
            value={length}
            onChange={handleLength}
          />
          <p>Width (m):</p>
          <input
            type="range"
            value={width}
            min={10}
            max={60}
            step={0.08888}
            onChange={handleWidth}
          />
          <input
            className="sizeInput"
            type="text"
            value={width}
            onChange={handleWidth}
          />
          <p>Height (m):</p>
          <input
            type="range"
            value={height}
            min={5}
            max={10}
            //step={0.04444}
            onChange={handleHeight}
          />
          <input
            className="sizeInput"
            type="text"
            value={height}
            onChange={handleHeight}
          />
          <p>Apex Height (m):</p>
          <input
            id="apexHeightInput"
            className="sizeInput"
            type="text"
            value={apexHeight}
            onChange={handleApexHeight}
          />

          <hr />
          
          <p>Number of bays: </p>
          <div className="increment-decrement-container">
            <button onClick={() => handleBayNumber('decrement')}>-</button>
            <input
              type="text"
              className="baySizeInput"
              value={!isNaN(numberOfBays) ? numberOfBays : ''}
              onChange={(e) => handleBayNumber(e.target.value)}
            />
            <button onClick={() => handleBayNumber('increment')}>+</button>
          </div>
        </div>
        <p>Bay size (m):</p>
          <div className="increment-decrement-container">
            <button onClick={() => handleBaySize('decrement')}>-</button>
            <input
              type="text"
              className="baySizeInput"
              value={!isNaN(baySize) ? baySize : ''}
              onChange={handleBaySize}
            />
            <button onClick={() => handleBaySize('increment')}>+</button>
          </div>

        <p>Front</p>
        <input type="button" value="+ bay" onClick={handleAddBay} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  length: state.length,
  width: state.width,
  height: state.height,
  apexHeight: state.apexHeight,
  numberOfBays: state.numberOfBays,
  baySize: state.baySize,
  customValue: state.customValue,
});

export default connect(mapStateToProps)(SizeMenu);
