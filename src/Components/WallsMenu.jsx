import React, { useEffect, useState } from "react";
import "./WallsMenu.css";
import * as flatted from "flatted";
import { MeshExploder } from "@babylonjs/core";
// import { trusses } from './../Structure/gable';
// import { createCenterBay } from './../Structure/gable';
var loaded_meshes_global = [];
export const meshLoader = (loadedMeshes) => {
  loaded_meshes_global = loadedMeshes;
  return loaded_meshes_global;
}


const WallsMenu = ({ itemClass, container_columns, centercontainer_columns, scene }) => {
  const [meshinfo, setmeshinfo] = useState([]);
  const [Bays, setBays] = useState(0);
  const [isLeftWallVisible, setIsLeftWallVisible] = useState(false);
  const [isRightWallVisible, setIsRightWallVisible] = useState(false);
  const [isLeftAwningVisible, setIsLeftAwningVisible] = useState(false);
  const [isRightAwningVisible, setIsRightAwningVisible] = useState(false);

  const [leftawnings, set_left_awnings] = useState(false);
  const [rightawnings, set_right_awnings] = useState(false);

  const [isRightWallChecked, set_right_checked] = useState(false);
  const [isLeftWallChecked, set_left_checked] = useState(false);
  const [isRightAwningWallChecked, set_right_awning_checked] = useState(false);
  const [isLeftAwningWallChecked, set_left_awning_checked] = useState(false);
  // const [col1State, setCol1State] = useState(false);
  // const [col2State, setCol2State] = useState(false);
  const [col3State, setCol3State] = useState(false);
  const [col4State, setCol4State] = useState(false);

  const [col11State, setCol11State] = useState(false);
  const [col12State, setCol12State] = useState(false);
  const [col13State, setCol13State] = useState(false);
  const [col14State, setCol14State] = useState(false);

  const [columnsState, setColumnsState] = useState('');
  const [sideState, setSideState] = useState('');


  const [columnsAwningState, setColumnsAwningState] = useState('');
  const [sideAwningState, setSideAwningState] = useState('');


  const [colCenter1EnabledStates, setColCenter1EnabledStates] = useState(() => {
    // Load the state from sessionStorage, or use an empty object if it doesn't exist
    const savedState = sessionStorage.getItem('colCenter1EnabledStates');
    return savedState ? JSON.parse(savedState) : {};
  });

  const [colCenter2EnabledStates, setColCenter2EnabledStates] = useState(() => {
    const savedState = sessionStorage.getItem('colCenter2EnabledStates');
    return savedState ? JSON.parse(savedState) : {};
  });

  const [col1State, setCol1State] = useState(() => {
    const savedState = sessionStorage.getItem('col1');
    return savedState ? JSON.parse(savedState) : true // Default to an empty object
  });
  const [col2State, setCol2State] = useState(() => {
    const savedState = sessionStorage.getItem('col2');
    return savedState ? JSON.parse(savedState) : true // Default to an empty object
  });

  
  
  //For Awnings
  const [colCenter1AwningEnabledStates, setColCenter1AwningEnabledStates] = useState(() => {
    const savedState = sessionStorage.getItem('colCenter1AwningEnabledStates');
    return savedState ? JSON.parse(savedState) : {};
  });


  const [colCenter2AwningEnabledStates, setColCenter2AwningEnabledStates] = useState(() => {
    const savedState = sessionStorage.getItem('colCenter2AwningEnabledStates');
    return savedState ? JSON.parse(savedState) : {};
  });
 


  
    // Save state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('colCenter1EnabledStates', JSON.stringify(colCenter1EnabledStates));
    sessionStorage.setItem('RightColCenter', JSON.stringify(colCenter1EnabledStates))
    // if(!colCenter1EnabledStates["2"] && sessionStorage.getItem('col1') == 'false'){
    //   sessionStorage.setItem('col1', JSON.stringify(true));
    // }
  }, [colCenter1EnabledStates]);
  useEffect(() => {
    sessionStorage.setItem('col1', JSON.stringify(col1State));
    console.log('col1State set to:', col1State);
  }, [col1State]);

  useEffect(() => {
    sessionStorage.setItem('col2', JSON.stringify(col2State));
    console.log('col2State set to:', col2State);
  }, [col2State]);

  useEffect(() => {
    sessionStorage.setItem('colCenter2EnabledStates', JSON.stringify(colCenter2EnabledStates));
    sessionStorage.setItem('leftColCenter', JSON.stringify(colCenter2EnabledStates))
    // if(!colCenter2EnabledStates["2"] && sessionStorage.getItem('col2') == 'false'){
    //   sessionStorage.setItem('col2', JSON.stringify(true));
    // }
  }, [colCenter2EnabledStates]);


 //For Awnings
  useEffect(() => {
    sessionStorage.setItem('colCenter1AwningEnabledStates', JSON.stringify(colCenter1AwningEnabledStates));
  }, [colCenter1AwningEnabledStates]);

  useEffect(() => {
    sessionStorage.setItem('colCenter2AwningEnabledStates', JSON.stringify(colCenter2AwningEnabledStates));
  }, [colCenter2AwningEnabledStates]);


  
  useEffect(() => {
    if (columnsState !== null) {
      console.log("state of columns changed: ", columnsState, " and side state: ", sideState);
  
      loaded_meshes_global[2].forEach((element) => {
        if (sideState === 'Right') {
          if (element.name === 'colCenter1') {
            element.isVisible = true;
            setColCenter1EnabledStates((prevState) => ({ ...prevState, 2: false }));
          }
        } else if (sideState === 'Left') {
          if (element.name === 'colCenter2') {
            element.isVisible = true;
            setColCenter2EnabledStates((prevState) => ({ ...prevState, 2: false }));
          }
        }
      });
      
      if (loaded_meshes_global.length <= 3) {
        loaded_meshes_global[1].forEach((element) => {
          if (sideState === 'Right') {
            if (element.name === 'frtruss') {
              element.isVisible = false;
            }
          } else if (sideState === 'Left') {
            if (element.name === 'fltruss') {
              element.isVisible = false;
            }
          }
        });
      } else {
        var check_for_disabling_previous_index = true
        loaded_meshes_global[3].forEach((element) => {
          if (sideState === 'Right') {
            if(element.name === 'colCenter1'){
              if(element.isVisible == false){
                check_for_disabling_previous_index = false
              }
            }
            if (element.name === 'rtruss') {
              if(check_for_disabling_previous_index == true){
                element.isVisible = false;
                setColCenter1EnabledStates((prevState) => ({ ...prevState, 3: false }));
              }
            }
          } else if (sideState === 'Left') {
            if(element.name === 'colCenter2'){
              console.log("this being executed")
              if(element.isVisible == false){
                console.log("executed,,,,,,,")
                check_for_disabling_previous_index = false
              }
            }
            if (element.name === 'ltruss') {
              if(check_for_disabling_previous_index == true){
                console.log("falsified,,,,,,,")
                element.isVisible = false;
                setColCenter2EnabledStates((prevState) => ({ ...prevState, 3: false }));
              }
            }
          }
        });
      }
  
      setColumnsState(null);
    }
  }, [columnsState]);




  //for Awnings
  useEffect(() => {
    if (columnsAwningState !== null) {
      console.log("state of awnings columns changed: ", columnsAwningState, " and side state: ", sideAwningState);
  
      loaded_meshes_global[2].forEach((element) => {
        if (sideAwningState === 'Right') {
          if (element.name === 'leantorightcols') {
            element.isVisible = true;
            setColCenter1AwningEnabledStates((prevState) => ({ ...prevState, 2: false }));
          }
        } else if (sideAwningState === 'Left') {
          if (element.name === 'leantoleftcols') {
            element.isVisible = true;
            setColCenter2AwningEnabledStates((prevState) => ({ ...prevState, 2: false }));
          }
        }
      });
      
      if (loaded_meshes_global.length <= 3) {
        loaded_meshes_global[1].forEach((element) => {
          if (sideAwningState === 'Right') {
            if (element.name === 'afrtruss') {
              element.isVisible = false;
            }
          } else if (sideAwningState === 'Left') {
            if (element.name === 'afltruss') {
              element.isVisible = false;
            }
          }
        });
      } else {
        var check_for_disabling_previous_index = true
        loaded_meshes_global[3].forEach((element) => {
          if (sideAwningState === 'Right') {
            if(element.name === 'leantorightcols'){
              if(element.isVisible == false){
                check_for_disabling_previous_index = false
              } 
            }
            if (element.name === 'ratruss') {
              if(check_for_disabling_previous_index == true){
                element.isVisible = false;
                setColCenter1AwningEnabledStates((prevState) => ({ ...prevState, 3: false }));
              }
            }
          } else if (sideAwningState === 'Left') {
            if(element.name === 'leantoleftcols'){
              console.log("this being executed")
              if(element.isVisible == false){
                console.log("executed,,,,,,,")
                check_for_disabling_previous_index = false
              }
            }
            if (element.name === 'altruss') {
              if(check_for_disabling_previous_index == true){
                console.log("falsified,,,,,,,")
                element.isVisible = false;
                setColCenter2AwningEnabledStates((prevState) => ({ ...prevState, 3: false }));
              }
            }
          }
        });
      }
  
      setColumnsAwningState(null);
    }
  }, [columnsAwningState]);



  
  

  useEffect(() => {
    setBays(Math.ceil(parseFloat(localStorage.getItem("length")) / parseFloat(localStorage.getItem("bay_size"))));
    setmeshinfo(localStorage.getItem("centerbay"));
    set_left_checked(localStorage.getItem("LeftWallsVisible") === "true");
    set_right_checked(localStorage.getItem("RightWallsVisible") === "true");
    set_left_awning_checked(localStorage.getItem("LeftAwningWallsVisible") === "true");
    set_right_awning_checked(localStorage.getItem("RightAwningWallsVisible") === "true");

    set_left_awnings(localStorage.getItem("leftAwning") === 'true' ? true : false);
    set_right_awnings(localStorage.getItem("rightAwning") === 'true' ? true : false);
  }, [leftawnings, rightawnings, Bays, meshinfo]);

  const [frontcolumnsState, setfrontColumnsState] = useState([
    { name: 'colfront1', isVisible: true },
    { name: 'colfront2', isVisible: true },
  ]);


  const toggleVisibility = (index, state) => {
    console.log("Index being toggled:", index);
    const columnNames = ['col1', 'col2', 'col3', 'col4'];
    const columnName = columnNames[index];
    console.log("Column name being toggled:", columnName);
    console.log("State recieved: ", state)
   
    if (index < 0 || index >= columnNames.length) {
      console.error("Invalid index:", index);
      return;
    }

    if (!columnName) {
      console.error("Invalid column name for index:", index);
      return;
    }

    // Check visibility of colCenter1 and colCenter2
    const colCenter1 = loaded_meshes_global.flat().find(mesh => mesh.id === 'colCenter1');
    const colCenter2 = loaded_meshes_global.flat().find(mesh => mesh.id === 'colCenter2');
    const colCenter1Toggled = colCenter1 ? colCenter1.isVisible : false;
    const colCenter2Toggled = colCenter2 ? colCenter2.isVisible : false;
    console.log("colCenter1 Toggled:", colCenter1Toggled);
    console.log("colCenter2 Toggled:", colCenter2Toggled);

    var element_state;
    // Proceed with toggling the column and associated trusses
    loaded_meshes_global.forEach((elementGroup) => {
      elementGroup.forEach((element) => {
        if (element.id === columnName) {
          element.isVisible = !element.isVisible;
          element_state = element.isVisible;
          
          // Store the column state in sessionStorage
          if (columnName === 'col1' || columnName === 'col2') {
            sessionStorage.setItem(columnName, JSON.stringify(element.isVisible));
          }
        }
      });
    });

    if (index === 0) { // For col1
      const rtruss = loaded_meshes_global.flat().find(mesh => mesh.id === 'rtruss');
      const brtruss = loaded_meshes_global.flat().find(mesh => mesh.id === 'brtruss');

      if (rtruss) {
        console.log("running rtruss")
        rtruss.isVisible = !element_state;
      } else {
        console.warn('rtruss not found.');
      }

      if (brtruss) {
        brtruss.isVisible = !element_state;
      } else {
        console.warn('brtruss not found.');
      }
    } else if (index === 1) { // For col2
      const ltruss = loaded_meshes_global.flat().find(mesh => mesh.id === 'ltruss');
      const bltruss = loaded_meshes_global.flat().find(mesh => mesh.id === 'bltruss');

      if (ltruss) {
        ltruss.isVisible = !element_state;
      } else {
        console.warn('ltruss not found.');
      }

      if (bltruss) {
        bltruss.isVisible = !element_state;
      } else {
        console.warn('bltruss not found.');
      }
    }

    // Update columnsState if needed
    // const updatedColumns = columnsState.map((element) => {
    //   if (element.name === columnName) {
    //     return { ...element, isVisible: !element.isVisible };
    //   }
    //   return element;
    // });
  if(columnName == 'col1'){
    setSideState('Right')
  }else if(columnName == 'col2'){
    setSideState('Left')
  }
 
    setColumnsState(0);
  };




  const toggleVisibilityAwning = (index, state) => {
    console.log("Awning Index being toggled:", index);
    const columnNames = ['leantorightcolfront','leantoleftcolfront',];
    const columnName = columnNames[index];
    console.log("Awning Column name being toggled:", columnName);
    console.log("Awning State recieved: ", state)

    if (index < 0 || index >= columnNames.length) {
      console.error("Invalid index:", index);
      return;
    }

    if (!columnName) {
      console.error("Invalid column name for index:", index);
      return;
    }

    // Check visibility of colCenter1(RIGHT) and colCenter2 
    const leantorightcolfront = loaded_meshes_global.flat().find(mesh => mesh.id === 'leantorightcolfront');
     const leantoleftcolfront = loaded_meshes_global.flat().find(mesh => mesh.id === 'leantoleftcolfront');
    const leantorightcolfrontToggled = leantorightcolfront ? leantorightcolfront.isVisible : false;
    const leantoleftcolfrontToggled = leantoleftcolfront ? leantoleftcolfront.isVisible : false;
    console.log("leantorightcolfront Toggled:", leantorightcolfrontToggled);
    console.log("leantoleftcolfront Toggled:", leantoleftcolfrontToggled);


    var element_state;
    // Proceed with toggling the column and associated trusses
    loaded_meshes_global.forEach((elementGroup) => {
      elementGroup.forEach((element) => {
        
        if (element.id === columnName) {
          element.isVisible = !element.isVisible;
          element_state = element.isVisible;
        }
      });
    });

    if (index === 0) { // For RIGHT
      const ratruss = loaded_meshes_global.flat().find(mesh => mesh.id === 'ratruss');
      const abrtruss = loaded_meshes_global.flat().find(mesh => mesh.id === 'abrtruss');

      if (ratruss) {
        console.log("running ratruss")
        ratruss.isVisible = !element_state;
      } else {
        console.warn('ratruss not found.');
      }

      if (abrtruss) {
        abrtruss.isVisible = !element_state;
      } else {
        console.warn('abrtruss not found.');
      }
    } else if (index === 1) { // For LEFT
      const altruss = loaded_meshes_global.flat().find(mesh => mesh.id === 'altruss');
      const abltruss = loaded_meshes_global.flat().find(mesh => mesh.id === 'abltruss');

      if (altruss) {
        altruss.isVisible = !element_state;
      } else {
        console.warn('altruss not found.');
      }

      if (abltruss) {
        abltruss.isVisible = !element_state;
      } else {
        console.warn('abltruss not found.');
      }
    }

  if(columnName == 'leantorightcolfront'){
    setSideAwningState('Right')
  }else if(columnName == 'leantoleftcolfront'){
    setSideAwningState('Left')
  }
  setColumnsAwningState(0);
  };


  // const handlecolcenter1 = (e, index) => {
  //   // console.log("Meshes at index:", index, loaded_meshes_global[0]);
  //   const isEnabled = colCenter1EnabledStates[index] !== undefined ? colCenter1EnabledStates[index] : true; 
  //   const newEnabledStates = { ...colCenter1EnabledStates, [index]: !isEnabled }; // Toggle state for this index
  //   setColCenter1EnabledStates(newEnabledStates); // Update the state
  //   console.log(colCenter1EnabledStates)
  //   if(colCenter1EnabledStates[index] == false){
  //     loaded_meshes_global[index].forEach((element) => {
  //       if(element.name === 'rtruss'){
  //         element.isVisible = false;
  //       }
  //     })
  //   }else{
  //     //do nothing squad
  //   }
  //   console.log("colcenter1 index at:", index);

  //   const col1 = loaded_meshes_global.flat().find(mesh => mesh.id === 'col1');
  //   const col2 = loaded_meshes_global.flat().find(mesh => mesh.id === 'col2');
  //   const col1Visible = col1 ? col1.isVisible : false;
  //   const col2Visible = col2 ? col2.isVisible : false;

  //   if(loaded_meshes_global.length <= 3){
  //       console.log("this is executing with is enabled: ", isEnabled)

  //       const colElement = document.getElementById(`colCenter1${index}`);
  //       if (colElement) {
  //         const isToggledOn = colElement.style.backgroundColor === "lightblue";
  //         colElement.style.backgroundColor = isToggledOn ? "lightgray" : "lightblue";
  //         loaded_meshes_global[index].forEach((element) => {
  //           if (element.name === 'colCenter1') {
  //             element.isVisible = !isToggledOn;
  //           }
  //         });
  //       }
  //       const toggleIndexIfOff = (toggleIndex) => {
  //         const toggleElement = document.getElementById(`colCenter1${toggleIndex}`);
  //         if (toggleElement && toggleElement.style.backgroundColor === "lightgray") {
  //           toggleElement.style.backgroundColor = "lightblue";
  //           loaded_meshes_global[toggleIndex].forEach((element) => {
  //             if (element.name === 'colCenter1') {
  //               element.isVisible = true;
  //             }
  //           });
  //         }
  //         setColCenter1EnabledStates((prevState) => ({
  //           ...prevState,
  //           [toggleIndex]: false, // Set the specific index to false
  //         }));
  //       };
  //       if (index > 0) {
  //         toggleIndexIfOff(index - 1);
  //       }
  //       if (index < loaded_meshes_global.length - 1) {
  //         toggleIndexIfOff(index + 1);
  //       }
  //   }else{

  //     console.log("this is executing with is enabled: ", isEnabled)
  //     // handling visibility of columns
  //     const colElement = document.getElementById(`colCenter1${index}`);
  //     if (colElement) {
  //       const isToggledOn = colElement.style.backgroundColor === "lightblue";
  //       colElement.style.backgroundColor = isToggledOn ? "lightgray" : "lightblue";
  //       loaded_meshes_global[index].forEach((element) => {
  //         if (element.name === 'colCenter1') {
  //           element.isVisible = !isToggledOn;
  //         }
  //       });
  //     }
  //     const toggleIndexIfOff = (toggleIndex) => {
  //       const toggleElement = document.getElementById(`colCenter1${toggleIndex}`);
  //       if (toggleElement && toggleElement.style.backgroundColor === "lightgray") {
  //         toggleElement.style.backgroundColor = "lightblue";
  //         loaded_meshes_global[toggleIndex].forEach((element) => {
  //           if (element.name === 'colCenter1') {
  //             element.isVisible = true;
  //           }
  //         });
  //       }
  //     };
  //     if (index > 0) {
  //       toggleIndexIfOff(index - 1);
  //     }
  //     if (index < loaded_meshes_global.length - 1) {
  //       toggleIndexIfOff(index + 1);
  //     }

  //     //handling visibility of trusses
  //     // this needs to check for enabled at front or back for all indexes
  //     loaded_meshes_global[index].forEach((element) =>{
  //       if(element.name === 'rtruss'){
  //         if(isEnabled == true){
  //           element.isVisible = true;
  //         }else{
  //           element.isVisible = false
  //         }
  //       }
  //     });
  //     if(loaded_meshes_global[index + 1]){
  //       loaded_meshes_global[index + 1].forEach((element) =>{
  //         if(element.name === 'rtruss'){
  //           if(isEnabled == true){
  //             element.isVisible = true;
  //           }else{
  //             element.isVisible = false
  //           }
  //         }
  //       });
  //     }
  //     loaded_meshes_global[index - 1].forEach((element) =>{
  //       if(element.name === 'rtruss'){
  //         if(isEnabled == true){
  //           element.isVisible = false;
  //         }
  //       }
  //     });
  //   }
  //   // if (!col1Visible && !col2Visible) {
  //   //   console.warn('Cannot toggle colCenter1 while col1 and col2 are not visible.');
  //   //   return;
  //   // }

  //   // const ensureRtrussIsOn = (i) => {
  //   //   if (i >= 0 && i < loaded_meshes_global.length) {
  //   //     const rtruss = loaded_meshes_global[i].find(mesh => mesh.id === 'rtruss');
  //   //     if (rtruss && !rtruss.isVisible) {
  //   //       rtruss.isVisible = true;
  //   //       console.log(`rtruss at index ${i} toggled on.`);
  //   //     }
  //   //   }
  //   // };

  //   // const ensureRtrussIsOff = (i) => {
  //   //   if (i >= 0 && i < loaded_meshes_global.length) {
  //   //     const rtruss = loaded_meshes_global[i].find(mesh => mesh.id === 'rtruss');
  //   //     if (rtruss && rtruss.isVisible) {
  //   //       rtruss.isVisible = false;
  //   //       console.log(`rtruss at index ${i} toggled off.`);
  //   //     }
  //   //   }
  //   // };


  //   // console.log("before", loaded_meshes_global.length);
  //   // console.log("Total number of bays:", loaded_meshes_global.length);

  //   // const lastCenterBayIndex = loaded_meshes_global.length - 1;
  //   // console.log("Calculated last center bay index:", lastCenterBayIndex);

  //   // if (index === lastCenterBayIndex) {
  //   //   console.log(`Toggling frtruss at index ${index}, I need to toggle frtruss which is at index 1 in frontbay.`);

  //   //   loaded_meshes_global[1].forEach((mesh) => {
  //   //     if (mesh.id === 'frtruss') {
  //   //       mesh.isVisible = !mesh.isVisible;
  //   //       console.log("frtruss toggled at index:", index);
  //   //     }
  //   //   });
  //   // } else {
  //   //   console.log(`Index ${index} is not the last center bay.`);
  //   // }

  //   // const toggleRtrussVisibility = (i) => {
  //   //   if (i >= 0 && i < loaded_meshes_global.length) {
  //   //     const rtruss = loaded_meshes_global[i].find(mesh => mesh.id === 'rtruss');
  //   //     if (rtruss) {
  //   //       if (rtruss.isVisible) {
  //   //         console.log(`rtruss at index ${i} was already on, ignoring.`);
  //   //       } else {
  //   //         rtruss.isVisible = true;
  //   //         console.log(`rtruss at index ${i} toggled on.`);
  //   //       }
  //   //     }
  //   //   }
  //   // };

  //   // // Toggle the current rtruss if needed
  //   // toggleRtrussVisibility(index);

  //   // // Ensure the previous rtruss is turned off if the next one is toggled on
  //   // if (index > 0) {
  //   //   ensureRtrussIsOff(index - 1);
  //   //   console.log(`rtruss at index ${index - 1} toggled off.`);
  //   // }

  //   // // Ensure the next rtruss is turned on if the current one is toggled
  //   // if (index < loaded_meshes_global.length - 1) {
  //   //   ensureRtrussIsOn(index + 1);
  //   // }
  // };

  const handlecolcenterRight = (e, index) => {
    // Example of including index in the stored object
    // const dataToStore = {
    //   states: colCenter1EnabledStates,
    //   index: index
    // };
    // Determine if the current index is enabled or not
    const isEnabled = colCenter1EnabledStates[index] !== undefined ? colCenter1EnabledStates[index] : false;

    // Initialize new states by setting the current index to its toggled value
    const newEnabledStates = { ...colCenter1EnabledStates, [index]: !isEnabled };

    var check_for_disabling_previous_index = true;
    if(loaded_meshes_global[index - 2]){
      loaded_meshes_global[index - 2].forEach((element) => {
        if(element.name === 'colCenter1'){
          if(element.isVisible == true){
            check_for_disabling_previous_index = false;
          }
        }
      })
    }
    // Ensure adjacent indices are disabled
    if (!isEnabled) {
        if (index > 0) {
            newEnabledStates[index - 1] = false;
            if(loaded_meshes_global[index - 1] && index - 1 != 0 && index - 1 != 1){
              loaded_meshes_global[index - 1].forEach((element) => {
                if(element.name === 'rtruss'){
                  if(check_for_disabling_previous_index == false){
                    element.isVisible = false;
                  }else{
  
                  }
                }
              });
            }
        }
        if (index < loaded_meshes_global.length - 1) {
            newEnabledStates[index + 1] = false;
            if(loaded_meshes_global[index + 1] && index + 1 != 0 && index + 1 != 1){
              loaded_meshes_global[index + 1].forEach((element) => {
                if(element.name === 'rtruss'){
                  element.isVisible = false;
                }
              })
            }
            var flag_for_activity = false;
            if(loaded_meshes_global[index + 2] && index + 2 != 0 && index + 2 != 1){
              loaded_meshes_global[index + 2].forEach((element) => {
                if(element.name === 'colCenter1'){
                  if(element.isVisible == true){
                    flag_for_activity = true;
                  }
                }
                if(element.name === 'rtruss'){
                  if(flag_for_activity == true){
                    if(element.isVisible == true){
                      element.isVisible = false;
                    }
                  }
                }
              })
            }
        }
    }

    // Update the state with the new values
    setColCenter1EnabledStates(newEnabledStates);
    sessionStorage.setItem('RightColCenter', JSON.stringify(newEnabledStates))

    // console.log("right col center index", index)
    // console.log("right col center enabled states", colCenter1EnabledStates)

    // console.log("Updated state:", newEnabledStates);

    // Handling visibility of columns and trusses
    const colElement = document.getElementById(`colCenter1${index}`);
    if (colElement) {
        const isToggledOn = colElement.style.backgroundColor === "lightblue";
        colElement.style.backgroundColor = isToggledOn ? "lightgray" : "lightblue";
        loaded_meshes_global[index].forEach((element) => {
            if (element.name === 'colCenter1') {
                element.isVisible = !isToggledOn;
            }
        });
    }

    const toggleIndexIfOff = (toggleIndex) => {
    
        const toggleElement = document.getElementById(`colCenter1${toggleIndex}`);
        if (toggleElement && toggleElement.style.backgroundColor === "lightgray") {
            toggleElement.style.backgroundColor = "lightblue";
            loaded_meshes_global[toggleIndex].forEach((element) => {
                if (element.name === 'colCenter1') {
                    element.isVisible = true;
                }
            });
        }
    };

    if (index > 0) {
        toggleIndexIfOff(index - 1);
    }
    if (index < loaded_meshes_global.length - 1) {
        toggleIndexIfOff(index + 1);
    }

    // Handling visibility of trusses
    loaded_meshes_global[index].forEach((element) => {
        if (element.name === 'rtruss') {
            element.isVisible = !isEnabled;
        }
    });

    if (loaded_meshes_global[index + 1]) {
        loaded_meshes_global[index + 1].forEach((element) => {
            if (element.name === 'rtruss') {
                element.isVisible = !isEnabled;
            }
        });
    }
    var check_for_back_columns = true
    if (loaded_meshes_global[index - 1]){
        loaded_meshes_global[index - 1].forEach((element) => {
          if(index - 1 == 2){
            loaded_meshes_global[0].forEach((element) => {
              if(element.name === 'col1'){
                if(element.isVisible == false){
                  console.log("set to false")
                  check_for_back_columns = false;
                }
              }
            })
          }
          if (element.name === 'rtruss') {
            if(index - 1 == 2){
              if(check_for_back_columns == true){
                if(element.isVisible == true)
                  if(check_for_disabling_previous_index == false){
                    console.log("index - 2 check is: ", check_for_disabling_previous_index )
                    element.isVisible = !isEnabled;
                  }else{
                    element.isVisible = isEnabled;
                  }
              }else{
                //do nothing squad
                element.isVisible = true;
                console.log("in the do nothing squad")
              }
            }
          }
        });
    }

      //handling edge case of frontbay connection
      if(index == loaded_meshes_global.length - 1){
        if(loaded_meshes_global.length <= 3){
          loaded_meshes_global[1].forEach((element) => {
            if(element.name === 'frtruss'){
              element.isVisible = !isEnabled
            }
          })
          loaded_meshes_global[0].forEach((element) => {
            if(element.name === 'brtruss'){
              element.isVisible = false;
            }
            if(element.name === 'col1'){
              element.isVisible = true;
            }
          })
        }else{
          loaded_meshes_global[1].forEach((element) => {
            if(element.name === 'frtruss'){
              element.isVisible = !isEnabled
            }
          })
        }
      }

      if(index == loaded_meshes_global.length - 2){
        if(loaded_meshes_global.length > 3){
          loaded_meshes_global[1].forEach((element) => {
            if(element.name === 'frtruss'){
              element.isVisible = false
            }
          })
        }
      }

//for edge case of connecting second index to backbay
      if(index == 2){
        loaded_meshes_global[0].forEach((element) => {
          if(element.name === 'brtruss'){
            element.isVisible = false;
          }
          if(element.name === 'col1'){
              element.isVisible = true;
              sessionStorage.setItem('col1', JSON.stringify(true));
          }
        })
      }
      
};

