import React, { useState } from "react";
import OpeningDetails from "./OpeningDetails";
import { useOpeningDetails } from "./OpeningDetailsContext";

import './rightbar.css';
import { useskylightdetail } from "./Extras/skylight/skylight";
import Skylightdetail from "./Extras/skylight/skylightdetail";

import DoorDetails from "./Extras/PADoor/DoorDetails";
import { useDoorDetails } from "./Extras/PADoor/DoorDetailsContext";

const RightSidebar = () => {
  const { openingInstances } = useOpeningDetails();
  const { doorInstances } = useDoorDetails();
  const {  skyopeningInstances } = useskylightdetail();
  const [isHovered, setIsHovered] = useState(false);
  const [lockedStates, setLockedStates] = useState({}); // Store lock states for each opening instance

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    if (!Object.values(lockedStates).some((locked) => locked)) {
      setIsHovered(false); // Only hide if no instances are locked
    }
  };

  const toggleLock = (id) => {
    setLockedStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggle the specific instance lock state
    }));
  };

  return (
    <div
      className={`right-sidebar ${( openingInstances.some((instance) => instance.isOpen) ||skyopeningInstances.some((instance) => instance.isOpen) || doorInstances.some((door) => door.isOpen)) ? "open" : ""
        } ${isHovered ? "hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {openingInstances
        .filter((instance) => instance.isOpen)
        .map((instance) => (
          <OpeningDetails
            key={instance.id}
            id={instance.id}
            onLockChange={() => toggleLock(instance.id)} // Pass lock toggle handler
            isLocked={lockedStates[instance.id] || false} // Pass the lock state
          />
        ))}

      {doorInstances
        .filter((door) => door.isOpen)
        .map((doors) => (
          <DoorDetails
           key={doors.id} 
           id={doors.id}
           onLockChange={() => toggleLock(doors.id)}
           isLocked={lockedStates[doors.id]||false}
            />
        ))}  
        {skyopeningInstances
          .filter((instance) => instance.isOpen)
        .map((instance) => (
          <Skylightdetail
            key={instance.id}
            id={instance.id}
            onLockChange={() => toggleLock(instance.id)} // Pass lock toggle handler
            isLocked={lockedStates[instance.id] || false} // Pass the lock state
          />
        ))}
    </div>
  );
};

export default RightSidebar;
