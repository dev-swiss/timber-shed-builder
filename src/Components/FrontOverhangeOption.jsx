import React, { useState } from 'react'

const FrontOverhangeOption = () => {
  const [frontOverHange, setFrontOverHange] = useState(0)
  const handleFrontOverhange = (e) => {
    setFrontOverHange(e.target.value);
  }
  return (
    <>
      <div className='checkbox'>
        <input type="checkbox" />
        <label>Overhang Owning</label>
      </div>
      <div className="field-box">
        <span>Length (m)</span>
        <div className='range-box'>
          <input type="range" value={frontOverHange} min={0} max={3} step={0.01} onChange={handleFrontOverhange}/>
          <input type="text" value={frontOverHange} onChange={handleFrontOverhange}/>
        </div>
      </div>
    </>
  )
}

export default FrontOverhangeOption