import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { useOpeningDetails } from "../../OpeningDetailsContext";
import "./ExtrasMenu.css";
import { useDoorDetails } from "../PADoor/DoorDetailsContext";
 import { useskylightdetail} from "../skylight/skylight";


var loaded_meshes = [];
var id = 0;
export const meshLoaderFrontAwning = (loadedMeshes) => {
  loaded_meshes = loadedMeshes;
  return loaded_meshes;
};
const ExtrasMenu = ({ itemClass }) => {
  const {
    openings,
    setOpenings,
    addOpeningInstance,
    toggleInstanceOpen,
    openingInstances,
    isAnyDialogInUse,
    setIsAnyDialogInUse,
  } = useOpeningDetails();
  // const {skyopeningInstances  } = useskylightdetail(); 
  const {doorInstances, unionStates, setUnionStates } = useDoorDetails(); 

  const isAnyDoorInUse = doorInstances.some(instance => instance && instance.id && !(unionStates[instance.id] ?? false));

  const {skyopeningInstances, skylightStates, setskylightStates } = useskylightdetail(); 
  const isAnySkylightInUse = skyopeningInstances.some(instance => instance && instance.id && !(skylightStates[instance.id] ?? false));

  const handleOpenInitial = () => {
    if (isAnyDoorInUse) {
      alert("Please complete the current door process before creating a new opening.");
      return;
    }
    // if (isAnySkylightInUse) {
    //   alert("Please complete the current skylight opening process before creating a new opening.");
    //   return;
    // }
    if (isAnyDialogInUse) {
        // Allow refreshing if a dialog is in use without changes
        const openInstance = openingInstances.find(instance => instance.isOpen);
        if (openInstance) {
            // Close the unmodified instance
            toggleInstanceOpen(openInstance.id); // Close the current instance
        }
    }

    // Proceed to open a new instance
    setOpenings(true); // Open a new instance
};

  const handleAddDialogue = () => {
    
    if (isAnyDoorInUse) {
      alert("Please complete the current door process before creating a new opening.");
      return;
    }
    // if (isAnySkylightInUse) {
    //   alert("Please complete the current skylight opening before creating a new opening.");
    //   return;
    // }

    if (isAnyDialogInUse) {
      alert("Please finish using the current dialog.");
      return;
    }
    addOpeningInstance(); // Add a new opening instance
    setIsAnyDialogInUse(true); // Set dialog as in use

  }; 

  return (
    <div className={`extras-container ${itemClass}`}>
      <button onClick={handleOpenInitial} className="opening">
        <FontAwesomeIcon icon={faSquarePlus} style={{ fontSize: "5rem" }} />
        Openings
      </button>
      {openings && !isAnyDialogInUse && (
        <button onClick={handleAddDialogue} className="add-dialogue">
          Add Dialogue
        </button>
      )}
    </div>
  );
};
export default ExtrasMenu;
