import React, { useState } from 'react'
import { awningPitchHandler } from '../core/coreFunctions';

var loaded_meshes_global = [];
export const meshLoaderFrontAwning = ( loadedMeshes ) => {
  loaded_meshes_global = loadedMeshes;
  // console.log("Loaded Meshes: ", loaded_meshes_global);
  return loaded_meshes_global;
}

const FrontAwningOption = () => {
  const [frontLength, setFrontLength] = useState(parseInt(localStorage.getItem("frontAwningLength")))
  // const [frontPitch, setFrontPitch] = useState(2.5)
  // const [isCantileverChecked, setIsCantileverChecked] = useState(false);
  const handleFrontLength = (e) => {
    localStorage.setItem("frontAwningLength", e.target.value)
    setFrontLength(e.target.value)
  }

  // const handleFrontPitch = (e) => {
  //   setFrontPitch(e.target.value)
  //   awningPitchHandler(loaded_meshes_global);
  //   localStorage.setItem('frontAwningPitch', e.target.value)
  // }

  // const handleCantileverChange = (e) => {
  //   setIsCantileverChecked(e.target.checked);
  //   if (e.target.checked) {
  //     localStorage.setItem("frontCantilever","true");
  //   } else {
  //     localStorage.setItem("frontCantilever","false");
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
            <input type="range" value={frontLength} min={1} max={15} step={1} onChange={handleFrontLength}/>
            <input type="text" value={frontLength}/>
          </div>
        </div>
        {/* <div className="field-box">
          <span>Roof Pitch (m)</span>
          <div className="range-box">
            <input type="range" value={frontPitch} min={2.5} max={10} step={0.5} onChange={handleFrontPitch}/>
            <input type="text" value={frontPitch} onChange={(e) => setFrontPitch(e.target.value)}/>
          </div>
        </div> */}
    </>
  )
}

export default FrontAwningOption;
