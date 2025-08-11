import React, { useState, useEffect } from 'react';
import './MezzanineMenu.css';
import { floor } from 'lodash';

var loaded_meshes_global = [];
var sceneRef;
export const loaded_meshes_for_mezzanine = (loadedMeshes, scene) => {
  loaded_meshes_global = loadedMeshes;
  sceneRef = scene;
  return loaded_meshes_global;
};

const MezzanineMenu = (props) => {
  const [numberOfBays, setNumberOfBays] = useState(0);
  const [bayStates, setBayStates] = useState({});
  const [floorHeight, setFloorHeight] = useState(2);

  useEffect(() => {
    const savedBayStates = sessionStorage.getItem('bayStates');
    const savedFloorHeight = sessionStorage.getItem('floorHeight');
    
    if (savedFloorHeight) {
      setFloorHeight(parseFloat(savedFloorHeight));
    } else {
      setFloorHeight(2); // Default value
    }
    const calculateNumberOfBays = () => {
      const length = localStorage.getItem('length');
      const bay_size = localStorage.getItem('bay_size');
      if (length && bay_size) {
        const totalBays = Math.floor(length / bay_size);
        setNumberOfBays(totalBays);
        
        let initialBayStates = {};
        if (savedBayStates) {
          initialBayStates = JSON.parse(savedBayStates);
    
          // Truncate states for non-existent bays
          initialBayStates = Object.keys(initialBayStates)
            .filter(key => parseInt(key) < totalBays) // Updated condition for truncation
            .reduce((obj, key) => {
              obj[key] = initialBayStates[key];
              return obj;
            }, {});
        }
    
        // Initialize states for new bays and update visibility based on specific mesh
        for (let i = 0; i < totalBays; i++) { // Start from 0 to include index 0
          if (!initialBayStates[i]) {
            initialBayStates[i] = { visible: false, selectedButton: 'Left' };
          }
        }
    
        // Update visibility of bay states based on specific mesh
        loaded_meshes_global.forEach((meshes, index) => {
          if (index < totalBays) {
            // Check enabled state of the specific mesh
            const specificMesh = meshes.find(mesh => mesh.name === "container_left_mezzanine");
            const isEnabled = specificMesh ? specificMesh.isEnabled() : false; // Use isEnabled() method
            initialBayStates[index].visible = isEnabled; // Update visible property based on isEnabled
          }
        });
    
        setBayStates(initialBayStates);
    
        // Save updated states to sessionStorage immediately
        sessionStorage.setItem('bayStates', JSON.stringify(initialBayStates));
      }
    };

    calculateNumberOfBays();

    window.addEventListener('storage', calculateNumberOfBays);

    return () => {
      window.removeEventListener('storage', calculateNumberOfBays);
    };
  }, []);
     


  useEffect(() => {
    sessionStorage.setItem('bayStates', JSON.stringify(bayStates));
  }, [bayStates]);

  useEffect(() => {
    sessionStorage.setItem('floorHeight', floorHeight);
  }, [floorHeight]);

  useEffect(() => {
    const handlePageUnload = () => {
      sessionStorage.clear();
    };

    window.addEventListener('beforeunload', handlePageUnload);

    return () => {
      window.removeEventListener('beforeunload', handlePageUnload);
    };
  }, []);

  const handleCheckboxChange = (bay, status) => {
    setBayStates(prevState => {
      const newVisibility = !prevState[bay]?.visible;
      const updatedState = {
        ...prevState,
        [bay]: {
          ...prevState[bay],
          visible: newVisibility
        }
      };

      // Log visibility changes
      if (bay === 0) {
        console.log(`Back Bay is now ${newVisibility ? 'visible' : 'not visible'}`);
      } else if (bay === 1) {
        console.log(`Front Bay is now ${newVisibility ? 'visible' : 'not visible'}`);
      } else {
        console.log(`Center Bay ${bay - 1} is now ${newVisibility ? 'visible' : 'not visible'}`);
      }

      return updatedState;
    });

    // Existing logic for handling meshes
    if (status === false) {
      loaded_meshes_global[bay].forEach((mesh) => {
        if (mesh.name === "container_left_mezzanine") {
          mesh.setEnabled(true);
        }
      });
    } else {
      loaded_meshes_global[bay].forEach((mesh) => {
        if (mesh.name === "container_left_mezzanine" || mesh.name === "container_right_mezzanine") {
          mesh.setEnabled(false);
        }
      });
    }
  };

  const handleButtonClick = (bay, button) => {
    setBayStates(prevState => ({
      ...prevState,
      [bay]: {
        ...prevState[bay],
        selectedButton: button
      }
    }));
    console.log("bay at mezz: ", bay)
    if(button === "Right"){
      loaded_meshes_global[bay].forEach((mesh) => {
        if(mesh.name === "container_left_mezzanine"){
          mesh.setEnabled(false);
        } else if(mesh.name === "container_right_mezzanine"){
          mesh.setEnabled(true);
        }
      });
    } else if(button === "Left"){
      loaded_meshes_global[bay].forEach((mesh) => {
        if(mesh.name === "container_left_mezzanine"){
          mesh.setEnabled(true);
        } else if(mesh.name === "container_right_mezzanine"){
          mesh.setEnabled(false);
        }
      });
    } else if(button === "Full"){
      loaded_meshes_global[bay].forEach((mesh) => {
        if(mesh.name === "container_left_mezzanine"){
          mesh.setEnabled(true);
        } else if(mesh.name === "container_right_mezzanine"){
          mesh.setEnabled(true);
        }
      });
    }
    // your existing logic for handling meshes
  };

  const handleHeightChange = (value) => {
    setFloorHeight(value);
    if(value >= 2.1 && value < 2.2){
      console.log("in 2.1")
      localStorage.setItem("mezzanine_height","-0.95");
      loaded_meshes_global.forEach((meshes) => {
        meshes.forEach((mesh) => {
          if(mesh.name === "container_left_mezzanine"){
            mesh.position.y = -0.95
          }else if(mesh.name === "container_right_mezzanine"){
            mesh.position.y = -0.95
          }
        })
      })
    }else if(value >= 2.2 && value < 2.3){
      console.log("in 2.2")
      localStorage.setItem("mezzanine_height","-0.9");
      loaded_meshes_global.forEach((meshes) => {
        meshes.forEach((mesh) => {
          if(mesh.name === "container_left_mezzanine"){
            mesh.position.y = -0.9
          }else if(mesh.name === "container_right_mezzanine"){
            mesh.position.y = -0.9
          }
        })
      })
    }else if(value >= 2.3 && value < 2.4){
      console.log("in 2.3")
      localStorage.setItem("mezzanine_height","-0.85");
      loaded_meshes_global.forEach((meshes) => {
        meshes.forEach((mesh) => {
          if(mesh.name === "container_left_mezzanine"){
            mesh.position.y = -0.85
          }else if(mesh.name === "container_right_mezzanine"){
            mesh.position.y = -0.85
          }
        })
      })
    }else if(value >= 2.4 && value < 2.5){
      console.log("in 2.4")
      localStorage.setItem("mezzanine_height","-0.8");
      loaded_meshes_global.forEach((meshes) => {
        meshes.forEach((mesh) => {
          if(mesh.name === "container_left_mezzanine"){
            mesh.position.y = -0.8
          }else if(mesh.name === "container_right_mezzanine"){
            mesh.position.y = -0.8
          }
        })
      })
    }else if(value >= 2.5 && value < 2.6){
      console.log("in 2.5")
      localStorage.setItem("mezzanine_height","-0.75");
      loaded_meshes_global.forEach((meshes) => {
        meshes.forEach((mesh) => {
          if(mesh.name === "container_left_mezzanine"){
            mesh.position.y = -0.75
          }else if(mesh.name === "container_right_mezzanine"){
            mesh.position.y = -0.75
          }
        })
      })
    }else if(value >= 2.6 && value < 2.7){
      console.log("in 2.6");
      localStorage.setItem("mezzanine_height","-0.7");
      loaded_meshes_global.forEach((meshes) => {
        meshes.forEach((mesh) => {
          if(mesh.name === "container_left_mezzanine"){
            mesh.position.y = -0.7
          }else if(mesh.name === "container_right_mezzanine"){
            mesh.position.y = -0.7
          }
        })
      })
    }else if(value >= 2.7 && value < 2.8){
      console.log("in 2.7")
      localStorage.setItem("mezzanine_height","-0.65");
      loaded_meshes_global.forEach((meshes) => {
        meshes.forEach((mesh) => {
          if(mesh.name === "container_left_mezzanine"){
            mesh.position.y = -0.65
          }else if(mesh.name === "container_right_mezzanine"){
            mesh.position.y = -0.65
          }
        })
      })
    }else if(value >= 2.8 && value < 2.9){
      console.log("in 2.8")
      localStorage.setItem("mezzanine_height","-0.6");
      loaded_meshes_global.forEach((meshes) => {
        meshes.forEach((mesh) => {
          if(mesh.name === "container_left_mezzanine"){
            mesh.position.y = -0.6
          }else if(mesh.name === "container_right_mezzanine"){
            mesh.position.y = -0.6
          }
        })
      })
    }else if(value >= 2.9 && value <= 3.0){
      localStorage.setItem("mezzanine_height","-0.55");
      loaded_meshes_global.forEach((meshes) => {
        meshes.forEach((mesh) => {
          if(mesh.name === "container_left_mezzanine"){
            mesh.position.y = -0.55
          }else if(mesh.name === "container_right_mezzanine"){
            mesh.position.y = -0.55
          }
        })
      })
    }
    // if(floorHeight > prevFloorHeight){
    //   loaded_meshes_global.forEach((meshes) => {
    //     meshes.forEach((mesh) => {
    //       if(mesh.name === "container_left_mezzanine"){
    //         mesh.position.y = -(1 - value/10)
    //       }else if(mesh.name === "container_right_mezzanine"){
    //         mesh.position.y = -(1 - value/10)
    //       }
    //     })
    //   })
    //   setPrevFloorHeight(floorHeight);
    // }else if(floorHeight < prevFloorHeight){
    //   loaded_meshes_global.forEach((meshes) => {
    //     meshes.forEach((mesh) => {
    //       if(mesh.name === "container_left_mezzanine"){
    //         mesh.position.y = -(1 + value/10)
    //       }else if(mesh.name === "container_right_mezzanine"){
    //         mesh.position.y = -(1 + value/10)
    //       }
    //     })
    //   })
    //   setPrevFloorHeight(floorHeight);
    // }
    
  }


  const renderBays = () => {
    let bays = [];
  
    // Handle index 0
    const isVisible0 = bayStates[0]?.visible || false;
    const selectedButton0 = bayStates[0]?.selectedButton || 'Left';
    bays.push(
      <div key={0} className="bay-item">
        <div className="checkbox-container">
          <span>Back Bay</span>
          <input
            type="checkbox"
            checked={isVisible0}
            onChange={() => handleCheckboxChange(0, isVisible0)}
          />
          <label>Visible</label>
        </div>
        {isVisible0 && (
          <div className="button-container">
            {['Left', 'Full', 'Right'].map(button => (
              <button
                key={button}
                className={selectedButton0 === button ? 'selected' : ''}
                onClick={() => handleButtonClick(0, button)}
              >
                {button}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  
    // Handle dynamically generated bays (index 2 to numberOfBays)
    for (let i = 2; i < numberOfBays; i++) {
      const isVisible = bayStates[i]?.visible || false;
      const selectedButton = bayStates[i]?.selectedButton || 'Left';
      
      bays.push(
        <div key={i} className="bay-item">
          <div className="checkbox-container">
            <span>center bay {i - 1}</span>
            <input
              type="checkbox"
              checked={isVisible}
              onChange={() => handleCheckboxChange(i, isVisible)}
            />
            <label>Visible</label>
          </div>
          {isVisible && (
            <div className="button-container">
              {['Left', 'Full', 'Right'].map(button => (
                <button
                  key={button}
                  className={selectedButton === button ? 'selected' : ''}
                  onClick={() => handleButtonClick(i, button)}
                >
                  {button}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }
  
    // Handle index 1 separately at the end
    const isVisible1 = bayStates[1]?.visible || false;
    const selectedButton1 = bayStates[1]?.selectedButton || 'Left';
    bays.push(
      <div key={1} className="bay-item">
        <div className="checkbox-container">
          <span>Front Bay</span>
          <input
            type="checkbox"
            checked={isVisible1}
            onChange={() => handleCheckboxChange(1, isVisible1)}
          />
          <label>Visible</label>
        </div>
        {isVisible1 && (
          <div className="button-container">
            {['Left', 'Full', 'Right'].map(button => (
              <button
                key={button}
                className={selectedButton1 === button ? 'selected' : ''}
                onClick={() => handleButtonClick(1, button)}
              >
                {button}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  
    return bays;
  };
  

  return (
    <div className={`mezzanine-container ${props.itemClass}`}>
      <div className='field-box'>
        {/* Slider for Floor Height */}
        <div className='slider-container'>
          <span>Floor Height (m)</span>
          <div className='slider-box'>
            <input
              type="range"
              min="2"
              max="3"
              step="0.1"
              value={floorHeight}
              onChange={(e) => handleHeightChange(e.target.value)}
            />
            <span>{floorHeight} m</span> {/* Display the current value */}
          </div>
        </div>
        {/* Render the bays */}
        {renderBays()}
      </div>
    </div>
  );
};

export default MezzanineMenu;