const handlecolcenterLeft = (e, index) => {
  // Determine if the current index is enabled or not
  const isEnabled = colCenter2EnabledStates[index] !== undefined ? colCenter2EnabledStates[index] : false;

  console.log("colcenterenabled states: ", colCenter2EnabledStates)
  // Initialize new states by setting the current index to its toggled value
  const newEnabledStates = { ...colCenter2EnabledStates, [index]: !isEnabled };

  // Ensure adjacent indices are disabled
  if (!isEnabled) {
      var check_for_disabling_previous_index = true;
      if(loaded_meshes_global[index -2] && index - 1 != 0 && index - 1 != 1){
        loaded_meshes_global[index - 2].forEach((element) => {
          if(element.name === 'colCenter2'){
            console.log("found element")
            if(element.isVisible == true){
              console.log("-2 is set to false")
              check_for_disabling_previous_index = false;
            }
          }
        })
      }
      if (index > 0) {
          newEnabledStates[index - 1] = false;
          if(loaded_meshes_global[index - 1] && index - 1 != 0 && index - 1 != 1){
            loaded_meshes_global[index - 1].forEach((element) => {
              if(element.name === 'ltruss'){
                if(check_for_disabling_previous_index == false){
                  element.isVisible = false;
                }else{

                }
              }
            });
          }
      }
      if (index < loaded_meshes_global.length - 1) {
          newEnabledStates[index + 1] = false;
          if(loaded_meshes_global[index + 1] && index + 1 != 0 && index + 1 != 1){
            loaded_meshes_global[index + 1].forEach((element) => {
              if(element.name === 'ltruss'){
                element.isVisible = false;
              }
            })
          }
          var flag_for_activity = false;
          if(loaded_meshes_global[index + 2] && index + 2 != 0 && index + 2 != 1){
            loaded_meshes_global[index + 2].forEach((element) => {
              if(element.name === 'colCenter2'){
                if(element.isVisible == true){
                  flag_for_activity = true;
                }
              }
              if(element.name === 'ltruss'){
                if(flag_for_activity == true){
                  if(element.isVisible == true){
                    element.isVisible = false;
                  }
                }
              }
            })
          }
          
      }
  }

  // Update the state with the new values
  setColCenter2EnabledStates(newEnabledStates);

  sessionStorage.setItem('leftColCenter', JSON.stringify(newEnabledStates))
  console.log("Updated state:", newEnabledStates);

  // Handling visibility of columns and trusses
  const colElement = document.getElementById(`colCenter2${index}`);
  if (colElement) {
      const isToggledOn = colElement.style.backgroundColor === "lightblue";
      colElement.style.backgroundColor = isToggledOn ? "lightgray" : "lightblue";
      loaded_meshes_global[index].forEach((element) => {
          if (element.name === 'colCenter2') {
              element.isVisible = !isToggledOn;
          }
      });
  }

  const toggleIndexIfOff = (toggleIndex) => {
      const toggleElement = document.getElementById(`colCenter2${toggleIndex}`);
      if (toggleElement && toggleElement.style.backgroundColor === "lightgray") {
          toggleElement.style.backgroundColor = "lightblue";
          loaded_meshes_global[toggleIndex].forEach((element) => {
              if (element.name === 'colCenter2') {
                  element.isVisible = true;
              }
          });
      }
  };

  if (index > 0) {
      toggleIndexIfOff(index - 1);
  }
  if (index < loaded_meshes_global.length - 1) {
      toggleIndexIfOff(index + 1);
  }

  // Handling visibility of trusses
  loaded_meshes_global[index].forEach((element) => {
      if (element.name === 'ltruss') {
        console.log("isenabled at check: ", isEnabled)
          element.isVisible = !isEnabled;
      }
  });

  if (loaded_meshes_global[index + 1]) {
      loaded_meshes_global[index + 1].forEach((element) => {
          if (element.name === 'ltruss') {
              element.isVisible = !isEnabled;
          }
      });
  }

  // var check_for_disabling_previous_index = true;
  // if(loaded_meshes_global[index -2]){
  //   loaded_meshes_global[index - 2].forEach((element) => {
  //     if(element.name === 'colCenter2'){
  //       if(element.isVisible == true){
  //         console.log("-2 is set to false")
  //         check_for_disabling_previous_index = false;
  //       }
  //     }
  //   })
  // }
  var check_for_back_columns = true
  if (loaded_meshes_global[index - 1]) {
      loaded_meshes_global[index - 1].forEach((element) => {
        if(index - 1 == 2){
          loaded_meshes_global[0].forEach((element) => {
            if(element.name === 'col2'){
              if(element.isVisible == false){
                console.log("set to false")
                check_for_back_columns = false;
              }
            }
          })
        }
          if (element.name === 'ltruss') {
            if(index - 1 == 2){
              if(check_for_back_columns == true){
                if(element.isVisible == true)
                  if(check_for_disabling_previous_index == false){
                    console.log("index - 2 check is: ", check_for_disabling_previous_index )
                    element.isVisible = !isEnabled;
                  }else{
                    element.isVisible = isEnabled;
                  }
              }else{
                //do nothing squad
                element.isVisible = true;
                console.log("in the do nothing squad")
              }
            }
          }
      });
  }

  //handling edge case of frontbay connection
  if(index == loaded_meshes_global.length - 1){
    if(loaded_meshes_global.length <= 3){
      loaded_meshes_global[1].forEach((element) => {
        if(element.name === 'fltruss'){
          element.isVisible = !isEnabled
        }
      })
      loaded_meshes_global[0].forEach((element) => {
        if(element.name === 'bltruss'){
          element.isVisible = false;
        }
        if(element.name === 'col2'){
          element.isVisible = true;
        }
      })
    }else{
      loaded_meshes_global[1].forEach((element) => {
        if(element.name === 'fltruss'){
          element.isVisible = !isEnabled
        }
      })
    }
  }

  //for edge case of connecting to frontbay
  if(index == loaded_meshes_global.length - 2){
    if(loaded_meshes_global.length > 3){
      loaded_meshes_global[1].forEach((element) => {
        if(element.name === 'fltruss'){
          element.isVisible = false
        }
      })
    }
  }

  //for edge case of connecting second index to backbay
  if(index == 2){
    loaded_meshes_global[0].forEach((element) => {
      if(element.name === 'bltruss'){
        element.isVisible = false;
      }
      if(element.name === 'col2'){
        element.isVisible = true;
        sessionStorage.setItem('col2', JSON.stringify(true));
      }
    })
  }
};


 
//For Awnings
 const handlecolcenterRightAwning = (e, index) => {
    // Determine if the current index is enabled or not 
    const isEnabledAwning = colCenter1AwningEnabledStates[index] !== undefined ? colCenter1AwningEnabledStates[index] : false;

    // Initialize new states by setting the current index to its toggled value
    const newEnabledAwningStates = { ...colCenter1AwningEnabledStates, [index]: !isEnabledAwning };

    var check_for_disabling_previous_index = true;
    if(loaded_meshes_global[index - 2]){
      loaded_meshes_global[index - 2].forEach((element) => {
        if(element.name === 'leantorightcols'){
          if(element.isVisible == true){
            check_for_disabling_previous_index = false;
          }
        }
      })
    }

    // Ensure adjacent indices are disabled
    if (!isEnabledAwning) {
        if (index > 0) {
            newEnabledAwningStates[index - 1] = false;
            if(loaded_meshes_global[index - 1] && index - 1 != 0 && index - 1 != 1){
              loaded_meshes_global[index - 1].forEach((element) => {
                if(element.name === 'ratruss'){
                  if(check_for_disabling_previous_index == false){
                    element.isVisible = false;
                  }else{
  
                  }
                }
              });
            }
        }
        if (index < loaded_meshes_global.length - 1) {
            newEnabledAwningStates[index + 1] = false;
            if(loaded_meshes_global[index + 1] && index + 1 != 0 && index + 1 != 1){
              loaded_meshes_global[index + 1].forEach((element) => {
                if(element.name === 'ratruss'){
                  element.isVisible = false;
                }
              })
            }
            var flag_for_activity = false;
            if(loaded_meshes_global[index + 2] && index + 2 != 0 && index + 2 != 1){
              loaded_meshes_global[index + 2].forEach((element) => {
                if(element.name === 'leantorightcols'){
                  if(element.isVisible == true){
                    flag_for_activity = true;
                  }
                }
                if(element.name === 'ratruss'){
                  if(flag_for_activity == true){
                    if(element.isVisible == true){
                      element.isVisible = false;
                    }
                  }
                }
              })
            }
        }
    }

    // Update the state with the new values
    setColCenter1AwningEnabledStates(newEnabledAwningStates);

    console.log("Updated awning state:", newEnabledAwningStates);

    // Handling visibility of columns and trusses
    const colElement = document.getElementById(`colCenter11${index}`);
    if (colElement) {
        const isToggledOn = colElement.style.backgroundColor === "lightblue";
        colElement.style.backgroundColor = isToggledOn ? "lightgray" : "lightblue";
        loaded_meshes_global[index].forEach((element) => {
            if (element.name === 'leantorightcols') {
                element.isVisible = !isToggledOn;
            }
        });
    }

    const toggleIndexIfOff = (toggleIndex) => {
        const toggleElement = document.getElementById(`colCenter11${toggleIndex}`);
        if (toggleElement && toggleElement.style.backgroundColor === "lightgray") {
            toggleElement.style.backgroundColor = "lightblue";
            loaded_meshes_global[toggleIndex].forEach((element) => {
                if (element.name === 'leantorightcols') {
                    element.isVisible = true;
                }
            });
        }
    };

    if (index > 0) {
        toggleIndexIfOff(index - 1);
    }
    if (index < loaded_meshes_global.length - 1) {
        toggleIndexIfOff(index + 1);
    }

    // Handling visibility of trusses
    loaded_meshes_global[index].forEach((element) => {
        if (element.name === 'ratruss') {
            element.isVisible = !isEnabledAwning;
        }
    });

    if (loaded_meshes_global[index + 1]) {
        loaded_meshes_global[index + 1].forEach((element) => {
            if (element.name === 'ratruss') {
                element.isVisible = !isEnabledAwning;
            }
        });
    }

    var check_for_back_columns = true
    if (loaded_meshes_global[index - 1]) {
        loaded_meshes_global[index - 1].forEach((element) => {
          if(index - 1 == 2){
            loaded_meshes_global[0].forEach((element) => {
              if(element.name === 'leantorightcolfront'){
                if(element.isVisible == false){
                  console.log("set to false")
                  check_for_back_columns = false;
                }
              }
            })
          }
            if (element.name === 'ratruss') {
              if(index - 1 == 2){
                if(check_for_back_columns == true){
                  if(element.isVisible == true)
                    if(check_for_disabling_previous_index == false){
                      console.log("index - 2 check is: ", check_for_disabling_previous_index )
                      element.isVisible = !isEnabledAwning;
                    }else{
                      element.isVisible = isEnabledAwning;
                    }
                }else{
                  //do nothing squad
                  element.isVisible = true;
                  console.log("in the do nothing squad")
                }
              }
            }
        });
    }


      //handling edge case of frontbay connection
      if(index == loaded_meshes_global.length - 1){
        if(loaded_meshes_global.length <= 3){
          loaded_meshes_global[1].forEach((element) => {
            if(element.name === 'afrtruss'){
              element.isVisible = !isEnabledAwning
            }
          })
          loaded_meshes_global[0].forEach((element) => {
            if(element.name === 'abrtruss'){
              element.isVisible = false;
            }
            if(element.name === 'leantorightcolfront'){
              element.isVisible = true;
            }
          })
        }else{
          loaded_meshes_global[1].forEach((element) => {
            if(element.name === 'afrtruss'){
              element.isVisible = !isEnabledAwning
            }
          })
        }
      }


      if(index == loaded_meshes_global.length - 2){
        if(loaded_meshes_global.length > 3){
          loaded_meshes_global[1].forEach((element) => {
            if(element.name === 'afrtruss'){
              element.isVisible = false
            }
          })
        }
      }

      //for edge case of connecting second index to backbay
      if(index == 2){
        loaded_meshes_global[0].forEach((element) => {
          if(element.name === 'abrtruss'){
            element.isVisible = false;
          }
          if(element.name === 'leantorightcolfront'){
            element.isVisible = true;
          }
        })
      }
      
};


             
const handlecolcenterLeftAwning = (e, index) => {
  // Determine if the current index is enabled or not
  const isEnabledAwning = colCenter2AwningEnabledStates[index] !== undefined ? colCenter2AwningEnabledStates[index] : false;

  console.log("colcenterAwningenabled states: ", colCenter2AwningEnabledStates)
 
  // Initialize new states by setting the current index to its toggled value
  const newEnabledAwningStates = { ...colCenter2AwningEnabledStates, [index]: !isEnabledAwning };

  // Ensure adjacent indices are disabled
  if (!isEnabledAwning) {

    var check_for_disabling_previous_index = true;
      if(loaded_meshes_global[index -2] && index - 1 != 0 && index - 1 != 1){
        loaded_meshes_global[index - 2].forEach((element) => {
          if(element.name === 'leantoleftcols'){
            console.log("found element")
            if(element.isVisible == true){
              console.log("-2 is set to false")
              check_for_disabling_previous_index = false;
            }
          }
        })
      }

      if (index > 0) {
          newEnabledAwningStates[index - 1] = false;
          if(loaded_meshes_global[index - 1] && index - 1 != 0 && index - 1 != 1){
            loaded_meshes_global[index - 1].forEach((element) => {
              if(element.name === 'altruss'){
                if(check_for_disabling_previous_index == false){
                  element.isVisible = false;
                }else{

                }
              }
            });
          }
      }
      if (index < loaded_meshes_global.length - 1) {
          newEnabledAwningStates[index + 1] = false;
          if(loaded_meshes_global[index + 1] && index + 1 != 0 && index + 1 != 1){
            loaded_meshes_global[index + 1].forEach((element) => {
              if(element.name === 'altruss'){
                element.isVisible = false;
              }
            })
          }
          var flag_for_activity = false;
          if(loaded_meshes_global[index + 2] && index + 2 != 0 && index + 2 != 1){
            loaded_meshes_global[index + 2].forEach((element) => {
              if(element.name === 'leantoleftcols'){
                if(element.isVisible == true){
                  flag_for_activity = true;
                }
              }
              if(element.name === 'altruss'){
                if(flag_for_activity == true){
                  if(element.isVisible == true){
                    element.isVisible = false;
                  }
                }
              }
            })
          }
          
      }
  }

  // Update the state with the new values
  setColCenter2AwningEnabledStates(newEnabledAwningStates);

  console.log("Updated left awning state:", newEnabledAwningStates);

  // Handling visibility of columns and trusses
  const colElement = document.getElementById(`colCenter12${index}`);
  if (colElement) {
      const isToggledOn = colElement.style.backgroundColor === "lightblue";
      colElement.style.backgroundColor = isToggledOn ? "lightgray" : "lightblue";
      loaded_meshes_global[index].forEach((element) => {
          if (element.name === 'leantoleftcols') {
              element.isVisible = !isToggledOn;
          }
      });
  }

  const toggleIndexIfOff = (toggleIndex) => {
      const toggleElement = document.getElementById(`colCenter12${toggleIndex}`);
      if (toggleElement && toggleElement.style.backgroundColor === "lightgray") {
          toggleElement.style.backgroundColor = "lightblue";
          loaded_meshes_global[toggleIndex].forEach((element) => {
              if (element.name === 'leantoleftcols') {
                  element.isVisible = true;
              }
          });
      }
  };

  if (index > 0) {
      toggleIndexIfOff(index - 1);
  }
  if (index < loaded_meshes_global.length - 1) {
      toggleIndexIfOff(index + 1);
  }

  // Handling visibility of trusses
  loaded_meshes_global[index].forEach((element) => {
      if (element.name === 'altruss') {
        console.log("isenabledAwning at check: ", isEnabledAwning)
          element.isVisible = !isEnabledAwning;
      }
  });

  if (loaded_meshes_global[index + 1]) {
      loaded_meshes_global[index + 1].forEach((element) => {
          if (element.name === 'altruss') {
              element.isVisible = !isEnabledAwning;
          }
      });
  }

  
  var check_for_back_columns = true
  if (loaded_meshes_global[index - 1]) {
      loaded_meshes_global[index - 1].forEach((element) => {
        if(index - 1 == 2){
          loaded_meshes_global[0].forEach((element) => {
            if(element.name === 'leantoleftcolfront'){
              if(element.isVisible == false){
                console.log("set to false")
                check_for_back_columns = false;
              }
            }
          })
        }
          if (element.name === 'altruss') {
            if(index - 1 == 2){
              if(check_for_back_columns == true){
                if(element.isVisible == true)
                  if(check_for_disabling_previous_index == false){
                    console.log("index - 2 check is: ", check_for_disabling_previous_index )
                    element.isVisible = !isEnabledAwning;
                  }else{
                    element.isVisible = isEnabledAwning;
                  }
              }else{
                //do nothing squad
                element.isVisible = true;
                console.log("in the do nothing squad")
              }
            }
          }
      });
  }
  

  //handling edge case of frontbay connection
  if(index == loaded_meshes_global.length - 1){
    if(loaded_meshes_global.length <= 3){
      loaded_meshes_global[1].forEach((element) => {
        if(element.name === 'afltruss'){
          element.isVisible = !isEnabledAwning
        }
      })
      loaded_meshes_global[0].forEach((element) => {
        if(element.name === 'abltruss'){
          element.isVisible = false;
        }
        if(element.name === 'leantoleftcolfront'){
          element.isVisible = true;
        }
      })
    }else{
      loaded_meshes_global[1].forEach((element) => {
        if(element.name === 'afltruss'){
          element.isVisible = !isEnabledAwning
        }
      })
    }
  }

  //for edge case of connecting to frontbay
  if(index == loaded_meshes_global.length - 2){
    if(loaded_meshes_global.length > 3){
      loaded_meshes_global[1].forEach((element) => {
        if(element.name === 'afltruss'){
          element.isVisible = false
        }
      })
    }
  }
 

 //for edge case of connecting second index to backbay
 if(index == 2){
  loaded_meshes_global[0].forEach((element) => {
    if(element.name === 'abltruss'){
      element.isVisible = false;
    }
    if(element.name === 'leantoleftcolfront'){
      element.isVisible = true;
    }
  })
}
};





  //
  // const handlecolcenter2 = (e, index) => {
  //   // console.log("enabled state via e: ", e, " enabled state via isENabled: ", isEnabled)
  //   console.log("Index for colCenter2 at:", index);
  //   // const col1 = loaded_meshes_global.flat().find(mesh => mesh.id === 'col1');
  //   const col2 = loaded_meshes_global.flat().find(mesh => mesh.id === 'col2');
  //   // const col1Visible = col1 ? col1.isVisible : false;
  //   const col2Visible = col2 ? col2.isVisible : false;

  //   if (!col2Visible) {
  //     console.warn('Cannot toggle colCenter2 while col1 and col2 are not visible.');
  //     return;
  //   }

  //   // const colElement = document.getElementById(`colCenter2${index}`);
  //   // if (colElement) {
  //   //   colElement.style.backgroundColor === "lightgray"
  //   //     ? (colElement.style.backgroundColor = "lightblue")
  //   //     : (colElement.style.backgroundColor = "lightgray");
  //   // }

  //   loaded_meshes_global[index].forEach((element) => {
  //     if (element.name === 'colCenter2') {
  //       element.isVisible = !element.isVisible;
  //     }
  //   });
  //   const toggleIndexIfOff = (toggleIndex) => {
  //     const toggleElement = document.getElementById(`colCenter2${toggleIndex}`);
  //     if (toggleElement && toggleElement.style.backgroundColor === "lightgray") {
  //       toggleElement.style.backgroundColor = "lightblue";
  //       loaded_meshes_global[toggleIndex].forEach((element) => {
  //         if (element.name === 'colCenter2') {
  //           element.isVisible = true;
  //         }
  //       });
  //     }
  //   };

  //   // Toggle the previous and next indexes back on if they are untoggled
  //   if (index > 0) {
  //     toggleIndexIfOff(index - 1);
  //   }
  //   if (index < loaded_meshes_global.length - 1) {
  //     toggleIndexIfOff(index + 1);
  //   }

  //   // Toggle the current index
  //   const colElement = document.getElementById(`colCenter2${index}`);
  //   if (colElement) {
  //     const isToggledOn = colElement.style.backgroundColor === "lightblue";
  //     colElement.style.backgroundColor = isToggledOn ? "lightgray" : "lightblue";
  //     loaded_meshes_global[index].forEach((element) => {
  //       if (element.name === 'colCenter2') {
  //         element.isVisible = !isToggledOn;
  //       }
  //     });
  //   }
  //   const lastCenterBayIndex = loaded_meshes_global.length - 1;
  //   console.log("Calculated last center bay index:", loaded_meshes_global.length);


  //   if (index === lastCenterBayIndex) {
  //     console.log(`Toggling frtruss  at index ${index}, i need to toggle frtruss which is at index1 in frontbay .`);

  //     loaded_meshes_global[1].forEach((mesh) => {
  //       if (mesh.id === 'fltruss') {
  //         mesh.isVisible = !mesh.isVisible;
  //         console.log("frtruss toggled at index:", index);
  //       }
  //     });
  //   } else {
  //     console.log(`Index ${index} is not the last center bay.`);
  //   }


  //   const ltruss = loaded_meshes_global[index].find(mesh => mesh.id === 'ltruss');
  //   if (ltruss) {
  //     ltruss.isVisible = !ltruss.isVisible;
  //   } else {
  //     console.warn('ltruss not found.');
  //   }
  //   if (index + 1 < loaded_meshes_global.length) {
  //     const nextLtruss = loaded_meshes_global[index + 1].find(mesh => mesh.id === 'ltruss');
  //     if (nextLtruss) {
  //       nextLtruss.isVisible = !nextLtruss.isVisible;
  //       console.log(`rtruss at index ${index + 1} toggled.`);
  //     } else {
  //       console.warn(`rtruss not found at index ${index + 1}.`);
  //     }
  //   }
  // };


  const handleLeftWall = (e, index) => {
    document.getElementById(`left${index}`).style.backgroundColor === "lightgray" ? document.getElementById(`left${index}`).style.backgroundColor = "lightblue" : document.getElementById(`left${index}`).style.backgroundColor = "lightgray";
    setIsLeftWallVisible((prevVisibility) => !prevVisibility);
    loaded_meshes_global[index].forEach((element) => {
      if (element.name === 'Lwall') {
        // console.log("Printing Lwall Before any Change: ", element.isVisible);
        element.isVisible = !element.isVisible;
        // console.log("Printing Lwall After Change: ", element.isVisible);
      }
    });

  };

  const handleRightWall = (e, index) => {
    document.getElementById(`right${index}`).style.backgroundColor === "lightgray" ? document.getElementById(`right${index}`).style.backgroundColor = "lightblue" : document.getElementById(`right${index}`).style.backgroundColor = "lightgray";
    setIsRightWallVisible((prevVisibility) => !prevVisibility);

    loaded_meshes_global[index].forEach((element) => {
      if (element.name === 'Rwall') {
        // console.log("Printing Rwall Before any Change: ", element.isVisible);
        element.isVisible = !element.isVisible;
        // console.log("Printing Rwall After Change: ", element.isVisible);
      }
    });
  };
  const handleTopWall = (e, index) => {
    document.getElementById(`top${index}`).style.backgroundColor === "lightgray" ? document.getElementById(`top${index}`).style.backgroundColor = "lightblue" : document.getElementById(`top${index}`).style.backgroundColor = "lightgray";
    loaded_meshes_global[index].forEach((element) => {
      if (element.name === 'FWall') {
        // console.log("Printing Fwall Before any Change: ", element.isVisible);
        element.isVisible = !element.isVisible;
        // console.log("Printing Fwall After Change: ", element.isVisible);
      }
      if (element.name === 'FTop') {
        // console.log("Printing FTop Before any Change: ", element.isVisible);
        element.isVisible = !element.isVisible;
        // console.log("Printing FTop After Change: ", element.isVisible);
      }

    });
  };
  const handleBottomWall = (e, index) => {
    document.getElementById(`bottom${index}`).style.backgroundColor === "lightgray" ? document.getElementById(`bottom${index}`).style.backgroundColor = "lightblue" : document.getElementById(`bottom${index}`).style.backgroundColor = "lightgray";
    loaded_meshes_global[index].forEach((element) => {
      if (element.name === 'BWall') {
        // console.log("Printing Bwall Before any Change: ", element.isVisible);
        element.isVisible = !element.isVisible;
        // console.log("Printing Bwall After Change: ", element.isVisible);
      }
      if (element.name === 'BTop') {
        // console.log("Printing BTop Before any Change: ", element.isVisible);
        element.isVisible = !element.isVisible;
        // console.log("Printing BTop After Change: ", element.isVisible);
      }
    })
  };

  const handleLeftAwningWalls = (e, index) => {
    document.getElementById(`LC${index}`).style.backgroundColor === "lightgray" ? document.getElementById(`LC${index}`).style.backgroundColor = "lightblue" : document.getElementById(`LC${index}`).style.backgroundColor = "lightgray";
    setIsLeftAwningVisible((prevVisibility) => !prevVisibility);

    loaded_meshes_global[index].forEach((element) => {
      if (element.name === 'leanToLeftWalls') {
        element.isVisible = !element.isVisible;
      }
    });
  }
  const handleRightAwningWalls = (e, index) => {
    document.getElementById(`RC${index}`).style.backgroundColor === "lightgray" ? document.getElementById(`RC${index}`).style.backgroundColor = "lightblue" : document.getElementById(`RC${index}`).style.backgroundColor = "lightgray";
    setIsRightAwningVisible((prevVisibility) => !prevVisibility);

    loaded_meshes_global[index].forEach((element) => {
      if (element.name === 'leanToRightWalls') {
        element.isVisible = !element.isVisible;
      }
    });
  }
  const handleLeftAwningTopMidWalls = (e, index) => {
    document.getElementById(`LAW${index}`).style.backgroundColor === "lightgray" ? document.getElementById(`LAW${index}`).style.backgroundColor = "lightblue" : document.getElementById(`LAW${index}`).style.backgroundColor = "lightgray";
    loaded_meshes_global[index].forEach((element) => {
      if (element.name === 'leanToLeftPartWallBack' || element.name === 'leanToLeftTriangleBack' || element.name === 'leanToLeftPurlins') {
        element.isVisible = !element.isVisible;
      }
    });
  }

  const handleRightAwningTopMidWalls = (e, index) => {
    document.getElementById(`RAW${index}`).style.backgroundColor === "lightgray" ? document.getElementById(`RAW${index}`).style.backgroundColor = "lightblue" : document.getElementById(`RAW${index}`).style.backgroundColor = "lightgray";
    loaded_meshes_global[index].forEach((element) => {
      if (element.name === 'leanToRightPartWallBack' || element.name === 'leanToRightTriangleBack' || element.name === 'leanToRightPurlins') {
        element.isVisible = !element.isVisible;
      }
    });
  }

  const handleLeftAwningBottomMidWalls = (e, index) => {
    document.getElementById(`BLAW${index}`).style.backgroundColor === "lightgray" ? document.getElementById(`BLAW${index}`).style.backgroundColor = "lightblue" : document.getElementById(`BLAW${index}`).style.backgroundColor = "lightgray";
    loaded_meshes_global[index].forEach((element) => {
      if (element.name === 'leanToLeftPartWall' || element.name === 'leanToLeftTriangle' || element.name === 'leanToLeftPurlins') {
        element.isVisible = !element.isVisible;
      }
    });
  }

  const handleRightAwningBottomMidWalls = (e, index) => {
    document.getElementById(`BRAW${index}`).style.backgroundColor === "lightgray" ? document.getElementById(`BRAW${index}`).style.backgroundColor = "lightblue" : document.getElementById(`BRAW${index}`).style.backgroundColor = "lightgray";
    loaded_meshes_global[index].forEach((element) => {
      if (element.name === 'leanToRightPartWall' || element.name === 'leanToRightTriangle' || element.name === 'leanToRightPurlins') {
        element.isVisible = !element.isVisible;
      }
    });
  }


  const custom_style_button = (index, name) => {
    const styles = {}; // Initialize an empty object to hold styles

    loaded_meshes_global[index].forEach((element) => {
      if (element.name === name) {
        // Update styles object based on conditions
        styles.backgroundColor = element.isVisible ? "lightblue" : "lightgray";
      }
    });
    if (leftawnings || rightawnings) {
      styles.transform = "scale(0.95)";

    }

    return styles; // Return the styles object
  }
  const custom_button_scaling = () => {
    const styles = {}; // Initialize an empty object to hold styles

  }

  const LeftWalls = () => {
    const isVisible = localStorage.getItem("LeftWallsVisible") === "true";

    // Toggle the localStorage value
    localStorage.setItem("LeftWallsVisible", isVisible ? "false" : "true");

    // Update the state to reflect the new value
    set_left_checked(!isVisible);

    // Toggle the visibility of the left wall meshes
    for (let i = 0; i < loaded_meshes_global.length; i++) {
      loaded_meshes_global[i].forEach((element) => {
        if (element.name === 'Lwall') {
          element.isVisible = !element.isVisible;
        }
      });
    }
  };
  const LeftAwnings = () => {
    const isVisible = localStorage.getItem("LeftAwningWallsVisible") === "true";

    // Toggle the localStorage value
    localStorage.setItem("LeftAwningWallsVisible", isVisible ? "false" : "true");

    // Update the state to reflect the new value
    set_left_awning_checked(!isVisible);

    // Toggle the visibility of the left awning wall meshes
    if (leftawnings) {
      for (let i = 0; i < loaded_meshes_global.length; i++) {
        loaded_meshes_global[i].forEach((element) => {
          if (element.name === 'leanToLeftWalls') {
            element.isVisible = !element.isVisible;
          }
        });
      }
    }
  };


  const RightWalls = () => {
    const isVisible = localStorage.getItem("RightWallsVisible") === "true";

    // Toggle the localStorage value
    localStorage.setItem("RightWallsVisible", isVisible ? "false" : "true");

    // Update the state to reflect the new value
    set_right_checked(!isVisible);

    // Toggle the visibility of the right wall meshes
    for (let i = 0; i < loaded_meshes_global.length; i++) {
      loaded_meshes_global[i].forEach((element) => {
        if (element.name === 'Rwall') {
          element.isVisible = !element.isVisible;
        }
      });
    }
  };
  const RightAwnings = () => {
    const isVisible = localStorage.getItem("RightAwningWallsVisible") === "true";

    // Toggle the localStorage value
    localStorage.setItem("RightAwningWallsVisible", isVisible ? "false" : "true");

    // Update the state to reflect the new value
    set_right_awning_checked(!isVisible);

    // Toggle the visibility of the right awning wall meshes
    if (rightawnings) {
      for (let i = 0; i < loaded_meshes_global.length; i++) {
        loaded_meshes_global[i].forEach((element) => {
          if (element.name === 'leanToRightWalls') {
            element.isVisible = !element.isVisible;
          }
        });
      }
    }
  };


  return (
    <>
      <div className={`walls-container ${itemClass}`}>
        Total Bays: {Bays}
        <div className="field-box_walls">
          <span>Left Wall Openings</span>
          <hr />
          {<div className='checkbox_walls'>
            <input type="checkbox" onChange={LeftWalls} checked={isLeftWallChecked} />
            <label id='leftWalls'>Left Walls</label>
          </div>}

          <hr />
          {leftawnings &&
            <div className='checkbox_walls'>
              <input type="checkbox" onChange={LeftAwnings} checked={isLeftAwningWallChecked} />
              <label id='leftAwnings'>Left Awnings</label>
            </div>
          }
        </div>

        <div className="field-box_walls">
          <span>Right Wall Openings</span>
          <hr />
          {<div className='checkbox_walls'>
            <input type="checkbox" onChange={RightWalls} checked={isRightWallChecked} />
            <label id='rightWalls'>Right Walls</label>
          </div>}

          <hr />
          {rightawnings &&
            <div className='checkbox_walls'>
              <input type="checkbox" onChange={RightAwnings} checked={isRightAwningWallChecked} />
              <label id='rightAwnings'>Right Awnings</label>
            </div>}
        </div>

        {/* <span>Walls Openings</span>
        <div className="buttonBox">
             <button onClick={OpenAllLeftWalls} className="button">Open All Left Walls</button> 
             <button onClick={openAllRightWalls} className="button">Open All Right Walls</button> 
        </div> */}
        <>
          <div style={custom_button_scaling()} className="wall relative border border-red-500">
            <button style={{...custom_style_button(0, 'BWall'),  width: leftawnings || rightawnings ? '32%' : '59%', }} onClick={(e) => handleBottomWall(e, 0)} className="top" id={`bottom0`}>Top</button>
            <button style={{...custom_style_button(0, 'FWall'),  width: leftawnings || rightawnings ? '32%' : '59%',}} onClick={(e) => handleTopWall(e, 0)} className="bottom" id={`top0`}>Middle</button>
            {leftawnings &&
              <>
                <button className="left_awning_button" style={{...custom_style_button(0, 'leanToLeftWalls'), fontSize: '12px', fontWeight: 'bold', }} onClick={(e) => handleLeftAwningWalls(e, 0)} id={`LC0`}>LA</button>
                <button className="left_awning_top_button" style={{...custom_style_button(0, 'leanToLeftPartWallBack'), fontSize: '9.5px', fontWeight: 'bold', left: '27px'}} onClick={(e) => handleLeftAwningTopMidWalls(e, 0)} id={`LAW0`}>LAW</button>
                <button className="left_awning_bottom_button" style={{...custom_style_button(0, 'leanToLeftPartWall'), fontSize: '9.5px', fontWeight: 'bold', left: '27px'}} onClick={(e) => handleLeftAwningBottomMidWalls(e, 0)} id={`BLAW0`}>BLAW</button>
              </>
            }
            <button onClick={(e) => handleLeftWall(e, 0)} style={{...custom_style_button(0, 'Lwall'),  left: leftawnings? '72px': '50px'}} className="left" id={`left0`}>
              <p className="flex flex-col">
                <span>L</span>
                <span>e</span>
                <span>f</span>
                <span>t</span>
              </p>
            </button>
            <button onClick={(e) => handleRightWall(e, 0)} style={{...custom_style_button(0, 'Rwall'), right: rightawnings? '72px' : '50px'}} className="right" id={`right0`}>
              <p className="flex flex-col">
                <span>R</span>
                <span>i</span>
                <span>g</span>
                <span>h</span>
                <span>t</span>
              </p>
            </button>

            <button
              style={{
                //IDHRRR SE DAALNIII HE
                ...custom_style_button(0, 'col2'),
                width: leftawnings  ? '26px' : '42px', // Decrease width
                height: '20px', 
                position: 'absolute',
                bottom: '-10px',
                left: leftawnings ? '23.5%' : '3%', display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13.5px', // Font size adjusted
                overflow: 'hidden',
                padding: '0', 
              }}
              className="column-button"
              onClick={() => {
                toggleVisibility(1, col2State);
                setCol2State(prevState => !prevState); // Toggle the state
              }}
              id="col2"
            >
              (/)
            </button>

            <button
              style={{
                ...custom_style_button(0, 'col1'),
                width: rightawnings  ? '26px' : '42px',
                height: '20px',
                position: 'absolute',
                bottom: '-10px',
                right:  rightawnings ? '23.5%' : '1.5%', display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13.5px', // Font size adjusted
                overflow: 'hidden',
                padding: '0',
               
              }}
              className="column-button"
              onClick={() => {
                toggleVisibility(0, col1State);
                setCol1State(prevState => !prevState); // Toggle the state
              }}
              id="col1"
            >
              (/)
            </button>

            <button
              style={{
          //      ...custom_style_button(0, 'col3'),
                width: leftawnings  ? '26px' : '42px', // Decrease width
                height: '20px',
                position: 'absolute',
                top: '0',
                left: leftawnings ? '23.7%' : '3%', display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13.5px', // Font size adjusted
                overflow: 'hidden',
                padding: '0', 
              }}
              className="column-button"
              onClick={() => {
                toggleVisibility(2, col3State);
                setCol3State(prevState => !prevState); // Toggle the state
              }}
              id="col3"
            >
              (/)
            </button>
            
            <button
              style={{
       //         ...custom_style_button(0, 'col4'),
                width: rightawnings  ? '26px' : '42px',
                height: '20px',
                position: 'absolute',
                top: '0',
                right:  rightawnings ? '23%' : '1.5%', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13.5px', // Font size adjusted
                overflow: 'hidden',
                padding: 0,
              }}
              className="column-button"
              onClick={() => {
                toggleVisibility(3, col4State);
                setCol4State(prevState => !prevState); // Toggle the state
              }}
              id="col4"
            >
              (/)
            </button>


               
            {leftawnings && (
              <>
              
             <button
              style={{
                ...custom_style_button(0, 'leantoleftcolfront'),
                width: '22px', // Decrease width
                height: '20px', 
                position: 'absolute',
                bottom: '-10px',
                left:'0.5%' ,
                 display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13.5px', // Font size adjusted
                overflow: 'hidden',
                padding: '0', 
              }}
              className="column-button"
              onClick={() => {
                toggleVisibilityAwning(1, col12State);
                setCol12State(prevState => !prevState); // Toggle the state
              }}
              id="col12"
            >
              (/)
            </button>

            </>
            )}


            {rightawnings && (
              <>  
              <button
              style={{
                ...custom_style_button(0, 'leantorightcolfront'),
                width:'22px',
                height: '20px',
                position: 'absolute',
                bottom: '-10px',
                right:  '1%', display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13.5px', // Font size adjusted
                overflow: 'hidden',
                padding: '0',
               
              }}
              className="column-button"
              onClick={() => {
                toggleVisibilityAwning(0, col11State);
                setCol11State(prevState => !prevState); // Toggle the state
              }}
              id="col11"
            >
              (/)
            </button>
            </>
            )}


          {leftawnings && (
              <>
            <button
              style={{
               // ...custom_style_button(0, 'leantoleftcolfront'),
                width: '22px' , // Decrease width
                height: '20px',
                position: 'absolute',
                top: '0',
                left: '1%' , display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13.5px', // Font size adjusted
                overflow: 'hidden',
                padding: '0', 
              }}
              className="column-button"
              onClick={() => {
                toggleVisibility(2, col13State);
                setCol13State(prevState => !prevState); // Toggle the state
              }}
              id="col13"
            >
              (/)
            </button>
            </>
            )}


          {rightawnings && (
            <>  
               <button
              style={{
            //  ...custom_style_button(0, 'leantorightcolfront'),
                width: '22px' ,
                height: '20px',
                position: 'absolute',
                top: '0',
                right: '1%', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13.5px', // Font size adjusted
                overflow: 'hidden',
                padding: 0,
              }}
              className="column-button"
              onClick={() => {
                toggleVisibility(3, col14State);
                setCol14State(prevState => !prevState); // Toggle the state
              }}
              id="col14"
            >
              (/)
            </button>
            </>
            )}

        

            {/* display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px', // Font size adjusted
                overflow: 'hidden', */}

            {rightawnings &&
              <>
                <button className="right_awning_button" style={{...custom_style_button(0, 'leanToRightWalls'), fontSize: '12px', fontWeight: 'bold', }} onClick={(e) => handleRightAwningWalls(e, 0)} id={`RC0`}>RA</button>
                <button className="right_awning_top_button" style={{...custom_style_button(0, 'leanToRightPartWallBack'), fontSize: '9.5px', fontWeight: 'bold',}} onClick={(e) => handleRightAwningTopMidWalls(e, 0)} id={`RAW0`}>RAW</button>
                <button className="right_awning_bottom_button" style={{...custom_style_button(0, 'leanToRightPartWall'), fontSize: '9.5px', fontWeight: 'bold',}} onClick={(e) => handleRightAwningBottomMidWalls(e, 0)} id={`BRAW0`}>BRAW</button>
              </>
            }
            <p class="index" style={{ display: "block", color: 'black' }}>Back</p>
          </div>
        </>
        {Array.from({ length: Bays }, (_, index) => (
          index >= 2 &&
          <div style={custom_button_scaling()} className="wall relative border border-red-500">
            <div className="flex justify-center items-center space-x-4">
              {/* Left Middle Column (LMC) */}


              <button
                onClick={(e) => handlecolcenterLeft(e, index)}
                style={{
                  ...custom_style_button(index, 'colCenter2'),
                  width: leftawnings  ? '26px' : '42px', // Decrease width
                  height: '20px',    // Set your desired height
                  position: 'relative',
                  right: leftawnings && rightawnings ? '14.5px' : (leftawnings ? '26.5px'  : '74px'),  // New condition added
                  top: '4.6rem',
                   display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13.5px', // Font size adjusted
                  overflow: 'hidden', // Adjust the left position
                  padding: 0, 
                }}
                className="LEFTCOL"
                id={`colCenter2${index}`}
              >
                (/)
              </button>


              {leftawnings && (
              <>
              <button
                onClick={(e) => handlecolcenterLeftAwning(e, index)}
                style={{
                  ...custom_style_button(index, 'leantoleftcols'),
                  width: '22px', // Decrease width
                  height: '20px',    // Set your desired height
                  position: 'absolute',
                  left: '-5%', // Replacing right with left
                  top: '8.7rem',
                   display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13.5px', // Font size adjusted
                  overflow: 'hidden', // Adjust the left position
                  padding: 0, 
                }}
                className="LEFTCOL"
                id={`colCenter12${index}`}
              >
                (/)
              </button>
              </>
            )}



              {/* Bottom Button */}
              
          <button 
           style={{ ...custom_style_button(index, 'FWall'), width: leftawnings || rightawnings ? '32%' : '59%', marginLeft: '5px',display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
           onClick={(e) => handleTopWall(e, index)} className="bottom" id={`top${index}`}>
             <p style={{ margin: 0, textAlign: 'center' }}>Middle</p>  {/* Added textAlign and margin */}
           </button>


              {/* Right Middle Column (RMC) */}
              <button   
              onClick={(e) => handlecolcenterRight(e, index)}
              style={{
                ...custom_style_button(index, 'colCenter1'),
                width: rightawnings  ? '22px' : '42px', // Decrease width
                 height: '20px',    // Set your desired height
                position: 'relative',
                left: leftawnings && rightawnings ? '57px' : ( rightawnings ? '47.5px' :'85px'),
                top: '4.6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13.5px', // Font size adjusted
                overflow: 'hidden',// Adjust the left position
                padding: 0,
              }}
                className="RIGHTCOL"
                id={`colCenter1${index}`}
              >
                (/)
              </button>


              {rightawnings && (
              <>
              <button   
              onClick={(e) => handlecolcenterRightAwning(e, index)}
              style={{
                ...custom_style_button(index, 'leantorightcols'),
                width:'22px', // Decrease width
                 height: '20px',    // Set your desired height
                position: 'relative',
                left: leftawnings && rightawnings ? '79px' : ( rightawnings ? '71px' :'80px'),
                top: '4.6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13.5px', // Font size adjusted
                overflow: 'hidden',// Adjust the left position
                padding: 0,
              }}
                className="RIGHTCOL"
                id={`colCenter11${index}`}
              >
                (/)
              </button>
              </>
            )}





            </div>

            {/* Awning and Wall Buttons */}
            {leftawnings && (
              <>
                <button className="left_awning_button" onClick={(e) => handleLeftAwningWalls(e, index)} style={{...custom_style_button(index, 'leanToLeftWalls'),fontSize: '12px', fontWeight: 'bold'}} id={`LC${index}`}>LA</button>
                <button className="left_awning_bottom_button" onClick={(e) => handleLeftAwningBottomMidWalls(e, index)} style={{...custom_style_button(index, 'leanToLeftPartWall') ,fontSize: '9.5px', fontWeight: 'bold', left: '28.5px'}} id={`BLAW${index}`}>BLAW</button>
              </>
            )}


            

            <button onClick={(e) => handleLeftWall(e, index)} style={{...custom_style_button(index, 'Lwall'), left: leftawnings? '72px': '50px'}} className="left" id={`left${index}`}>
              <p className="flex flex-col">
                <span>L</span>
                <span>e</span>
                <span>f</span>
                <span>t</span>
              </p>
            </button>

            <button onClick={(e) => handleRightWall(e, index)} style={{...custom_style_button(index, 'Rwall'), right: rightawnings? '72px' : '50px'}} className="right" id={`right${index}`}>
              <p className="flex flex-col">
                <span>R</span>
                <span>i</span>
                <span>g</span>
                <span>h</span>
                <span>t</span>
              </p>
            </button>

            {rightawnings && (
              <>
                <button className="right_awning_button" onClick={(e) => handleRightAwningWalls(e, index)} style={{...custom_style_button(index, 'leanToRightWalls'), fontSize: '12px', fontWeight: 'bold'}} id={`RC${index}`}>RA</button>
                <button className="right_awning_bottom_button" onClick={(e) => handleRightAwningBottomMidWalls(e, index)} style={{...custom_style_button(index, 'leanToRightPartWall'), fontSize: '9.5px', fontWeight: 'bold', marginLeft: '-13px'}} id={`BRAW${index}`}>BRAW</button>
              </>
            )}

            <p className="index" style={{ display: "block", color: 'black' }}>
              {index === 0 ? 'Back' : index === 1 ? 'Front' : index}
            </p>
          </div>
        ))}



        {/* <hr
              style={{
                display: "flex",
                border: "1px solid black",
                width: "90%",
              }}
            />{" "} */}

        <>
          <div style={custom_button_scaling()} className="wall relative border border-red-500">
            {/* <button style={custom_style_button(1, 'BWall')} onClick={(e) => handleBottomWall(e, 1)} className="top" id={`bottom1`}>Top</button> */}
            <button style={{...custom_style_button(1, 'FWall'),  width: leftawnings || rightawnings ? '32%' : '59%',   marginTop: '-14px', }} onClick={(e) => handleTopWall(e, 1)} className="bottom" id={`top1`}>Bottom</button>
            {leftawnings && <>
              <button className="left_awning_button" onClick={(e) => handleLeftAwningWalls(e, 1)} style={{...custom_style_button(1, 'leanToLeftWalls'), fontSize: '12px', fontWeight: 'bold'}} id={`LC1`}>LA</button>
              <button className="left_awning_bottom_button" onClick={(e) => handleLeftAwningBottomMidWalls(e, 1)} style={{...custom_style_button(1, 'leanToLeftPartWall'), fontSize: '9.5px', fontWeight: 'bold', marginLeft:'22px'}} id={`BLAW1`}>BLAW</button>
            </>
            }
            <button onClick={(e) => handleLeftWall(e, 1)} style={{...custom_style_button(1, 'Lwall'),  left: leftawnings? '72px': '50px'}} className="left" id={`left1`}>
              <p className="flex flex-col">
                <span>L</span>
                <span>e</span>
                <span>f</span>
                <span>t</span>
              </p>
            </button>

 <button
  onClick={(e) => handleRightWall(e, 1)}
  style={{ ...custom_style_button(1, 'Rwall'), right: rightawnings ? '72px' : '50px' }}
  className="right"
  id={`right1`}
>
  <p className="flex flex-col">
    <span>R</span>
    <span>i</span>
    <span>g</span>
    <span>h</span>
    <span>t</span>
  </p>
</button>
            {rightawnings && <>
              <button className="right_awning_button" onClick={(e) => handleRightAwningWalls(e, 1)} style={{...custom_style_button(1, 'leanToRightWalls'), fontSize: '12px', fontWeight: 'bold'}} id={`RC1`}>RA</button>
              <button className="right_awning_bottom_button" onClick={(e) => handleRightAwningBottomMidWalls(e, 1)} style={{...custom_style_button(1, 'leanToRightPartWall'), fontSize: '9.5px', fontWeight: 'bold',}} id={`BRAW1`}>BRAW</button>
            </>
            }


          <div className="frontcolumn-container" style={{width: '100%', height: '100%' }}>
         {['colfront1', 'colfront2'].map((col, index) => (
    <>
      <button
        key={col} // Unique key for the first button
        style={{
          position: 'absolute',
          width: (() => {
            if (leftawnings && rightawnings) {
              return '26px';  // If both awnings are enabled
            } else if (leftawnings && index === 0) {
              return '26px';  // For button 1 if only left awning is enabled
            } else if (leftawnings && index === 1) {
              return '42px';  // For button 2 if only left awning is enabled
            } else if (rightawnings && index === 0) {
              return '42px';  // For button 1 if only right awning is enabled
            } else if (rightawnings && index === 1) {
              return '26px';  // For button 2 if only right awning is enabled
            } else {
              return '42px';  // Default case if neither awning is enabled
            }
          })(),
          height: '19px',
          bottom: '-9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13.5px',
          overflow: 'hidden',
          padding: 0,
          left: index === 0 ? (leftawnings ? '23%' : '5px') : 'auto',
          right: index === 1 ? (rightawnings ? '23%' : '5px') : 'auto',
        }}
        className="column-button"
        id={col}
      >
        (/)
      </button>

      {rightawnings && (
              <>
      <button
        key={`${col}-button2-${index}`} // Unique key for the second button
        style={{
          position: 'absolute',
          width: '22px',
          height: '19px',
          bottom: '-9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13.5px',
          overflow: 'hidden',
          padding: 0,
          right: '0.5%' ,
          backgroundColor: 'white',
        }}
        className="column-button"
        id={col}
      >
        (/)
      </button>

      </>
            )}


        {leftawnings && (
              <>
      <button
        key={`${col}-button1-${index}`} // Unique key for the second button
        style={{
          position: 'absolute',
          width: '22px',
          height: '19px',
          bottom: '-9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13.5px',
          overflow: 'hidden',
          padding: 0,
          left: '0.5%' ,
          backgroundColor: 'white', 
        }}
        className="column-button"
        id={col}
      >
        (/)
      </button>

      </>
            )}


    </>
  ))}

</div>

            <p class="index" style={{ display: "block", color: 'black' }}>Front</p>
          </div>
        </>
      </div>

    </>
  );
};

export default WallsMenu;
