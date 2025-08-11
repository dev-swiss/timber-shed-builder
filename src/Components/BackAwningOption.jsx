import React, { useState } from 'react'

const BackAwningOption = () => {
  const [backLength, setBackLength] = useState(parseInt(localStorage.getItem("backAwningLength")));
  // const [backPitch, setBackPitch] = useState(2.5)
  // const [isCantileverChecked, setIsCantileverChecked] = useState(false);
  const handleBackLength = (e) => {
    localStorage.setItem("backAwningLength", e.target.value)
    setBackLength(e.target.value)
  }

  // const handleBackPitch = (e) => {
  //   setBackPitch(e.target.value)
  //   localStorage.setItem('backAwningPitch', e.target.value)
  // }

  // const handleCantileverChange = (e) => {
  //   setIsCantileverChecked(e.target.checked);
  //   if (e.target.checked) {
  //     localStorage.setItem("backCantilever","true");
  //   } else {
  //     localStorage.setItem("backCantilever","false");
  //   }
  // };

  return (
    <>
        {/* <div className='checkbox'>
          <input type="checkbox"  onChange={handleCantileverChange} checked={isCantileverChecked}/>
          <label>Cantilever</label>
        </div> */}
        <div className="field-box">
          <span>length (m)</span>
          <div className='range-box'>
            <input type="range" value={backLength} min={1} max={15} step={1} onChange={handleBackLength}/>
            <input type="text" value={backLength}/>
          </div>
        </div>
        {/* <div className="field-box">
          <span>Roof Pitch (m)</span>
          <div className="range-box">
            <input type="range" value={backPitch} min={2.5} max={10} step={0.5} onChange={handleBackPitch}/>
            <input type="text" value={backPitch} onChange={(e) => setBackPitch(e.target.value)}/>
          </div>
        </div> */}
    </>
  )
}

export default BackAwningOption;
