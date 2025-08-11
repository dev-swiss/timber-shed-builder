import React, { useState} from 'react'

const BackOverhangeOption = () => {
    const [backOverHange, setBackOverHange] = useState(0)
    const handleBackOverhange = (e) => {
      setBackOverHange(e.target.value);
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
              <input type="range" value={backOverHange} min={0} max={3} step={0.01} onChange={handleBackOverhange}/>
              <input type="text" value={backOverHange} onChange={handleBackOverhange}/>
            </div>
        </div>
    </>
  )
}

export default BackOverhangeOption