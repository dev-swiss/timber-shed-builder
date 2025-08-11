import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus  } from "@fortawesome/free-solid-svg-icons";
import { faWindowMaximize  } from "@fortawesome/free-solid-svg-icons";
// import "./ExtrasMenu.css";
import { useDoorDetails } from "../PADoor/DoorDetailsContext";
import { useskylightdetail} from "../skylight/skylight";
import { useOpeningDetails } from '../../OpeningDetailsContext';

var loaded_meshes = [];
var id = 0;
export const meshLoaderFrontAwning = (loadedMeshes) => {
  loaded_meshes = loadedMeshes;
  return loaded_meshes;
};
const Skylightmenu = ({ itemClass }) => {
  const {
    skyopenings,
    setskyOpenings,
    addOpeningInstance,
    toggleInstanceOpen,
   // openingInstances,
    isAnyDialogInUse,
    setIsAnyDialogInUse,
  } = useskylightdetail();
   const {skyopeningInstances  } = useskylightdetail(); 

   const {doorInstances, unionStates, setUnionStates } = useDoorDetails(); 
  const isAnyDoorInUse = doorInstances.some(instance => instance && instance.id && !(unionStates[instance.id] ?? false));

 const { openingInstances, cutStates, setCutStates } = useOpeningDetails(); 
 const isAnyOpeningInUse = openingInstances.some(instance => instance && instance.id && !(cutStates[instance.id] ?? false));

  const handleOpenInitial = () => {
     if (isAnyDoorInUse) {
       alert("Please complete the current door process before creating a new opening.");
       return;
     }
     if (isAnyOpeningInUse) {
      alert("Please complete the current opening process before creating a new skylight.");
      return;
    }
    if (isAnyDialogInUse) {
        // Allow refreshing if a dialog is in use without changes
        const openInstance = skyopeningInstances.find(instance => instance.isOpen);
        if (openInstance) {
            // Close the unmodified instance
            toggleInstanceOpen(openInstance.id); // Close the current instance
        }
    }

    // Proceed to open a new instance
    setskyOpenings(true); // Open a new instance
};

  const handleAddDialogue = () => {
    
     if (isAnyDoorInUse) {
       alert("Please complete the current door process before creating a new opening.");
       return;
     }

    if (isAnyDialogInUse) {
      alert("Please finish using the current dialog.");
      return;
    }
    if (isAnyOpeningInUse)
      {
        alert("Pease complete finishing the current opening before opening new skylight")
      }
    addOpeningInstance(); // Add a new opening instance
    setIsAnyDialogInUse(true); // Set dialog as in use

  }; 

  return (
    <div className={`extras-container ${itemClass}`}>
      <button onClick={handleOpenInitial} className="opening">
        <FontAwesomeIcon icon={faSquarePlus } style={{ fontSize: "5rem" }} />
         Skylight
      </button>
      {skyopenings && !isAnyDialogInUse && (
        <button onClick={handleAddDialogue} className="add-dialogue">
        Add Dialogue
        </button>
      )}
    </div>
  );
};
export default Skylightmenu;
