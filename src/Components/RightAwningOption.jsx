import React, { useState } from 'react'
import { awningPitchHandler } from '../core/coreFunctions';
import { createAwningDepthMeasurementsRight } from '../Structure/gable';
import '../Components/spinner.css';
var loaded_meshes_global;
var local_scene;
export const get_height_update_details_right = (loadedmeshes, scene) => {
  loaded_meshes_global = loadedmeshes;
  local_scene = scene;
  return {loaded_meshes_global, local_scene};
}
const RightAwningOption = () => {
 
  const [rightLength, setRightLength] = useState(parseInt(localStorage.getItem('rightAwningLength')) || 1);
  const [rightPitch, setRightPitch] = useState(parseFloat(localStorage.getItem('rightAwningPitch')) || 2.5);
  const [isCantileverChecked, setIsCantileverChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRightLength = (e) => {
    const newLength = parseInt(e.target.value);
    setRightLength(newLength);
    localStorage.setItem("rightAwningLength", newLength);
    createAwningDepthMeasurementsRight(newLength, local_scene);
  };
  const [numBays, setNumBays] = useState(parseInt(localStorage.getItem('bay_no')) ); // Number of bays
  const baseRenderingTimePerBay = 600; // Base rendering time per bay in ms

  // Calculate dynamic rendering time
  const renderingTime = numBays / baseRenderingTimePerBay;
  console.log(`Number of bays: ${numBays}`);
  const handle_num_pitch = (e) => {
    const selectedValue = parseFloat(e.target.value);
    if ([5, 7.5, 10].includes(selectedValue)) {
      setRightPitch(selectedValue);
      localStorage.setItem('rightAwningPitch', selectedValue);
      awningPitchHandler(selectedValue);
    }
  };

  const handleRightPitchSlider = (e) => {
    const newPitch = parseFloat(e.target.value);
    setRightPitch(newPitch);
    
    // Start loading animation immediately when pitch is changed
    setIsLoading(true);
    
    // Calculate rendering time based on number of bays
    const renderingTime = numBays * baseRenderingTimePerBay; // Adjust rendering time based on number of bays
    setTimeout(() => {
      setIsLoading(false);
    }, renderingTime);
  };

  const handleRightPitchFinal = (e) => {
    const finalPitch = parseFloat(e.target.value);
    setRightPitch(finalPitch);
    localStorage.setItem('rightAwningPitch', finalPitch);
    awningPitchHandler(finalPitch);

    setIsLoading(true);
    const renderingTime = numBays * baseRenderingTimePerBay; // Adjust rendering time based on number of bays
    setTimeout(() => {
      setIsLoading(false);
    }, renderingTime);
  };
  const handleCantileverChange = (e) => {
    const isChecked = e.target.checked;
    setIsCantileverChecked(isChecked);
    localStorage.setItem("rightCantilever", isChecked.toString());
  };

  return (
    <>
      <div className="field-box">
        <span>Length (m)</span>
        <div className="range-box">
          <input
            type="range"
            value={rightLength}
            min={1}
            max={15}
            step={1}
            onChange={handleRightLength}
          />
          <input type="text" value={rightLength} readOnly />
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
            value={rightPitch}
            min={2.5}
            max={10}
            step={0.5}
            onChange={handleRightPitchSlider}
            onMouseUp={handleRightPitchFinal}
          />
          <input
            type="text"
            value={rightPitch}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              if (!isNaN(newValue) && newValue >= 2.5 && newValue <= 10) {
                setRightPitch(newValue);
                localStorage.setItem("rightAwningPitch", newValue);
              }
            }}
          />
          {isLoading && <div className="spinner-overlay"><div className="spinner"></div></div>}
        </div>
      </div>
    </>
  );
};

export default RightAwningOption