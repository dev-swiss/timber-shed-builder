import React, { useState, useEffect } from 'react'
import { awningPitchHandler, updateAwningHeight  } from '../core/coreFunctions';
import { checkHeightChangeLeft, createAwningDepthMeasurementsLeft } from '../Structure/gable';
import '../Components/spinner.css';
  var local_height
  var loaded_meshes_global = []
  var local_scene;
  var heightArrow;

export const get_height_update_details = (height, loadedmeshes, scene) => {
  local_height = height;
  loaded_meshes_global = loadedmeshes;
  local_scene = scene;
  return {local_height, loaded_meshes_global, local_scene};
}
// export const sendHeightArrowAfterPitchChange = () => {
//   if(heightArrow != null){
//     return heightArrow;
//   }else{
//     return null;
//   }
// }
const leftAwningOption = () => {
  const [leftLength, setLeftLength] = useState(parseInt(localStorage.getItem('leftAwningLength')) || 1);
  const [leftPitch, setLeftPitch] = useState(parseFloat(localStorage.getItem('leftAwningPitch')) || 2.5);
  const [isCantileverChecked, setIsCantileverChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Retrieve number of bays from local storage
  const [numBays, setNumBays] = useState(parseInt(localStorage.getItem('bay_no')) || 1); // Number of bays
  const baseRenderingTimePerBay = 600; // Base rendering time per bay in ms

  const handleLeftLength = (e) => {
    setLeftLength(e.target.value);
    createAwningDepthMeasurementsLeft(e.target.value, local_scene);
    localStorage.setItem("leftAwningLength", e.target.value);
  }

  const handle_num_pitch = (e) => {
    const selectedValue = parseFloat(e.target.value);
    if ([5, 7.5, 10].includes(selectedValue)) {
      setLeftPitch(selectedValue);
      localStorage.setItem("leftAwningPitch", selectedValue);
      awningPitchHandler(selectedValue);
    }
  }

  const handleLeftPitchSlider = (e) => {
    const newPitch = parseFloat(e.target.value);
    setLeftPitch(newPitch);
    
    // Start loading animation immediately when pitch is changed
    setIsLoading(true);
    
    // Calculate rendering time based on number of bays
    const renderingTime = numBays * baseRenderingTimePerBay; // Adjust rendering time based on number of bays
    setTimeout(() => {
      setIsLoading(false);
    }, renderingTime);
  };

  const handleLeftPitchFinal = (e) => {
    const finalPitch = parseFloat(e.target.value);
    setLeftPitch(finalPitch);
    localStorage.setItem('leftAwningPitch', finalPitch);
    awningPitchHandler(finalPitch);

    setIsLoading(true);
    const renderingTime = numBays * baseRenderingTimePerBay; // Adjust rendering time based on number of bays
    setTimeout(() => {
      setIsLoading(false);
    }, renderingTime);
  };

  const handleCantileverChange = (e) => {
    setIsCantileverChecked(e.target.checked);
    localStorage.setItem("leftCantilever", e.target.checked.toString());
  };

  return (
    <>
      <div className="field-box">
        <span>Length (m)</span>
        <div className="range-box">
          <input type="range" value={leftLength} min={1} max={15} step={1} onChange={handleLeftLength} />
          <input type="text" value={leftLength} readOnly />
        </div>
      </div>
      <div className="field-box">
        <span>Select Preset Roof Pitch (m)</span>
        <div className="field-box">
          <select onChange={handle_num_pitch}>
            <option value={0}>Select</option>
            <option value={5}>5</option>
            <option value={7.5}>7.5</option>
            <option value={10}>10</option>
          </select>
        </div>
        <span>Or select custom pitch: </span>
        <div className="range-box">
          <input
            type="range"
            value={leftPitch}
            min={2.5}
            max={10}
            step={0.5}
            onChange={handleLeftPitchSlider}
            onMouseUp={handleLeftPitchFinal}
          />
          <input
            type="text"
            value={leftPitch}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              if (!isNaN(newValue) && newValue >= 2.5 && newValue <= 10) {
                setLeftPitch(newValue);
                localStorage.setItem("leftAwningPitch", newValue);
              }
            }}
          />
          {isLoading && <div className="spinner-overlay"><div className="spinner"></div></div>}
        </div>
      </div>
    </>
  );
};

export default leftAwningOption;