import { useState } from "react";
import { connect } from "react-redux";
import "./SizeMenu.css";
import {PulseLoader} from 'react-spinners';
import { rafter } from "../Structure/structure";


var scene ;
export const sceneLoaderSize = (loadedScene) => {
    scene = loadedScene;
    return scene;
}

var loaded_meshes_global = [];
export const meshLoaderSize = ( loadedMeshes ) => {
  loaded_meshes_global = loadedMeshes; 
  return loaded_meshes_global;
}

//state management for hiding/showing custom pitch slider
//const [pitchClass, setPitchClass] = useState('pitch-hide');
const SizeMenu = (props) => {
  const {
    length,
    width,
    height,
    apexHeight,
    numberOfBays,
    customValue,
    baySize,
    dispatch,
  } = props;
  const [loading, setloading] = useState(false);
  const [knee_height_loader, set_knee_height_loader] = useState(false);
  const [bay_size_loader, set_bay_size_loader] = useState(false);
  const [num_bays_loader, set_num_bays_loader] = useState(false);
  const [local_length, set_local_length] = useState(parseFloat(length));
  const [local_width, set_local_width] = useState(parseFloat(width));
  const [local_height, set_local_height] = useState(parseFloat(height));
  const [local_bay_size, set_local_bay_size] = useState(parseFloat(baySize));
  const [pitch_loader, set_pitch_loader] = useState(false);

  const [roof, set_roof] = useState(localStorage.getItem("rafter"));

  const handleLength = (e) => {
    const comparisonValue = localStorage.getItem('length');
    //for case of value obtained from front-end
    if(e && e.target && e.target.value !== undefined){
      const inputValue = Math.round(parseInt(e.target.value));
      const newLength = isNaN(inputValue) ? ' ' : Math.min(Math.max(inputValue, 30), 200);
      dispatch({ type: 'UPDATE_SIZE', payload: { length: newLength } });
      localStorage.setItem('length', newLength);
      const baySize = parseInt(localStorage.getItem('bay_size'));
      const newNumberOfBays =  parseInt(newLength/baySize);
      dispatch({ type: 'UPDATE_SIZE', payload: { numberOfBays : newNumberOfBays } });
    }
    //for the case of value obtainer from Number of bays
    else if (e !== 'true') {
      //timeout before calculating newLength to wait for values
      setTimeout(() => {
        const newNumberOfBays = localStorage.getItem("bay_no");
        const newBaySize = parseFloat(localStorage.getItem("bay_size"));
        const newLength = newBaySize * newNumberOfBays;
        dispatch({ type: 'UPDATE_SIZE', payload: { length: newLength.toFixed(1) } });
      }, 1000); 
    } 
    // for the case of value obtained from add bay button
    else if (e === 'true'){
      var length = parseFloat(localStorage.getItem('length'));
      const baySize = parseFloar(localStorage.getItem('bay_size'));
      length += baySize;
      localStorage.setItem('length', length.toFixed(1));
      dispatch({ type: 'UPDATE_SIZE', payload: { length: length.toFixed(1) } });
      const newNumberOfBays =  length/baySize;
      dispatch({ type: 'UPDATE_SIZE', payload: { numberOfBays : newNumberOfBays } });
    }
  };

  var clickCounter = 0
  const handleAddBay = () => {
    clickCounter++;
    localStorage.setItem("click_counter", clickCounter);
    //call length handler to add bays
    handleLength('true')
  }
  // introduce polling to constantly check for reset flag.
  localStorage.setItem('reset','false');
  const checkLocalStorageReset = () => {
    const intervalId = setInterval(() => {
      const resetFlag = localStorage.getItem('reset');
      if (resetFlag === 'true') {
        dispatch({ type: 'UPDATE_SIZE', payload: { length: 30 } });
        dispatch({ type: 'UPDATE_SIZE', payload: { numberOfBays: 3 } });
        dispatch({ type: 'UPDATE_SIZE', payload: { baySize: 10 } });
        //Reset local values
        localStorage.setItem('length', 30)
        localStorage.setItem('bay_no',3);
        localStorage.setItem('bay_size', 10);
        localStorage.setItem('reset', 'false');
      }
    }, 1000); // Adjust the interval as needed (in milliseconds)
  
    // Return the interval ID in case you want to clear the interval later
    return intervalId;
  };
  // Call the function to start polling
  const intervalId = checkLocalStorageReset();

  const handleWidth = (e) => {
    try {
      const inputValue = parseFloat(e.target.value);
      const newWidth = isNaN(inputValue) ? ' ' : Math.min(Math.max(inputValue, 5.0), 60.0);
      dispatch({ type: 'UPDATE_SIZE', payload: { width: newWidth } });
      localStorage.setItem('width', newWidth);
      // Call handleApexHeight when width changes
      handleApexHeight();
    } catch (error) {
      console.error("Something went wrong while changing width", error);
    }
  };

  const handleHeight = (e) => {
    const inputValue = parseFloat(e.target.value);
    const newHeight = isNaN(inputValue) ? ' ' : Math.min(Math.max(inputValue, 5.0), 10.0);
    if(newHeight == ' '){
      //do nothing
    }
    else{
      dispatch({ type: 'UPDATE_SIZE', payload: { height: newHeight } });
      localStorage.setItem('height', newHeight);
      // Call handleApexHeight when height changes
      handleApexHeight();
      loaded_meshes_global[1].forEach((element) => {
          if (element.name === 'textPlane') {
          }
      })
        
      
    }
  };

  const handleApexHeight = () => {
    setTimeout(() => {
      const newApex = localStorage.getItem('apex');
      if (newApex !== apexHeight) {
        dispatch({ type: 'UPDATE_SIZE', payload: { apexHeight: newApex } });
      }
    }, 1500); 
  };

  const handleLengthChange = () => {
    setTimeout(() => {
      const newLength = localStorage.getItem('Length');
      if (newLength !== length) {
        dispatch({ type: 'UPDATE_SIZE', payload: { length: newLength } });
      }
    }, 1500); 
  };

  const handleBayNumber = (e) => {
    setTimeout(() => {
      set_num_bays_loader(true);
    }, 1000)
    const currentValue = parseInt(e.target.value);
    dispatch({ type: 'UPDATE_SIZE', payload: { numberOfBays: currentValue } });
    localStorage.setItem('bay_no', currentValue);
    handleLength(currentValue);
    setTimeout(() => {
      set_num_bays_loader(false);
    }, 2000);
  };


  const handleBaySize = (e) => {
    const step = 1; 
    var currentValue;
    if(e.target.value){
      currentValue = parseFloat(e.target.value);
    }
    else{
      currentValue = parseFloat(baySize);
    }
    dispatch({ type: 'UPDATE_SIZE', payload: { baySize: currentValue } });
    dispatch({ type: 'UPDATE_SIZE', payload: { length: (numberOfBays * currentValue).toFixed(1)} });
    //dispatch({ type: 'UPDATE_SIZE', payload: { numberOfBays: 3 } });
    localStorage.setItem('bay_size', currentValue);
  };
  
  const [pitchClass, setPitchClass] = useState('pitch-hide'); 

  const handleCustomValue = (e) => {
    setTimeout(() => {
      set_pitch_loader(true);
    }, 1000)
    
      setPitchClass('pitch-show');
      const inputValue = Math.round(parseInt(e.target.value));
      const newPitch = isNaN(inputValue) ? '1' : Math.min(Math.max(inputValue, 1), 45);
      dispatch({ type: 'UPDATE_SIZE', payload: { customValue: newPitch } });
      localStorage.setItem('pitch', newPitch);
      //handle apex height when pitch changes
      handleApexHeight();
      setTimeout(() => {
        set_pitch_loader(false);
      }, 2000);
  };

  const handleRangeChange = (event, field) => {
    if (field === 'length') {
      set_local_length(parseInt(event.target.value));
      handleLength(event);
    }else if (field === 'width') {
      setTimeout(() =>{
        setloading(true);
      }, 1000)
      set_local_width(parseFloat(event.target.value));
      handleWidth(event);
      setTimeout(() => {
        setloading(false);
      }, 2500);
    }else if (field === 'height') {
      setTimeout(() => {
        set_knee_height_loader(true);
      }, 1000)
      set_local_height(parseFloat(event.target.value));
      handleHeight(event)
      setTimeout(() => {
        set_knee_height_loader(false);
      }, 2500);
    }else if(field === 'baySize'){
      setTimeout(() => {
        set_bay_size_loader(true);
      }, 1000)
      set_local_bay_size(parseFloat(event.target.value));
      handleBaySize(event);
      setTimeout(() => {
        set_bay_size_loader(false);
      }, 2500);
    }
  };

  const handleTextChange = (event, field) => {
    let value = event.target.value.trim();
    if (field === 'length') {
      if (value === '') {
        set_local_length('');
        handleLength(undefined);
      } else {
        value = parseFloat(value);
        if (!isNaN(value)) {
          set_local_length(value); // Set value directly without clamping
          handleLength(event);
        }
      }
    } else if (field === 'width') {
      setTimeout(() => {
        setloading(true);
      }, 1500)
      set_local_width(value); // Update local state with input value directly
      handleWidth(event); // Call appropriate handler
      setTimeout(() => {
        setloading(false);
      }, 2500);
    } else if (field === 'height') {
      if (value === '') {
        setTimeout(() => {
          set_knee_height_loader(true);
        }, 1500)
        set_local_height('');
        handleHeight(undefined);
        setTimeout(() => {
          set_knee_height_loader(false);
        }, 2500);
      } else {
        // value = parseFloat(value);
        // if (!isNaN(value)) {
          setTimeout(() => {
            set_knee_height_loader(true);
          },1500)
          set_local_height(value); // Set value directly without clamping
          handleHeight(event);
          setTimeout(() => {
            set_knee_height_loader(false);
          }, 2500);
        // }
      }
    }else if(field === 'baySize'){
      if (value === '') {
        setTimeout(() => {
          set_bay_size_loader(true);
        },1500)
        set_local_bay_size('');
        handleBaySize(undefined);
        setTimeout(() => {
          set_bay_size_loader(false);
        }, 2500);
      } else {
        setTimeout(() => {
          set_bay_size_loader(true);
        },1500)
        set_local_bay_size(value); // Set value directly without clamping
        handleBaySize(event);
        setTimeout(() => {
          set_bay_size_loader(false);
        }, 2500);
      }
    }
  };
  

  const handleBlur = () => {
    // Ensure the length value is within the range when input field loses focus
    if (local_length === '') {
      set_local_length(30); // Set to minimum if the input is empty
      handleLength(30);
    } else {
      set_local_length(Math.min(200, Math.max(30, local_length))); // Clamp value to the range of 30 to 200
      handleLength(undefined)
    }
  };
  const handleWidthBlur = () => {
    if (local_width === '') {
      set_local_width(5); // Set to minimum if the input is empty
      handleWidth(5);
    } else {
      set_local_width(Math.min(60, Math.max(5, local_width))); // Clamp value to the range of 10 to 60
      handleWidth(undefined)
    }
  }

  const handleHeightBlur = () => {
    if (local_height === '') {
      set_local_height(5); // Set to minimum if the input is empty
      handleHeight(5);
    } else {
      set_local_height(Math.min(10, Math.max(5, local_height))); // Clamp value to the range of 5 to 10
      handleHeight(undefined)
    }
  }

  const handle_num_pitch = (e) => {
    if (e.target.value == 7.5 || e.target.value == 9.5 || e.target.value == 15) {
      const newPitch = parseInt(e.target.value);
      dispatch({ type: 'UPDATE_SIZE', payload: { customValue: newPitch } });
      localStorage.setItem('pitch', newPitch);
      //handle apex height when pitch changes
      handleApexHeight();
      //handle hiding pitch menu
      setPitchClass('pitch-hide');
    } else if (e.target.value === 'custom') {
      handleCustomValue(e)
    }  
  }


  const handle_rafter_type = (e) =>{
    console.log(e.target.value);
    localStorage.setItem('rafter', e.target.value);
  }

  return (
    <>
      <div className={`menu-container ${props.itemClass}`}>
         <div className="field-box">
           <span>Roof Type</span>
           <select>
             <option value="gable" selected >Gable</option>
           </select>
         </div>

        
         <div className="field-box">
           <span>Rafter Type</span>
           <select onChange={handle_rafter_type}>
           <option value={'truss'} selected >Truss</option>
             <option value={'rafter'} selected >Universal beam</option> 
           </select>
         </div>



         <div className="field-box">
           <span>Roof Pitch</span>
           <select onChange={handle_num_pitch}>
            <option value={7.5}>7.5</option>
            <option value={9.5}>9.5</option>
            <option value={15}>15</option>
            <option value={'custom'}>Custom</option>
          </select>
         </div>

         <div className={`field-box ${pitchClass}`}>
            <span>Custom Roof Pitch</span>
           {pitch_loader ? 
           <div style={{display: 'flex', placeContent: 'center', marginTop: '10px'}}>
           <PulseLoader color="black" size={10} loading={pitch_loader} />
          </div>
           :
           <div className="range-box">
              <input
                type="range"
                value={customValue}
                min={1}
                max={45}
                onChange={handleCustomValue}
                />
              <input
                className="sizeInput"
                type="text"
                value={customValue}
                onChange={handleCustomValue}
                />
          </div>}
         </div>
         {/* disabled length slider, don't delete, might need it later */}
         {/* <div className="field-box">
        <span>Length (m)</span>
        <div className="range-box">
          <input
            type="range"
            min={30}
            max={200}
            value={ local_length === '' ? 30 : local_length} 
            onChange={(e) => handleRangeChange(e, 'length')}
          />
          <input
            className="sizeInput"
            type="text"
            value={local_length}
            onChange={(e) => handleTextChange(e, 'length')}
              onBlur={handleBlur}
              min={30}
              max={200}
          />
        </div>
      </div> */}
      <div className="field-box">
          <span>Width/Depth (m)</span>
        {loading ? 
        <div style={{display: 'flex', placeContent: 'center', marginTop: '10px'}}>
          <PulseLoader color="black" size={10} loading={loading} />
         </div>
        :
        
          <div className="range-box">
              <input
              type="range"
              min={5}
              max={60}
              step={0.1}
              value={local_width === '' ? 5 : local_width}
              onChange={(e) => handleRangeChange(e, 'width')}
            />
            <input
              className="sizeInput"
              type="text"
              value={local_width}
            onChange={(e) => handleTextChange(e, 'width')}
            onBlur={handleWidthBlur}
            min={5}
            max={60}
            />
          </div>
        }</div>
         <div className="field-box">
           <span>Knee Height (m)</span>
           {knee_height_loader ? 
           <div style={{display: 'flex', placeContent: 'center', marginTop: '10px'}}>
           <PulseLoader color="black" size={10} loading={knee_height_loader} />
          </div>
           : 
           <div className="range-box">
              <input
                type="range"
                value={local_height}
                min={5}
                max={10}
                step = {0.1}
                onChange={(e) => handleRangeChange(e, 'height')}
              />
              <input
                className="sizeInput"
                type="text"
                value={local_height}
              onChange={(e) => handleTextChange(e, 'height')}
              onBlur={handleHeightBlur}
              />
           </div>}
         </div>
         <div className="field-box">
           <span>Apex Height (m)</span>
              <input
                className="sizeInput"
                type="text"
                value={apexHeight}
                onChange={handleApexHeight}
              />
         </div>


         <div className="field-box">
           <span>Bay Size (m)</span>
           {bay_size_loader ? 
           <div style={{display: 'flex', placeContent: 'center', marginTop: '10px'}}>
           <PulseLoader color="black" size={10} loading={bay_size_loader} />
          </div>
          :
           <div className="range-box">
              <input
                type="range"
                value={local_bay_size}
                min={3}
                max={10}
                step={0.1}
                onChange={(e) => handleRangeChange(e, 'baySize')}
              />
              <input
                className="sizeInput"
                type="text"
                value={local_bay_size}
                onChange={(e) => handleTextChange(e, 'baySize' )}
              />
           </div>}
         </div>
         <div className="field-box">
          <span>Number of Bays</span>
            {num_bays_loader ?
            <div style={{display: 'flex', placeContent: 'center', marginTop: '10px'}}>
            <PulseLoader color="black" size={10} loading={num_bays_loader} />
           </div>
           :
              <div className="range-box">
              <input
                type="range"
                value={numberOfBays}
                min={3}
                max={30}
                //max={Math.floor(length/ baySize)}  // Adjust the max value based on length and bay 
                step={1}
                onChange={(e) => handleBayNumber(e)}
              />
              <input
                className="sizeInput"
                type="text"
                value={numberOfBays}
                onChange={(e) => handleBayNumber(e)}
              />
            </div>}
          </div>
          <div className="field-box">
           <span>Length (m)</span>
              <input
                className="sizeInput"
                type="text"
                value={length}
                //onChange={handleLengthChange}
              />
         </div>
        </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  length: state.length,
  width: state.width,
  height: state.height,
  apexHeight: state.apexHeight,
  numberOfBays: state.numberOfBays,
  baySize: state.baySize,
  customValue: state.customValue,
});

export default connect(mapStateToProps)(SizeMenu);
