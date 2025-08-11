import React, { useState } from 'react'
import { awningPitchHandler } from '../core/coreFunctions';

const leftCantileverOption = () => {
  const [leftLength, setLeftLength] = useState(parseInt(localStorage.getItem('leftAwningLength')));
  const [leftPitch, setLeftPitch] = useState(parseFloat(localStorage.getItem('leftAwningPitch')));
  const [isCantileverChecked, setIsCantileverChecked] = useState(false);

  const handleLeftLength = (e) => {
    setLeftLength(e.target.value);
    localStorage.setItem("leftAwningLength", e.target.value);
  }

  const handleLeftPitch = (e) => {
    setLeftPitch(e.target.value);
    localStorage.setItem("leftAwningPitch", e.target.value);
    awningPitchHandler(e.target.value);
  }

  const handleCantileverChange = (e) => {
    setIsCantileverChecked(e.target.checked);
    if (e.target.checked) {
      localStorage.setItem("leftCantilever","true");
    } else {
      localStorage.setItem("leftCantilever","false");
    }
  };
  return (
    <>
      <div className="field-box">
        <span>length (m)</span>
        <div className="range-box">
          <input type="range" value={leftLength} min={1} max={15} step={1} onChange={handleLeftLength}/>
          <input type="text" value={leftLength}/>
        </div>
      </div>
      <div className="field-box">
        <span>Roof Pitch (m)</span>
        <div className="range-box">
          <input type="range" value={leftPitch} min={2.5} max={10} step={0.5} onChange={handleLeftPitch}/>
          <input type="text" value={leftPitch} onChange={(e) => setLeftPitch(e.target.value)}/>
        </div>
  </div>
    </>
  )
}

export default leftCantileverOption