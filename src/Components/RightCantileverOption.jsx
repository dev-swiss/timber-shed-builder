import React, { useState } from 'react'
import { awningPitchHandler } from '../core/coreFunctions';

const RightCantileverOption = () => {
  const [rightLength, setRightLength] = useState(parseInt(localStorage.getItem('rightAwningLength')))
  const [rightPitch, setRightPitch] = useState(parseFloat(localStorage.getItem('rightAwningPitch')))
  const [isCantileverChecked, setIsCantileverChecked] = useState(false);
  const handleRightLength = (e) => {
    setRightLength(e.target.value);
    localStorage.setItem("rightAwningLength", e.target.value);
  }

  const handleRightPitch = (e) => {
    setRightPitch(e.target.value);
    localStorage.setItem('rightAwningPitch', e.target.value);
    awningPitchHandler(e.target.value);
  }

  const handleCantileverChange = (e) => {
    setIsCantileverChecked(e.target.checked);
    if (e.target.checked) {
      localStorage.setItem("rightCantilever","true");
    } else {
      localStorage.setItem("rightCantilever","false");
    }
  };

  return (
    <>
        <div className="field-box">
          <span>length (m)</span>
          <div className='range-box'>
            <input type="range" value={rightLength} min={1} max={15} step={1} onChange={handleRightLength}/>
            <input type="text" value={rightLength}/>
          </div>
        </div>
        <div className="field-box">
        <span>Roof Pitch (m)</span>
        <div className="range-box">
          <input type="range" value={rightPitch} min={2.5} max={10} step={0.5} onChange={handleRightPitch}/>
          <input type="text" value={rightPitch} onChange={(e) => setRightPitch(e.target.value)}/>
        </div>
  </div>
    </>
  )
}

export default RightCantileverOption