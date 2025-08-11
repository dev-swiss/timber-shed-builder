import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { useDoorDetails } from './DoorDetailsContext';
import DoorDetails from './DoorDetails';
import { useOpeningDetails } from '../../OpeningDetailsContext';
import { useskylightdetail } from '../skylight/skylight';

var loaded_meshes = [];
var id = 0;
export const meshLoaderFrontAwning = (loadedMeshes) => {
  loaded_meshes = loadedMeshes;
  return loaded_meshes;
};

const PADoorMenu = ({ itemClass }) => {
  const { doors, setDoors, addDoorInstance, toggleDoorOpen, doorInstances, isAnydDialogInUse } = useDoorDetails();
 
  const { openingInstances, cutStates, setCutStates } = useOpeningDetails(); 
 const isAnyOpeningInUse = openingInstances.some(instance => instance && instance.id && !(cutStates[instance.id] ?? false));

 console.log("Opening Instances:", openingInstances);
 console.log("Cut States:", cutStates);

 const {skyopeningInstances, skylightStates, setskylightStates } = useskylightdetail(); 
 const isAnySkylightInUse = skyopeningInstances.some(instance => instance && instance.id && !(skylightStates[instance.id] ?? false));


  const handleDoorInitial = () => {
    if (isAnyOpeningInUse) {
      alert("Please complete the current opening process before creating a new door.");
      return;
    }
    // if (isAnySkylightInUse) {
    //   alert("Please complete the current skylight before creating a new door.");
    //   return;
    // }

    if (isAnydDialogInUse) {
      alert("Please complete the current door process before creating a new one.");
      return;
    }
    setDoors(prevState => {
      if (doorInstances.length === 0 ) {
          addDoorInstance();
      } else {
        toggleDoorOpen(doorInstances[0].id);
      }
      return true;
    });

  };

  return (
    <div className={`barn-door-container ${itemClass}`}>
      <button onClick={handleDoorInitial} className="opening">
        <FontAwesomeIcon icon={faSquarePlus} style={{ fontSize: "5rem" }} />
        P.A. Doors
      </button>
      {doors && doorInstances.length > 0 && (
        <button onClick={() => {
          // Add new door instance only if no opening is in use
          if (isAnyOpeningInUse) {
        alert("An opening is in use. Cannot create a new door.");
      } 
      // else if (isAnySkylightInUse) {
      //   alert("A skylight is already in use. Cannot create a new door.");
      // }
       else {
        // If neither is in use, proceed to add a new door instance
        addDoorInstance();
      }
        }} className="add-dialogue">
          Add Dialogue
        </button>
      )}
    </div>
  );
};


export default PADoorMenu;