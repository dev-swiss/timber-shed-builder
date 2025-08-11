import React, {isValidElement, useEffect, useState} from 'react'
import './Plan.css'

var loaded_meshes_global = [];
export const get_loaded_meshes = ( loadedMeshes ) => {
 loaded_meshes_global = loadedMeshes;
 return loaded_meshes_global;
}

const Plan = () => {
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [bay_size, setBay_size] = useState(0);
  const [total_bays, set_total_bays] = useState(0);
  const [leftAwning, setLeftAwning] = useState('false');
  const [rightAwning, setRightAwning] = useState('false');
  const [frontAwning, setFrontAwning] = useState('false');
  const [backAwning, setBackAwning] = useState('false');

  const [leftAwningWidth, setLeftAwningWidth] = useState(0);
  const [rightAwningWidth, setRightAwningWidth] = useState(0);
  const [frontAwningWidth, setFrontAwningWidth] = useState(0);
  const [backAwningWidth, setBackAwningWidth] = useState(0);

  const [leftCantilever, setLeftCantilever] = useState(false);
  const [rightCantilever, setRightCantilever] = useState(false);
  const [frontCantilever, setFrontCantilever] = useState(false);
  const [backCantilever, setBackCantilever] = useState(false);

  useEffect(() => {
    const length = parseFloat(localStorage.getItem('length')) || 0;
    const width = parseFloat(localStorage.getItem('width')) || 0;
    const bay_size = parseFloat(localStorage.getItem('bay_size')) || 0;
    const total_bays = Math.floor(length / bay_size);

    const leftAwning = localStorage.getItem('leftAwning') === 'true';
    const rightAwning = localStorage.getItem('rightAwning') === 'true';
    const frontAwning = localStorage.getItem('frontAwning') === 'true';
    const backAwning = localStorage.getItem('backAwning') === 'true';

    const leftAwningWidth = parseFloat(localStorage.getItem('leftAwningLength')) || 0;
    const rightAwningWidth = parseFloat(localStorage.getItem('rightAwningLength')) || 0;
    const frontAwningWidth = parseFloat(localStorage.getItem('frontAwningLength')) || 0;
    const backAwningWidth = parseFloat(localStorage.getItem('backAwningLength')) || 0;

    const leftCantilever = localStorage.getItem('leftCantilever') === 'true';
    const rightCantilever = localStorage.getItem('rightCantilever') === 'true';
    const frontCantilever = localStorage.getItem('frontCantilever') === 'true';
    const backCantilever = localStorage.getItem('backCantilever') === 'true';

    setLength(length);
    setWidth(width);
    setBay_size(bay_size);
    set_total_bays(total_bays);

    setLeftAwning(leftAwning);
    setRightAwning(rightAwning);
    setFrontAwning(frontAwning);
    setBackAwning(backAwning);

    setLeftAwningWidth(leftAwningWidth);
    setRightAwningWidth(rightAwningWidth);
    setFrontAwningWidth(frontAwningWidth);
    setBackAwningWidth(backAwningWidth);

    setLeftCantilever(leftCantilever);
    setRightCantilever(rightCantilever);
    setFrontCantilever(frontCantilever);
    setBackCantilever(backCantilever);
  },[localStorage.getItem('length'),
    localStorage.getItem('width'),
    localStorage.getItem('bay_size'), 
    localStorage.getItem('leftAwning'),
    localStorage.getItem('rightAwning'),
    localStorage.getItem('frontAwning'),
    localStorage.getItem('backAwning'),
    
    localStorage.getItem('leftAwningLength'),
    localStorage.getItem('rightAwningLength'),
    localStorage.getItem('frontAwningLength'),
    localStorage.getItem('backAwningLength'), 
    localStorage.getItem('leftCantilever'),
    localStorage.getItem('rightCantilever'),
    localStorage.getItem('frontCantilever'),
    localStorage.getItem('backCantilever'), 
    console.log(localStorage.getItem('leftCantilever')),
    console.log(localStorage.getItem('rightCantilever')),
    console.log(localStorage.getItem('frontCantilever')),
    console.log(localStorage.getItem('backCantilever')),
   
    ]);
   
    useEffect(() => {
    loaded_meshes_global.forEach(element => {
    if(element.name === 'Lwall') {
    }
    });
    }, [loaded_meshes_global]);
  const bayWidth = total_bays > 3 ? `calc(100% / ${total_bays})` : '31.5%';

  const renderLeftBays = () => {
    let bays = [];
    // Add the 0th index
    if (loaded_meshes_global[0]) {
      let LwallVisible = false;
      loaded_meshes_global[0].forEach((element) => {
        if (element.name === 'Lwall') {
          LwallVisible = element.isVisible;
        }
      });
      bays.push(
        <div
          key={0}
          className="bay"
          style={{
            width: '98%',
            backgroundColor: LwallVisible ? '#acb3b2' : '#d9cfcf',
            fontSize: '20px',
          }}
        >
          1
        </div>
      );
    }
  
    // Add indices 2 to total_bays - 1
    for (let i = 2; i < total_bays; i++) {
      let LwallVisible = false;
      if (loaded_meshes_global[i]) {
        loaded_meshes_global[i].forEach((element) => {
          if (element.name === 'Lwall') {
            LwallVisible = element.isVisible;
          }
        });
      }
      bays.push(
        <div
          key={i}
          className="bay"
          style={{
            width: '98%',
            backgroundColor: LwallVisible ? '#acb3b2' : '#d9cfcf',
            fontSize: '20px',
          }}
        >
          {i}
        </div>
      );
    }
  
    // Add the 1st index
    if (loaded_meshes_global[1]) {
      let LwallVisible = false;
      loaded_meshes_global[1].forEach((element) => {
        if (element.name === 'Lwall') {
          LwallVisible = element.isVisible;
        }
      });
      bays.push(
        <div
          key={1}
          className="bay"
          style={{
            width: '98%',
            backgroundColor: LwallVisible ? '#acb3b2' : '#d9cfcf',
            fontSize: '20px',
          }}
        >
          {loaded_meshes_global.length}
        </div>
      );
    }
  
    return bays;
  };
  
 
  const fwall = () => {
    const fwallvisible = loaded_meshes_global.some(mesh => 
        mesh.some(element => element.name === 'FWall' && element.isVisible)
    );

    // Log only when visibility changes
    if (fwallvisible !== previousFwallVisible) {
        console.log('FWall visibility:', fwallvisible);
        previousFwallVisible = fwallvisible; // Store the previous state
    }

    return {
        backgroundColor: fwallvisible ? '#acb3b2' : '#d9cfcf',
    };
  };

  let previousFwallVisible = false; // Initialize outside the function

  const backwall = () => {
    const backwallVisible = loaded_meshes_global.some(mesh => 
        mesh.some(element => element.name === 'BWall' && element.isVisible)
    );

    // Log only when visibility changes
    if (backwallVisible !== previousBackwallVisible) {
        console.log('BackWall visibility:', backwallVisible);
        previousBackwallVisible = backwallVisible; // Store the previous state
    }

    return {
        backgroundColor: backwallVisible ? '#acb3b2' : '#d9cfcf',
    };
  };

  let previousBackwallVisible = false; // Initialize outside the function

  const renderRightBays = () => {
    let bays = [];
  
    // Add the 0th index
    if (loaded_meshes_global[0]) {
      let RwallVisible = false;
      loaded_meshes_global[0].forEach((element) => {
        if (element.name === 'Rwall') {
          RwallVisible = element.isVisible;
        }
      });
      bays.push(
        <div
          key={0}
          className="bay"
          style={{
            width: '98%',
            backgroundColor: RwallVisible ? '#acb3b2' : '#d9cfcf',
            fontSize: '20px',
          }}
        >
          1
        </div>
      );
    }
  
    // Add indices 2 to total_bays - 1
    for (let i = 2; i < total_bays; i++) {
      let RwallVisible = false;
      if (loaded_meshes_global[i]) {
        loaded_meshes_global[i].forEach((element) => {
          if (element.name === 'Rwall') {
            RwallVisible = element.isVisible;
          }
        });
      }
      bays.push(
        <div
          key={i}
          className="bay"
          style={{
            width: '98%',
            backgroundColor: RwallVisible ? '#acb3b2' : '#d9cfcf',
            fontSize: '20px',
          }}
        >
          {i}
        </div>
      );
    }
  
    // Add the 1st index
    if (loaded_meshes_global[1]) {
      let RwallVisible = false;
      loaded_meshes_global[1].forEach((element) => {
        if (element.name === 'Rwall') {
          RwallVisible = element.isVisible;
        }
      });
      bays.push(
        <div
          key={1}
          className="bay"
          style={{
            width: '98%',
            backgroundColor: RwallVisible ? '#acb3b2' : '#d9cfcf',
            fontSize: '20px',
          }}
        >
          {loaded_meshes_global.length}
        </div>
      );
    }
  
    return bays;
  };
  
  const totalWidth = (parseFloat(width) + (leftAwning === 'true' ? leftAwningWidth : 0) + (rightAwning === 'true' ? rightAwningWidth : 0)).toFixed(1);
  const totalLength = (parseFloat(length) + (frontAwning === 'true' ? frontAwningWidth : 0) + (backAwning === 'true' ? backAwningWidth : 0)).toFixed(1);

  const leftBottomCenterBottomMeasurementStyle = {
    width: (frontAwning || backAwning ||frontCantilever|| backCantilever) ? '85%' : '100%',
  };

  console.log('Front Awning:', frontAwning, 'Back Awning:', backAwning, 'Calculated Width:', leftBottomCenterBottomMeasurementStyle.width);

  return (
    <div  id="export_image"className="big-plan-container">
      <div className="plan-medium-container">
        <div className="first-top-container">
          <div className="plan-left-container">
            <div className="left-top-container">
            { frontAwning || frontCantilever && <div className="left-left-small-container"></div> }

                 <div className="left-center-container"></div>
              { backAwning || backCantilever && <div className="left-right-big-container"></div> }
            </div>
            <div className="left-bottom-container">
            { frontAwning &&   <div className="left-bottom-left-measurement">{frontAwningWidth}m</div> }
            { (frontAwning || frontCantilever) && (
              <div className={`left-bottom-left-container ${frontCantilever ? 'no-border' : ''}`}></div> 
              )}
              <div className="left-bottom-center-container">
                <div className="left-bottom-center-top-boxes-container">
                  {renderLeftBays()}
                </div>
                <div className="left-bottom-center-bottom-measurement-container" style={leftBottomCenterBottomMeasurementStyle}>
                  <div className="left-bottom-measurement-left-side"></div>
                  <p className="left-bottom-measurement-text">{totalLength}m Left</p>
                  <div className="left-bottom-measurement-right-side"></div>
                </div>
              </div>
              { backAwning && <div className="left-bottom-right-measurement">{backAwningWidth}m</div> }
              {
               (backAwning || backCantilever) && (
               <div className={`left-bottom-right-container ${backCantilever ? 'no-border' : ''}`}></div>
              )}
            </div>
            <div className="top-left-verticle-measurement-line">
              <div className="top-left-verticle-measurement-line-left"></div>
              <p className="top-left-verticle-measurement-line-text">{localStorage.getItem('height')}m</p>
              <div className="top-left-verticle-measurement-line-right"></div>
            </div>
          </div>
          <div className="plan-front-container">
            <div className="front-plan-left-sizing front-side">
              <div className="front-plan-left-top-verticle-measurenment-line"></div>
              <p className="font-plan-left-sizing-text">{localStorage.getItem('apex')}m</p>
              <div className="front-plan-left-bottom-verticle-measurenment-line"></div>
            </div>
            
            <div className="front-plan-home-container">
              <div className="front-plan-home-roof"></div>

              <div className="front-plan-home-structure-container" style={fwall()}>
                
              {(leftAwning || leftCantilever) && <div className="front-plan-home-left-bay-measurement">{leftAwningWidth}m</div>}
                {/* top left awning */}
            
{(leftAwning || leftCantilever) && <div className="front-plan-home-left-side-bay"></div>}

                <div className="front-plan-home-floor-container">
                <div className="front-plan-home-floor-left-awining"></div>
                  <div className="front-plan-home-actual-floor"></div>
                  <div className="front-plan-home-floor-right-awining"></div>
                </div>
                {/*  top right awning */}
                {(rightAwning || rightCantilever) && 
                  <div className={`front-plan-home-right-side-bay ${(!leftAwning && !leftCantilever) ? 'no-top-margin' : ''}`}>
                  </div>
                }
                {(rightAwning || rightCantilever) && <div className="front-plan-home-right-bay-measurement">{rightAwningWidth}m</div>}
                <div className="front-plan-home-bottom-sizing-container">
                  <div className="front-plan-home-bottom-left-sizing"></div>
                  <p className="front-plan-home-bottom-text">{totalWidth}m Front</p>
                  <div className="front-plan-home-bottom-right-sizing"></div>
                </div>
              </div>
            </div>
            <div className="front-plan-right-sizing">
              <div className="front-plan-right-top-verticle-measurenment-line"></div>
              <p className="font-plan-right-sizing-text">{localStorage.getItem('height')}m</p>
              <div className="front-plan-right-bottom-verticle-measurenment-line"></div>
            </div>
          </div>
        </div>
        <div className="second-bottom-container">
          <div className="plan-left-container">
            <div className="left-top-container">
            { frontAwning || frontCantilever && <div className="left-left-small-container"></div> }
              <div className="left-center-container"></div>
              { backAwning || backCantilever && <div className="left-right-big-container"></div> }
            </div>
            <div className="left-bottom-container">
            { frontAwning &&   <div className="left-bottom-left-measurement">{frontAwningWidth}m</div> }
              { (frontAwning || frontCantilever) && ( 
                <div className={`left-bottom-left-container ${frontCantilever ? 'no-border' : ''}`}></div> 
              )}
              <div className="left-bottom-center-container">
                <div className="left-bottom-center-top-boxes-container">
                  {renderRightBays()}
                </div>
                <div className="left-bottom-center-bottom-measurement-container" style={leftBottomCenterBottomMeasurementStyle}>
                  <div className="left-bottom-measurement-left-side"></div>
                  <p className="left-bottom-measurement-text">{totalLength}m Right</p>
                  <div className="left-bottom-measurement-right-side"></div>
                </div>
              </div>
              { 
              (backAwning || backCantilever) && (
               <div className={`left-bottom-right-container ${backCantilever ? 'no-border': ''}`}></div> 
               )}
              { backAwning && <div className="left-bottom-right-measurement">{backAwningWidth}m</div> }
            </div>
            <div className="top-left-verticle-measurement-line">
              <div className="top-left-verticle-measurement-line-left"></div>
              <p className="top-left-verticle-measurement-line-text">{localStorage.getItem('height')}m</p>
              <div className="top-left-verticle-measurement-line-right"></div>
            </div>
          </div>
          <div className="plan-front-container">
            <div className="front-plan-left-sizing">
              <div className="front-plan-left-top-verticle-measurenment-line"></div>
              <p className="font-plan-left-sizing-text">{localStorage.getItem('apex')}m</p>
              <div className="front-plan-left-bottom-verticle-measurenment-line"></div>
            </div>
            <div className="front-plan-home-container">
              <div className="front-plan-home-roof"></div>
              <div className="front-plan-home-structure-container" style={backwall()}>
              {/* bottom leftawning */}
              {(leftAwning || leftCantilever) && <div className="front-plan-home-left-bay-measurement">{leftAwningWidth}m</div>}
              {(leftAwning || leftCantilever) && <div className="front-plan-home-left-side-bay"></div>}
                <div className="front-plan-home-floor-container">
                  <div className="front-plan-home-floor-left-awning"></div>
                  {frontAwning === 'true' && <div className="front-plan-home-floor-front-awning"></div>}
                  <div className="front-plan-home-actual-floor"></div>
                  {backAwning === 'true' && <div className="front-plan-home-floor-back-awning"></div>}
                  <div className="front-plan-home-floor-right-awning"></div>
                </div>
                {/* bottom leftawning */}
                {(rightAwning || rightCantilever) && 
                  <div className={`front-plan-home-right-side-bay ${(!leftAwning && !leftCantilever) ? 'no-top-margin' : ''}`}>
                  </div>
                }
                {(rightAwning || rightCantilever) && <div className="front-plan-home-right-bay-measurement">{rightAwningWidth}m</div>}
                <div className="front-plan-home-bottom-sizing-container">
                  <div className="front-plan-home-bottom-left-sizing"></div>
                  <p className="front-plan-home-bottom-text">{totalWidth}m Back</p>
                  <div className="front-plan-home-bottom-right-sizing"></div>
                </div>
              </div>
            </div>
            <div className="front-plan-right-sizing">
              <div className="front-plan-right-top-verticle-measurenment-line"></div>
              <p className="font-plan-right-sizing-text">{localStorage.getItem('height')}m</p>
              <div className="front-plan-right-bottom-verticle-measurenment-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Plan;