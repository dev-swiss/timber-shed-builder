import React, { useState, useEffect } from 'react';
import './FloorPlan.css';

var loaded_meshes_global = [];
export const get_loaded_meshes = ( loadedMeshes ) => {
 loaded_meshes_global = loadedMeshes;
 return loaded_meshes_global;
}
const FloorPlan = () => {
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [baySize, setBaySize] = useState(0);
  const [bays, setBays] = useState(0);
  const [leftAwning, setLeftAwning] = useState('false');
  const [frontAwning, setFrontAwning] = useState('false');
  const [backAwning, setBackAwning] = useState('false');
  const [rightAwning, setRightAwning] = useState('false');
  const [leftAwningWidth, setLeftAwningWidth] = useState(0);
  const [frontAwningWidth, setFrontAwningWidth] = useState(0);
  const [backAwningWidth, setBackAwningWidth] = useState(0);
  const [rightAwningWidth, setRightAwningWidth] = useState(0);
  const [totalBays, setTotalBays] = useState([]);
  const [leftColVisibility, setLeftColVisibility] = useState([]);
  const [rightColVisibility, setRightColVisibility] = useState([]);
  const [col1Visible, setCol1Visible] = useState(false);
  const [col2Visible, setCol2Visible] = useState(false);

  const [col2Visibility, setCol2Visibility] = useState(false);
  const [leftCantilever, setLeftCantilever] = useState(false);
  const [rightCantilever, setRightCantilever] = useState(false);
  const [frontCantilever, setFrontCantilever] = useState(false);
  const [backCantilever, setBackCantilever] = useState(false);
  useEffect(() => {
    const length = parseFloat(localStorage.getItem('length'));
    const width = parseFloat(localStorage.getItem('width'));
    const baySize = parseFloat(localStorage.getItem('bay_size'));
    const bays = Math.ceil(length / baySize);
    const leftAwning = localStorage.getItem('leftAwning');
    const frontAwning = localStorage.getItem('frontAwning');
    const backAwning = localStorage.getItem('backAwning');
    const rightAwning = localStorage.getItem('rightAwning');
    const leftAwningWidth = parseFloat(localStorage.getItem('leftAwningLength'));
    const frontAwningWidth = parseFloat(localStorage.getItem('frontAwningLength'));
    const backAwningWidth = parseFloat(localStorage.getItem('backAwningLength'));
    const rightAwningWidth = parseFloat(localStorage.getItem('rightAwningLength'));

    const leftCantilever = localStorage.getItem('leftCantilever') === 'true';
    const rightCantilever = localStorage.getItem('rightCantilever') === 'true';
    const frontCantilever = localStorage.getItem('frontCantilever') === 'true';
    const backCantilever = localStorage.getItem('backCantilever') === 'true';
    setLength(length);
    setWidth(width);
    setBaySize(baySize);
    setBays(bays);

    setLeftAwning(leftAwning);
    setFrontAwning(frontAwning);
    setBackAwning(backAwning);
    setRightAwning(rightAwning);

    setLeftAwningWidth(leftAwningWidth);
    setFrontAwningWidth(frontAwningWidth);
    setBackAwningWidth(backAwningWidth);
    setRightAwningWidth(rightAwningWidth);

    setTotalBays(Array(bays).fill(length / bays));
    setLeftCantilever(leftCantilever);
    setRightCantilever(rightCantilever);
    setFrontCantilever(frontCantilever);
    setBackCantilever(backCantilever);

    const storedLeftColVisibility = JSON.parse(sessionStorage.getItem('leftColVisibility')) || []; // Default to an empty object
    const leftColCenter = JSON.parse(sessionStorage.getItem('leftColCenter')) || {}; // Parse as an object
    const col1State = JSON.parse(sessionStorage.getItem('col1')) || false;
    const col2State = JSON.parse(sessionStorage.getItem('col2')) || false;
    setCol1Visible(col1State);
    setCol2Visible(col2State);
    // Convert the object-based visibility into an array representation for easier handling
    const updatedVisibility = Array(bays - 1).fill(false).map((_, index) => {
      const label = (index + 1).toString(); // Convert index to string to match object keys
      // Use the value from `storedLeftColVisibility` or default to `false`
      const visibilityFromStored = storedLeftColVisibility[label] !== undefined ? storedLeftColVisibility[label] : false;
      // If the label exists in `leftColCenter`, it overrides the visibility
      const visibilityFromCenter = leftColCenter[label] !== undefined ? leftColCenter[label] : visibilityFromStored;
      return visibilityFromCenter;
    });
    
    console.log("Updated visibility:", updatedVisibility);
    
    setLeftColVisibility(updatedVisibility); // Ensure this is updated as an array
    
    

// Parse rightColVisibility and rightColCenter as objects from session storage
const storedRightColVisibility = JSON.parse(sessionStorage.getItem('rightColVisibility')) || {}; // Default to an empty object
const rightColCenter = JSON.parse(sessionStorage.getItem('RightColCenter')) || {}; // Parse as an object

// Convert the object-based visibility into an array representation
const updatedRightColVisibility = Array(bays - 1).fill(true).map((_, index) => {
  const label = (index + 1).toString(); // Convert index to string to match object keys
  // Use the value from `storedRightColVisibility` if it exists; otherwise, default to `true`
  const visibilityFromStored = storedRightColVisibility[label] !== undefined ? storedRightColVisibility[label] : false;
  // If the label exists in `rightColCenter`, it overrides the visibility
  const visibilityFromCenter = rightColCenter[label] !== undefined ? rightColCenter[label] : visibilityFromStored;
  return visibilityFromCenter;
});

console.log("Updated rightColVisibility:", updatedRightColVisibility);

setRightColVisibility(updatedRightColVisibility); // Ensure this is updated as an array


    // Log the retrieved visibility data
    console.log("Left Col Visibility:", storedLeftColVisibility);
    console.log("Right Col Visibility:", storedRightColVisibility);  }, [
    localStorage.getItem('length'),
    localStorage.getItem('width'),
    localStorage.getItem('bay_size'),
    localStorage.getItem('leftAwning'),
    localStorage.getItem('frontAwning'),
    localStorage.getItem('backAwning'),
    localStorage.getItem('rightAwning'),
    localStorage.getItem('leftAwningLength'),
    localStorage.getItem('frontAwningLength'),
    localStorage.getItem('backAwningLength'),
    localStorage.getItem('rightAwningLength'),
    sessionStorage.getItem('RightColCenter'),
    sessionStorage.getItem('leftColCenter') ,   
    localStorage.getItem('leftCantilever'),
    localStorage.getItem('rightCantilever'),
    localStorage.getItem('frontCantilever'),
    sessionStorage.getItem('col1'),
    sessionStorage.getItem('col2') ,   
    localStorage.getItem('backCantilever'), 
   
  ]);

  // const customWidth = {
  //   width: Math.ceil((bays * 9) / 1.5) + 'rem',
  //   // scale: bays > 2 ? '0.9' : '1' 
  // };  
  // console.log("custom width",customWidth);
  const customWidth = {
    width: Math.ceil((bays * 9) / 1.5) + 'rem',
    scale: bays > 2 ? '0.8' : '1' 
  };  
  const customLength = {
    height: bays > 11 ? '100%' : '100%',
    top: bays > 11 ? '2.5rem' : '2.1rem'
  };
  const calculateMainContainerWidth = (bays) => {
    const baseWidth = 15; // Base width for 1 bay in percentage or rem
    const widthIncrement = 10; // Width increment per additional bay
    const width = baseWidth + (bays - 1) * widthIncrement;
    return `${width}%`; // Adjust the unit as needed (e.g., 'rem', 'px')
  };
  // Conditionally set margin-left for the front awning
  let marginLeftValue;
  if (bays < 13) {
    marginLeftValue = `-${parseInt(customWidth.width) / 0.7}px`;
  } else if (bays === 13) {
    marginLeftValue = '-117px';
  } else if (bays === 14) {
    marginLeftValue = '-124px';
  } 
  else if (bays > 14) {
    marginLeftValue = '-137px';  
  } 
  const frontAwningStyle = {
    marginLeft: marginLeftValue
  };
 
  // Conditionally set margin-left for the front awning
  const backAwningStyle = {
    left: (() => {
      if(bays === 3) return '37.5%';
      if (bays === 4) return '34.8%';
      if (bays === 5) return '32.1%';
      if (bays === 6) return '29.5%';
      if (bays === 7) return '26.7%';
      if (bays === 8) return '24%';
      if (bays === 9) return '21.2%';
      if (bays === 10) return '18.4%' ;
      if (bays === 11 ) return '15.7%';
      if (bays === 12 ) return '12.9%';
      if (bays === 13 ) return '10.3%';
      if(bays === 14) return '7.7%'
      return '5.4%'; 
    })()
  };

  const calculateLeftPosition = (bays) => {
    if (bays> 14) return '3.8rem'
    if (bays === 14) return '5rem';
    if (bays === 12) return '10rem';
    if(bays === 13) return '7.6rem';
    const baseLeft = 32; // Starting left value for 3 bays
    const left = baseLeft - ((baseLeft - 2) / 12) * (bays - 3); // Adjust between 3 and 12 bays
    console.log(`Calculated left for ${bays} bays: ${left}rem`);
    return `${left}rem`;
  };
  
  const calculateRightPosition = (bays) => {
    if (bays > 14) return '4rem'; 
    if(bays === 13) return '8rem';
    if(bays === 14) return '5rem';
    if (bays === 12) return '10rem';
    const baseRight = 32; // Starting right value for 3 bays
    const right = baseRight - ((baseRight - 2) / 12) * (bays - 3); // Adjust between 3 and 11 bays
    console.log(`Calculated right for ${bays} bays: ${right}rem`);
    return `${right}rem`;
  };

  const calculateRightAwning = (bays) => {
    if (bays > 14) return '4rem'; 
    if(bays === 13) return '8rem';
    if(bays === 14) return '5rem';
    if (bays === 12) return '10rem';
    const baseRight = 32; // Starting right value for 3 bays
    const right = baseRight - ((baseRight - 2) / 12) * (bays - 3); // Adjust between 3 and 11 bays
    console.log(`Calculated right for ${bays} bays: ${right}rem`);
    return `${right}rem`;
  };

  const calculateLeftAwning = (bays) => {
    if (bays> 14) return '4rem'
    if (bays === 14) return '5rem';
    if (bays === 12) return '10rem';
    if(bays === 13) return '8rem';
    const baseLeft = 32; // Starting left value for 3 bays
    const left = baseLeft - ((baseLeft - 2) / 12) * (bays - 3); // Adjust between 3 and 12 bays
    console.log(`Calculated left for ${bays} bays: ${left}rem`);
    return `${left}rem`;
  };

  const calculateSizingWidth = (bays) => {
    const maxBays = 30; // Maximum number of bays
    const baseWidth = 25; 
    const minWidth = 0; 

    return Math.max(minWidth, baseWidth - (bays / maxBays) * baseWidth) + '%';
  };
  const calculateFontSize = (bays) => {
    const defaultFontSize = 11; // Default font size in px
    const maxBays = 30; // Maximum number of bays
    const minFontSize = 5; // Minimum font size in px
  
    // If there are more than 20 bays, decrease the font size
    if (bays > 15) {
      const fontSize = defaultFontSize - ((bays - 15) / (maxBays - 15)) * (defaultFontSize - minFontSize);
      return `${Math.max(minFontSize, fontSize)}px`;
    }
  
    return `${defaultFontSize}px`; // Use default font size for bays <= 20
  };
  return (
    <div className="floor-plan-big-container">
      <div className="floor-plan-medium-container" style={{ width: calculateMainContainerWidth(bays) }}>
        
      {(backAwning === 'true' || backCantilever) && (
  <div className="floor-plan-left-side-container">
    {/* Move the left-side awning container outside */}
    <div className="floor-plan-left-side-awaings-size-container">
      <div className="floor-plan-awaings-sizing-left-side"></div>
      <p className="floor-plan-awaings-sizing-text">{backAwningWidth}m</p>
      <div className="floor-plan-awaings-sizing-right-side"></div>
    </div>

    <div className="floor-plan-left-size-sizing-container">
      {/* Other sizing-related elements can go here */}
    </div>

    <div className="floor-plan-left-side-awaings-container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center' // Make sure the container has height
    }}>
      <span className="rotated-text-only">Back</span>
    </div>
  </div>
)}
  {/* Center Container */}
        <div className="floor-plan-center-container" style={{ width: calculateMainContainerWidth(bays) }}>
          
          <div className="floor-plan-center-all-sizing-container">
            {totalBays.map((bay, index) => (
              <div key={index} className="floor-plan-center-top-sizing">
                <div className="floor-plan-center-top-sizing-left-size" ></div>
                <div className="floor-plan-cener-top-sizing-text-container">
                  {/* <p className="floor-plan-center-top-sizing-text-index-number">{index + 1}</p>  */}
                  <div className="floor-plan-center-top-sizing-text" style={{ fontSize: calculateFontSize(totalBays.length) }}>
  {bay}m
</div>
                </div>
                <div className="floor-plan-center-top-sizing-right-size" ></div>
              </div>
            ))}
          </div>

          {(leftAwning === 'true' || leftCantilever) && (
            <div className="floor-plan-center-top-container">
              <div className="floor-plan-center-top-medium-container">
                <div className="floor-plan-center-top-left-awning-container">
                  <p className="floo-plan-center-top-left-awning-text">Left </p>
                </div>
              </div>
              <div className="floor-plan-center-left-sizing-container">
                <div className="floor-plan-center-top-verticle-sizing"></div>
                <p className="floor-plan-center-top-verticle-sizing-text">{leftAwningWidth}</p>
                <div className="floor-plan-center-bottom-verticle-sizing"></div>
              </div>
            </div>
          )}

          <div className="floor-plan-center-main-container">
          <div className="floor-plan-center-main-all-sizing-measurement-top-container">
              {/* Fixed front bay column */}
              <div className="floor-plan-center-main-each-measurement visible"><div className="floor-plan-center-main-each-measurement-text">I</div></div>
              {col2Visible ? (
                <div className="floor-plan-center-main-each-measurement">
                  <div className="floor-plan-center-main-each-measurement-text">I</div>
                </div>
              ) : (
                <div className="floor-plan-center-main-each-measurement empty-placeholder"></div> // Placeholder for col2
              )}

          
           {/* Toggleable colCenter1 columns */}
              {leftColVisibility.slice(1).map((isVisible, index) => (
                <div
                  key={`center1-${index + 1}`}
                 className="floor-plan-center-main-each-measurement"
                >
                <div  className={ `floor-plan-center-main-each-measurement-text ${!isVisible ? 'visible' : 'hidden'}` }>I</div>
                </div>
              ))}       
                
              {/* Fixed back bay columns */}
              <div className="floor-plan-center-main-each-measurement visible">
                <div className="floor-plan-center-main-each-measurement-text">I</div>
                </div>
            </div>
                        {/* Left Measurement */}
            <div className="floor-plan-left-side-size-container">
              <div className="floor-plan-left-side-size-top"></div>
              <p className="floor-plan-left-size-size-text"style={{fontSize:17}}>{width}m</p>
              <div className="floor-plan-left-side-size-bottom"></div>
            </div>

            {/* Main Content */}
            <div className="floor-plan-center-main-content">
              {/* Add any additional center content here */}
            </div>

            {/* Right Measurement */}
            <div className="floor-plan-right-side-size-container">
              <div className="floor-plan-right-side-size-top"></div>
              <p className="floor-plan-right-size-size-text" style={{fontSize:17}}>{width}m</p>
              <div className="floor-plan-right-side-size-bottom"></div>
            </div> <div className="floor-plan-center-main-all-sizing-measurement-bottom-container">
              {/* Fixed back bay column r */}
              <div className="floor-plan-center-main-each-measurement visible">
              <div className="floor-plan-center-main-each-measurement-text">I</div>
              </div>
              {col1Visible ? (
                <div className="floor-plan-center-main-each-measurement">
                  <div className="floor-plan-center-main-each-measurement-text">I</div>
                </div>
              ) : (
                <div className="floor-plan-center-main-each-measurement empty-placeholder"></div> // Placeholder for col2
              )}

              {/* Toggleable colCenter2 columns */}
              {rightColVisibility.slice(1).map((isVisible, index) => (
                <div
                  key={`center2-${index + 1}`}
                  className="floor-plan-center-main-each-measurement"
                >
                  <div className={ `floor-plan-center-main-each-measurement-text ${!isVisible ? 'visible' : 'hidden'}` }>I</div>
                </div>
              ))}

              {/* Fixed back bay columns */}
              
              <div className="floor-plan-center-main-each-measurement visible">
                <div className="floor-plan-center-main-each-measurement-text">I</div>
                </div>
            </div>
          </div>

          {(rightAwning === 'true' || rightCantilever) && (
            <div className="floor-plan-center-bottom-container">
              <div className="floor-plan-center-bottom-left-sizing-container">
                <div className="floor-plan-center-bottom-top-verticle-sizing"></div>
                <p className="floor-plan-center-bottom-top-verticle-sizing-text">{rightAwningWidth}</p>
                <div className="floor-plan-center-bottom-bottom-verticle-sizing"></div>
              </div>
              <div className="floor-plan-center-bottom-medium-container">
                <div className="floor-plan-center-top-right-awning-container">
                  <p className="floo-plan-center-top-right-awning-text">Right</p>
                </div>
              </div>
            </div>
          )}

          <div className="floor-plan-center-bottom-sizing">
            <div className="floor-plan-center-bottom-sizing-left-size"></div>
            <div className="floor-plan-center-bottom-sizing-text">{length}m</div>
            <div className="floor-plan-center-bottom-sizing-right-size"></div>
          </div>
        </div>

        {/* Front Awning */}
    {(frontAwning === 'true' || frontCantilever) && (
  <div className="floor-plan-right-side-container">
    {/* Move the right-side awning container outside */}
    <div className="floor-plan-right-side-awaings-size-container">
      <div className="floor-plan-awaings-sizing-left-side"></div>
      <p className="floor-plan-awaings-sizing-text">{frontAwningWidth}m</p>
      <div className="floor-plan-awaings-sizing-right-side"></div>
    </div>
    
    <div className="floor-plan-right-size-sizing-container">
      {/* Other sizing-related elements can go here */}
    </div>

    <div className="floor-plan-left-side-awaings-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <span className="rotated-text-only">Front</span>
    </div>
  </div>
)}

        {/* Back Awning */}
      
      </div>
    </div>
  );
}

export default FloorPlan;