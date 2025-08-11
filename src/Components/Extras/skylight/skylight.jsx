import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  CSG,
  StandardMaterial,
  Color3,
  Mesh,
  HighlightLayer,
  Vector3,
} from "@babylonjs/core";
import { setup_extras ,ColorMesh } from "../../../core/coreFunctions";
import { calculateBoundingBoxDimensionsAndPosition } from '../../../core/coreFunctions';
import pitchData from "./../../../pitch/roofPitch.json";
import { Quaternion, } from "@babylonjs/core";
import { PickingInfo } from "babylonjs";
import { RoofconfigUtility } from "../../../core/Pitchconfig";

const skylightcontext = createContext();
var loaded_meshes = [];
var id = 0;
var bay = [];
var element = [];

export const skymeshLoaderopening = (loadedMeshes) => {
  loaded_meshes = loadedMeshes;
  return loaded_meshes;
};

export const Skylightprovider = ({ children }) => {
  
  
//  console.log(pitch)
  const [skyopenings, setskyOpenings] = useState(false);
  const [cutStates, setCutStates] = useState(false);
  const [skylightStates, setskylightStates] = useState(false);


// const [sizes] = useState([{ width: 920, height: 2040 }]);
const delay = 50;
let lastEventTime = 0;
let pointerMoveTimeout = null;
const [skyopeningInstances, setskyOpeningInstances] = useState([]);
const [skydialogInstances, setskyDialogInstances] = useState({});
const [isAnyDialogInUse, setIsAnyDialogInUse] = useState(false);
const [boxInstances, setBoxRefInstances] = useState([]);
const selectedMesh = useRef({});
const originalMeshState = useRef({});
const hl = useRef(null);
const originalNamesRef = useRef(new Map());
const data = setup_extras();
const highlightedMeshes = useRef(new Set()); 
const [selectedPitch, setSelectedPitch] = useState("1"); 
useEffect(() => {
  if (data && data[0]) {
    hl.current = new HighlightLayer("hl", data[0].current);
    // console.log("pitchData",pitchData)
  }
}, [data]);


const rRoofPitchAdjustments = {
  1: { x: 0.1, y: -1, z: 0.1 },
  2: { x: 0.1, y: 0.15, z: 0.15 },
  3: { x: 0.2, y: 0.2, z: 0.18 },
  4: { x: 0.25, y: 0.25, z: 0.18 },
  5: { x: 0, y: 0, z: 0 },
  // 
  6: { x: 0, y: 0, z: 0 },
  7: { x: 0, y: 0, z: 0.2 },
  8: { x: 0, y: -0.9, z: 0. },
  9: { x: 0, y: -0.1, z: 0 },
  10: { x: -0.3, y: -0.3, z: 0.24 },
  // 
  11: { x: -0.6, y: -0.6, z: 0.26 },
  12: { x:-0.9, y: -0.9, z: 0.26 },
  13: {  x: -0.9, y: -0.9, z: 0.2 },
  14: { x: 0.75, y: 0.75, z: 0.28 },
  15: { x: -1, y: -1, z: 0.2 },

  ///
  16: {x: -1.1, y: -1.1, z: 0.3 },
  17: {x: -1.2, y: -1.2 ,z: 0.3 },
  18: { x: -1.1, y: -1.2 ,z: 0.32 },
  19: { x: -1.1, y: -1.2, z: 0.32 },
  // 
  20: { x: -1.1, y: -1.2, z: 0.34 },
  21: {x: -1.1, y: -1.2, z: 0.34 },
  22: { x: -1.1, y: -1.2, z: 0.34 },
  //
  23: { x: -1.1, y: -1.2, z: 0.36 },
  24: { x: -1.1, y: -1.2, z: 0.38 },
  25: { x: -1.3, y: -1.4, z: 0.38 },
  26: { x: -1.3, y: -1.4, z: 0.4 },
  27: { x: -1.3, y: -1.4, z: 0.4 },
  28: {  x: -1.3, y: -1.4, z: 0.4 },
  29: {  x: -1.6, y: -1.9, z: 0.4 },
  //
  30: {  x: -1.6, y: -1.9,z: 0.4 },
  31: {  x: -1.6, y: -1.9, z: 0.4 },
  32: {  x: -1.6, y: -2, z: 0.4 },
  33: { x: -1.9, y: -2.3, z: 0.4 },
  //
  34: { x:-1.9, y: -2.5, z: 0.4 },
  35: { x: -1.9, y: -2.6,z: 0.4 },
  36: { x:-2.1, y: -2.6, z: 0.4 },
  37: { x:-2.1, y: -2.7, z: 0.4 },
  38: { x:-2.1, y: -2.7, z: 0.4 },
  39: { x:-2.1, y: -2.9, z: 0.4 },
  //x:-2.1,
  40: {x:-2.1,y: -3.1, z: 0.4 },
  41: { x:-2.1, y: -3.3, z: 0.4 },
  42: { x:-2.1, y: -3.3, z: 0.4 },
  43: { x:-2.1, y: -3.4, z: 0.4 },
  44: { x:-2.1, y: -3.4, z: 0.4 },
  45: { x:-2.1, y: -3.5, z: 0.4 }
};
const pitchAdjustments = {
  1: { x: 0.1, y: -0.1, z: 0.1 },
  2: { x: 0.1, y: -0.15, z: 0.15 },
  3: { x: 0.2, y: -0.2, z: 0.18 },
  4: { x: 0.25, y: -0.25, z: 0.18 },
  5: { x: 0.3, y: -0.3, z: 0.2 },
  // 
  6: { x: 0.35, y: -0.35, z: 0.2 },
  7: { x: 0.4, y: -0.4, z: 0.22 },
  8: { x: 0.45, y: -0.45, z: 0.22 },
  9: { x: 0.5, y: -0.5, z: 0.24 },
  10: { x: 0.55, y: -0.55, z: 0.24 },
  // 
  11: { x: 0.6, y: -0.6, z: 0.26 },
  12: { x: 0.65, y: -0.65, z: 0.26 },
  13: { x: 0.7, y: -0.7, z: 0.28 },
  14: { x: 0.75, y: -0.75, z: 0.28 },
  15: { x: 0.5, y: -0.7, z: 0.2 },
  16: { x: 0.85, y: -0.9, z: 0.3 },
  17: { x: 0.9, y: -1.0, z: 0.3 },
  18: { x: 0.95, y: -1.2, z: 0.32 },
  19: { x: 0.9, y: -1.3, z: 0.32 },
  // 
  20: { x: 0.9, y: -1.0, z: 0.34 },
  21: { x: 0.9, y: -1.0, z: 0.34},
  22: {x: 0.9, y: -1.2, z: 0.34 },
  //
  23: { x: 0.8, y: -1.3, z: 0.36 },
  24: { x: 1.25, y: -1.4, z: 0.38 },
  25: { x: 1.3, y: -1.5, z: 0.38 },
  26: { x: 1.35, y: -1.6, z: 0.4 },
  27: { x: 1.4, y: -1.7, z: 0.4 },
  28: { x: 1.45, y: -1.7, z: 0.4 },
  29: { x: 1.5, y: -1.9 , z: 0.4 },
  //
  30: { x: 1.6, y: -2.3, z: 0.4  },
  31: { x: 1.6, y: -2.3, z: 0.4 },
  32: { x: 1.6, y: -2.3, z: 0.4  },
  33: {x:  1.6, y: -2.3, z: 0.4 },
  //
  34: { x: 1.75, y: -2.3, z: 0.4 },
  35: { x: 1.8, y: -2.8, z: 0.4 },
  36: { x: 1.85, y: -2.8, z: 0.4 },
  37: { x: 1.9, y: -2.9, z: 0.4 },
  38: { x: 1.95, y: -3.0, z: 0.4 },
  39: { x: 2.0, y: -3.1, z: 0.4 },
  40: { x: 2.05, y: -3.2, z: 0.4 },
  41: { x: 2.1, y: -3.4, z: 0.4 },
  42: { x: 2.15, y: -3.5, z: 0.4 },
  43: { x: 2.2, y: -3.5, z: 0.4 },
  44: { x: 2.25, y: -3.5, z: 0.4 },
  45: { x: 2.2, y: -3.5, z: 0.4 }
}

useEffect(() => {
  if (skyopenings) {
      const handlePointerDown = (evt, pickResult) => {
          const pickInfo = data[0].current.pick(data[0].current.pointerX, data[0].current.pointerY);
          if (pickInfo.hit) {
              console.log("Picked Mesh Name:", pickInfo.pickedMesh.name);

              if (isValidMeshForBox(pickInfo.pickedMesh)) {
                  selectedMesh.current = pickInfo.pickedMesh;

                  const openingInstance = skyopeningInstances.find(
                      (d) => d.isOpen && !boxInstances.some((box) => box.id === d.id && box.selectedMesh)
                  );

                  if (!openingInstance) {
                      console.log("No open instance found.");
                      return;
                  }

                  const id = openingInstance.id;
                  selectedMesh.current[id] = pickInfo.pickedMesh;

                  console.log("Picked Mesh:", pickInfo.pickedMesh.name, pickInfo.pickedMesh.id);
                  console.log("Found open instance: ", openingInstance);

                  // Create and configure new box
                  const newBox = Mesh.CreateBox("box", 0.5, data[0].current);
                  const redMat = new StandardMaterial("redMat", data[0].current);
                  redMat.diffuseColor = new Color3(0, 1, 1);
                  redMat.alpha = 0.7;
                  newBox.material = redMat;

                  // Set box position on the picked mesh
                  const boundingInfo = pickInfo.pickedMesh.getBoundingInfo();
                  pickInfo.pickedMesh.setPivotPoint(new Vector3 (0,0,0))
                  const center = boundingInfo.boundingBox.centerWorld;
                  newBox.position.copyFrom(center); // Reset position to center of the mesh

                  // Apply adjustments based on roof type
                  const isLeftRoof = pickInfo.pickedMesh.name.includes("lRoof");
                  const isRightRoof = pickInfo.pickedMesh.name.includes("rRoof");
                  let adjustments = isLeftRoof ? pitchAdjustments[selectedPitch] : rRoofPitchAdjustments[selectedPitch];

                  newBox.position.addInPlace(new Vector3(adjustments.x, adjustments.y, adjustments.z));
                  console.log(`Box created and positioned for pitch ${selectedPitch}:`, newBox.position);

                  newBox.isVisible = true;

                  const pitchConfig = pitchData[selectedPitch];
                  if (!pitchConfig) {
                      console.error("Invalid pitch configuration for pitch:", selectedPitch);
                      return;
                  }

                  if (isLeftRoof) {
                      applyLeftRoofConfiguration(newBox, pitchConfig);
                  } else if (isRightRoof) {
                      applyRightRoofConfiguration(newBox, pitchConfig);
                  }

                  const boxInstance = {
                      id: openingInstance.id,
                      box: newBox,
                      selectedMesh: pickInfo.pickedMesh,
                  };

                  // Update box instance state
                  setBoxRefInstances((prevBoxes) => {
                      const boxExists = prevBoxes.some((box) => box.id === boxInstance.id);
                      if (!boxExists) {
                          console.log("Box instance created and added:", boxInstance);
                          return [...prevBoxes, boxInstance];
                      }
                      return prevBoxes.map((box) =>
                          box.id === boxInstance.id
                              ? { ...box, box: newBox, selectedMesh: pickInfo.pickedMesh }
                              : box
                      );
                  });

                  hl.current.removeAllMeshes();

                  // Save original state if not already saved
                  if (!originalMeshState.current[id]) {
                      originalMeshState.current[id] = {
                          mesh: pickInfo.pickedMesh,
                          position: pickInfo.pickedMesh.position.clone(),
                          scaling: pickInfo.pickedMesh.scaling.clone(),
                          rotation: pickInfo.pickedMesh.rotation.clone(),
                          material: pickInfo.pickedMesh.material.clone(),
                          visibility: pickInfo.pickedMesh.isVisible,
                      };
                      console.log(`Original state saved for ID ${id}`);
                  }

                  console.log("Saved original state for selected mesh:", originalMeshState.current[openingInstance.id]);
              } else {
                  console.log("No valid mesh selected.");
              }
          }
      };

      data[0].current.onPointerDown = handlePointerDown;

      return () => {
          data[0].current.onPointerDown = null;
      };
  }
}, [skyopenings, data, skyopeningInstances, setBoxRefInstances, selectedPitch]);
useEffect(() => {
  const interval = setInterval(() => {
    const storedPitch = localStorage.getItem('pitch');
    if (storedPitch) {
      setSelectedPitch(storedPitch);
    }
  }, 1000); // Check every second

  return () => clearInterval(interval);
}, []);

// Helper functions for left and right roof configurations

// Helper functions for left and right roof configurations
const applyLeftRoofConfiguration = (box, pitchConfig) => {
  if (!pitchConfig || !pitchConfig.leftRoofMesh) {
      console.error("Invalid pitch configuration for left roof:", pitchConfig);
      return;
  }
  RoofconfigUtility(selectedPitch, box);
    console.log(`Left roof box positioned for pitch ${selectedPitch}:`, box.position);
  const { rotation, position } = pitchConfig.leftRoofMesh;

  // Initial rotation from config
  box.rotation.set(rotation[0], rotation[1], rotation[2]);
  console.log("Initial rotation of box (left roof, radians):", box.rotation);

  // Adjust the rotation on the x-axis based on pitch
  const xAdjustment = pitchConfig.angleX || 0;
  box.rotation.x += xAdjustment;

  // Adjust the rotation on the y-axis for alignment
  const yAdjustment = pitchConfig.angleY || 0; // Adjust this value to align parallel
  box.rotation.y += yAdjustment;

  // Optionally adjust the z-axis if needed
  const zAdjustment = pitchConfig.angleZ || 0; // Adjust this value if the roof has a tilt
  box.rotation.z += zAdjustment;

  console.log("Adjusted rotation of box (left roof, radians):", box.rotation);

  // Adjust the box position based on pitch configuration
  box.position.addInPlace(new Vector3(position.x, position.y, position.z));
  console.log("Final Position of box (left roof):", box.position);
};

const applyRightRoofConfiguration = (box, pitchConfig) => {
    if (!pitchConfig || !pitchConfig.rightRoofMesh) {
        console.error("Invalid pitch configuration for right roof:", pitchConfig);
        return;
    }
    RoofconfigUtility(selectedPitch, box);
    console.log(`Left roof box positioned for pitch ${selectedPitch}:`, box.position);

    const { rotation, position } = pitchConfig.rightRoofMesh;

    // Initial rotation from config
    box.rotation.set(rotation[0], rotation[1], rotation[2]);
    console.log("Initial rotation of box (right roof, radians):", box.rotation);

    // Adjust the rotation on the x-axis based on pitch
    const xAdjustment = pitchConfig.angleX || 0;
    box.rotation.x += xAdjustment;

    // Adjust the rotation on the y-axis for alignment
    const yAdjustment = pitchConfig.angleY || 0; // Adjust this value to align parallel
    box.rotation.y += yAdjustment;

    // Optionally adjust the z-axis if needed
    const zAdjustment = pitchConfig.angleZ || 0; // Adjust this value if the roof has a tilt
    box.rotation.z += zAdjustment;

    console.log("Adjusted rotation of box (right roof, radians):", box.rotation);

    // Adjust the box position based on pitch configuration
    box.position.addInPlace(new Vector3(position.x, position.y, position.z));
    console.log("Final Position of box (right roof):", box.position);
};


const addOpeningInstance = useCallback(() => {
  // Check if any dialog is in use
  if (isAnyDialogInUse) {
    return;
  }

  const newId = Date.now().toString();  // Generate a new unique ID

  // Create a new box object with a placeholder for `box`
  const newBox = {
    id: newId,  // Use the newId here to associate it with the opening instance
    box: null,  // Initially, set box to null, it will be updated later
    selectedMesh: null,
  };

  // Create a new opening instance
  const newInstance = {
    id: newId,
    positionX: 0,
    positionY: 6,
    positionZ:0,
    isOpen: true,
  };

  // Update opening instances state
  setskyOpeningInstances(prevInstances => [
    ...prevInstances,
    newInstance,
  ]);

  // Update box references state
  setBoxRefInstances(prevBoxes => {
    // Update the existing box or add a new one
    const updatedBoxes = prevBoxes.map(box => {
      if (box.id === newId) {
        return { ...box, box: newBox.box };  // Update the existing box
      }
      return box;
    });

    // If no existing box was found, add the new box instance
    if (!updatedBoxes.some(box => box.id === newId)) {
      updatedBoxes.push(newBox);  // Push the newly created box
    }

    return updatedBoxes; // Return the updated boxes array
  });

  // Update dialog instances state
  setskyDialogInstances(prevDialogs => ({
    ...prevDialogs,
    [newId]: {
      id: newId,
      isAnyDialogInUse: true,
      handleWidth: (value) => handleWidth(newId, value),
      handleHeight: (value) => handleHeight(newId, value),
      handlePositionY: (value) => handlePositionY(newId, value),
      handlePositionZ:(value) => handlePositionZ(newId, value),
      handlePositionX:(value) => handlePositionX(newId, value),
      handleCut: () => handleCut(newId),
      handleClose: () => handleClose(newId),
    },
  }));

  setIsAnyDialogInUse(true); // Set the dialog usage state to true

}, [isAnyDialogInUse]);

const toggleInstanceOpen = useCallback((id) => {
  setskyOpeningInstances(prevInstances =>
    prevInstances.map(instance =>
      instance.id === id
        ? { ...instance, isOpen: !instance.isOpen }
        : instance
    )
  );

  // Toggle dialog state
  setskyDialogInstances(prevDialogs => ({
    ...prevDialogs,
    [id]: {
      ...prevDialogs[id],
      isAnyDialogInUse: !skydialogInstances[id]?.isAnyDialogInUse,
    },
  }));

  // If toggling off, reset the dialog state
  if (skydialogInstances[id]?.isAnyDialogInUse) {
    setIsAnyDialogInUse(false);
  }
}, [skydialogInstances]);
const handleClose = useCallback((id) => {
if (!id) {
    console.error('ID is not provided');
    return;
}

const currentBox = boxInstances.find((box) => box.id === id);
if (!currentBox) {
    return;
}

const pointerMoveBackup = data[0].current.onPointerMove;
data[0].current.onPointerMove = null;

const originalMesh = originalMeshState.current[id]?.mesh;
if (!originalMesh) {
    return;
}

// Restore the original mesh name here
const originalName = originalMeshState.current[id]?.name; 
if (originalName) {
    originalMesh.name = originalName;
    console.log("RESTORED NAME", originalName); 
}

// Check if the mesh has cuts; this is a placeholder condition
const hasCut = currentBox.box?.hasCut;

// If there's no cut, restore the original mesh properties
if (!hasCut) { 
    originalMesh.position.copyFrom(originalMeshState.current[id].position);
    originalMesh.scaling.copyFrom(originalMeshState.current[id].scaling);
    originalMesh.rotation.copyFrom(originalMeshState.current[id].rotation);
    originalMesh.material = originalMeshState.current[id].material;
    originalMesh.isVisible = originalMeshState.current[id].visibility;
    originalMesh.refreshBoundingInfo();
    console.log("Restored Mesh Name:", originalMesh.name);
} else {
    console.log(`Mesh ID ${id} has cuts and will not be restored to original properties.`);
}

// Remove highlight from restored mesh
if (hl.current && highlightedMeshes.current.has(originalMesh)) {
    hl.current.removeMesh(originalMesh);
    highlightedMeshes.current.delete(originalMesh);
    hl.current.removeAllMeshes();
    data[0].current.markAllMaterialsAsDirty(BABYLON.Constants.MATERIAL_AllDirtyFlag);
}

// Dispose the temporary modified mesh if it exists
if (selectedMesh.current[id] && selectedMesh.current[id] !== originalMesh) {
    selectedMesh.current[id].dispose();
    selectedMesh.current[id] = null; // Clear reference to avoid reusing disposed mesh
}

if (currentBox.box) {
    currentBox.box.dispose();
    currentBox.box = null;
}

setskyOpeningInstances((prevInstances) => prevInstances.filter((instance) => instance.id !== id));
setBoxRefInstances((prevBoxes) => prevBoxes.filter((box) => box.id !== id));
setskyDialogInstances((prevDialogs) => {
    const { [id]: removedDialog, ...remainingDialogs } = prevDialogs;
    return remainingDialogs;
});

setIsAnyDialogInUse(false);

data[0].current.onPointerMove = pointerMoveBackup;
console.log('Pointer move re-enabled after mesh restoration.');
}, [boxInstances, originalMeshState]);


const isValidMeshForBox = useCallback((mesh) => {
// const isValid = mesh instanceof BABYLON.Mesh && mesh.isVisible && mesh.name !== "";
// console.log("Validating Mesh:", mesh.name, "Is Valid:", isValid);

return (
  mesh &&
  ![
    "fTop","BTop",
     "fRoof",
     "Lwall","FWall","Rwall","BWall",
    "groundTile",
    "ground",
    "skyBox",
    "fGround",
    "bGround",
    "Left",
    "Right",
    "arrow",
    "plane",
    "bLogo",
    "Barrow",
    "Larrow",
    "leftArrow",
    "front",
    "fLogo",
    "leftplane",
    "rightplane",
    "back",
  ].includes(mesh.name) &&
  !mesh.isUsed
);
}, []);

const handleWidth = useCallback((id, value) => {
const newWidth = parseFloat(value);

if (isNaN(newWidth) || newWidth < 1 || newWidth > 10) {
    console.error("Invalid width value:", value);
    return;
}

const currentBox = boxInstances.find((box) => box.id === id);
if (!currentBox) return;

const currentMesh = currentBox.selectedMesh || selectedMesh.current;

if (!currentMesh) return;

const boundingBox = calculateBoundingBoxDimensionsAndPosition(currentMesh);
const originalMeshDepth = boundingBox.dimensions.z;
const boxPositionZ = currentBox.box.position.z;

const halfNewWidth = newWidth / 2;
const boxMinZ = boundingBox.position.z - originalMeshDepth / 2;
const boxMaxZ = boundingBox.position.z + originalMeshDepth / 2;

const boxFrontZ = boxPositionZ + halfNewWidth;
const boxBackZ = boxPositionZ - halfNewWidth;

if (boxBackZ < boxMinZ) {
    console.warn("Box width adjustment exceeds mesh bounds at the back.");
    return;
} else if (boxFrontZ > boxMaxZ) {
    console.warn("Box width adjustment exceeds mesh bounds at the front.");
    return;
}

setskyOpeningInstances((prevInstances) =>
    prevInstances.map((instance) =>
        instance.id === id ? { ...instance, width: newWidth } : instance
    )
);

if (currentMesh.name.includes("rRoof") || currentMesh.name.includes("BWall")) {
    currentBox.box.scaling.z = newWidth;
} else if (currentMesh.name.includes("lRoof") || currentMesh.name.includes("LWall")) {
    currentBox.box.scaling.z = newWidth;
}

console.log(`Updated width for box ID: ${id} to ${newWidth}`);
}, [boxInstances, selectedMesh]);


const handleHeight = useCallback((id, value) => {
const newHeight = parseFloat(value);
const currentBox = boxInstances.find((box) => box.id === id);
const currentMesh = selectedMesh.current;

if (!currentBox || !currentBox.box || !currentBox.box.scaling) {
    console.error(`Box properties are undefined for ID: ${id}`);
    return;
}

if (!currentMesh || !currentMesh.scaling || !currentMesh.position) {
    console.error("Mesh properties are undefined.");
    return;
}

// Dynamically calculate the latest bounding box dimensions for the mesh
const boundingBox = calculateBoundingBoxDimensionsAndPosition(currentMesh);
const maxMeshHeight = boundingBox.dimensions.x;

const finalHeight = Math.min(newHeight, maxMeshHeight);
currentBox.box.scaling.x = finalHeight; 

setskyOpeningInstances((prevInstances) =>
    prevInstances.map((instance) =>
        instance.id === id ? { ...instance, height: finalHeight } : instance
    )
);

// Update position within updated mesh boundaries
const boxMinX = boundingBox.position.x - maxMeshHeight / 2;
const boxMaxX = boundingBox.position.x + maxMeshHeight / 2;
const boxTopX = currentBox.position.x + finalHeight / 2;
const boxBottomX = currentBox.position.x - finalHeight / 2;

if (boxTopX > boxMaxX) {
    currentBox.position.x = boxMaxX - finalHeight / 2;
} else if (boxBottomX < boxMinX) {
    currentBox.position.x = boxMinX + finalHeight / 2;
}
}, [boxInstances, selectedMesh]);

const handlePositionZ = useCallback((id, value) => {
const incrementFactor = 0.25;
const newPositionZ = parseFloat(value) * incrementFactor;

if (isNaN(newPositionZ)) {
    console.error("Invalid Z position value:", value);
    return;
}

const currentBox = boxInstances.find((box) => box.id === id);
const currentMesh = selectedMesh.current;

if (!currentBox || !currentMesh || !currentBox.box || !currentBox.box.scaling || !currentBox.box.position) {
    console.error("Box or mesh properties are undefined.");
    return;
}

const boundingBox = calculateBoundingBoxDimensionsAndPosition(currentMesh);
const originalMeshDepth = boundingBox.dimensions.z;
const boxDepth = currentBox.box.scaling.z;

const boxMinZ = boundingBox.position.z - originalMeshDepth / 2;
const boxMaxZ = boundingBox.position.z + originalMeshDepth / 2;

let newBoxPositionZ = currentBox.box.position.z;

if (newPositionZ > currentBox.box.position.z) {
    newBoxPositionZ += incrementFactor;
} else if (newPositionZ < currentBox.box.position.z) {
    newBoxPositionZ -= incrementFactor;
}

const boxFrontZ = newBoxPositionZ + boxDepth / 2;
const boxBackZ = newBoxPositionZ - boxDepth / 2;

if (boxBackZ < boxMinZ) {
    newBoxPositionZ = boxMinZ + boxDepth / 2;
} else if (boxFrontZ > boxMaxZ) {
    newBoxPositionZ = boxMaxZ - boxDepth / 2;
}

currentBox.box.position.z = newBoxPositionZ;

setskyOpeningInstances((prevInstances) =>
    prevInstances.map((instance) =>
        instance.id === id ? { ...instance, positionZ: currentBox.box.position.z } : instance
    )
);
}, [boxInstances, selectedMesh]);
// // Define pitch-specific adjustments for lRoof and rRoof
// const lRoofPitchAdjustments = {
//   1: { x: [1, 8], y: [15, 5] },
//     2: { x: [0.5, 0.8], y: [1.2, 0.6] },
//     3: { x: [0.7, 1.0], y: [1.4, 0.8] },
//     4: { x: [0.3, 0.6], y: [1.1, 0.7] },
//     5: { x: [2, 12], y: [1.5, -1] },
//   // Add more ranges as needed
// };

// const rfRoofPitchAdjustments = {
//   1: { x: [0.1, 0.4], y: [1.0, 0.5] },
//     2: { x: [0.5, 0.8], y: [1.2, 0.6] },
//     3: { x: [0.7, 1.0], y: [1.4, 0.8] },
//     4: { x: [0.3, 0.6], y: [1.1, 0.7] },
//     5: { x: [0.9, 1.2], y: [1.5, -1] },
//   // Add more ranges as needed
// };
const lastPitch = useRef(selectedPitch);
const initialPositions = useRef({}); // Store initial positions

// Refactored handlePositionX function
const handlePositionX = useCallback((id, selectedPitch) => {
  const currentBox = boxInstances.find((box) => box.id === id);
  const currentMesh = selectedMesh.current;
  const instance = skyopeningInstances.find((instance) => instance.id === id);

  if (!instance || !instance.isOpen) {
      console.error("Instance is closed or not found.");
      return;
  }
  if (!currentBox || !currentMesh || !currentBox.box || !currentBox.box.scaling || !currentBox.box.position) {
      console.error("Box or mesh properties are undefined.");
      return;
  }

  // Check roof type
  const isLeftRoof = currentMesh.name.includes("lRoof");
  const isRightRoof = currentMesh.name.includes("rRoof");

  // Recalculate the bounding box to account for mesh size
  currentMesh.computeWorldMatrix(true);
  const boundingBox = currentMesh.getBoundingInfo().boundingBox;
  const minPoint = boundingBox.minimumWorld;
  const maxPoint = boundingBox.maximumWorld;

  // Calculate half dimensions of the box
  const halfBoxWidth = currentBox.box.scaling.x / 2;
  const halfBoxHeight = currentBox.box.scaling.y / 2;

  // Calculate the mesh dimensions dynamically
  const meshWidth = maxPoint.x - minPoint.x;
  const meshHeight = maxPoint.y - minPoint.y;

  // Define dynamic adjustment factors based on mesh size
  const dynamicAdjustmentFactorX = meshWidth / 10; // Larger mesh allows for wider x-axis movement
  const dynamicAdjustmentFactorY = meshHeight / 10; // Slight y-axis movement based on height

  // Define pitch-to-adjustment mapping using interpolation
  const interpolate = (min, max, factor) => min + (max - min) * factor;

  // Pitch ranges for dynamic movement adjustments
  const pitchRangeX = { min: 0.5, max: 2.0 }; // Scale for x-axis movement
  const pitchRangeY = { min: 0.1, max: 0.5 }; // Scale for slight y-axis movement

  // Define minimum movement values to prevent too small adjustments
  const minMovementX = 0.1; // Minimum movement on the x-axis
  const minMovementY = 0.05; // Minimum movement on the y-axis

  // Adjust the pitch normalization to better handle higher pitch values
  const pitchFactor = Math.pow((selectedPitch - 1) / (45 - 1), 2); // Use a quadratic scaling to reduce sensitivity at higher pitches

  let movementAdjustment = {
      x: interpolate(pitchRangeX.min, pitchRangeX.max, pitchFactor) * dynamicAdjustmentFactorX,
      y: interpolate(pitchRangeY.min, pitchRangeY.max, pitchFactor) * dynamicAdjustmentFactorY
  };

  // Ensure minimum movement adjustments are met
  movementAdjustment.x = Math.sign(movementAdjustment.x) * Math.max(Math.abs(movementAdjustment.x), minMovementX);
  movementAdjustment.y = Math.sign(movementAdjustment.y) * Math.max(Math.abs(movementAdjustment.y), minMovementY);

  // Apply directional adjustments
  const isIncreasing = selectedPitch > lastPitch.current;
  if (!isIncreasing) {
      movementAdjustment.x = -movementAdjustment.x;
      movementAdjustment.y = -movementAdjustment.y;
  }
  if (isLeftRoof) {
      movementAdjustment.x = -movementAdjustment.x;
  }
  if (isRightRoof) {
      movementAdjustment.x = +movementAdjustment.x;
  }

  // Calculate new positions
  let newX = currentBox.box.position.x + movementAdjustment.x;
  let newY = currentBox.box.position.y + movementAdjustment.y;

  // Constrain movement within the bounding box of the mesh
  newX = Math.max(minPoint.x + halfBoxWidth, Math.min(newX, maxPoint.x - halfBoxWidth));
  newY = Math.max(minPoint.y + halfBoxHeight, Math.min(newY, maxPoint.y - halfBoxHeight));

  // Update the box position
  currentBox.box.position.x = newX;
  currentBox.box.position.y = newY;

  // Log the changes for debugging
  console.log(`Pitch change: ${isIncreasing ? "Increasing" : "Decreasing"}, Applied movement adjustments: X=${movementAdjustment.x}, Y=${movementAdjustment.y} to box ID: ${id}`);

  // Update last pitch and skyOpeningInstances
  lastPitch.current = selectedPitch;

  setskyOpeningInstances((prevInstances) =>
      prevInstances.map((instance) =>
          instance.id === id
              ? { ...instance, positionX: currentBox.box.position.x, positionY: currentBox.box.position.y }
              : instance
      )
  );
}, [skyopeningInstances, boxInstances, selectedMesh]);


const handlePositionY =useCallback((id, value) => {
const incrementFactor = 0.25; // Step size for position change
const newPositionX = parseFloat(value) * incrementFactor;

if (isNaN(newPositionX)) {
    console.error("Invalid X position value:", value);
    return;
}

const currentBox = boxInstances.find((box) => box.id === id);
const currentMesh = selectedMesh.current;

if (!currentBox || !currentMesh || !currentBox.box || !currentBox.box.scaling || !currentBox.box.position) {
    console.error("Box or mesh properties are undefined.");
    return;
}

// Calculate bounding box dimensions for the mesh
const boundingBox = calculateBoundingBoxDimensionsAndPosition(currentMesh);
const originalMeshWidth = boundingBox.dimensions.x;
const boxWidth = currentBox.box.scaling.x; // Use the updated box width (X axis)

// Calculate min and max X for the mesh
const boxMinX = boundingBox.position.x - originalMeshWidth / 2;
const boxMaxX = boundingBox.position.x + originalMeshWidth / 2;

// Calculate the current position of the box
const currentBoxPositionX = currentBox.box.position.x;

// Determine the target position based on the new input
const targetPositionX = newPositionX;

// Determine the new position step (incrementally move towards target)
let newBoxPositionX = currentBoxPositionX;

if (targetPositionX > currentBoxPositionX) {
    newBoxPositionX += incrementFactor; // Move right by incrementFactor
} else if (targetPositionX < currentBoxPositionX) {
    newBoxPositionX -= incrementFactor; // Move left by incrementFactor
}

// Adjust the box position to ensure it stays within bounds
const boxRightX = newBoxPositionX + boxWidth / 2; // Right side of the box after position change
const boxLeftX = newBoxPositionX - boxWidth / 2;  // Left side of the box after position change

// Keep the box within the mesh boundaries
if (boxLeftX < boxMinX) {
    newBoxPositionX = boxMinX + boxWidth / 2; // Align the box left to the mesh left boundary
} else if (boxRightX > boxMaxX) {
    newBoxPositionX = boxMaxX - boxWidth / 2; // Align the box right to the mesh right boundary
}

// Update the box's X position incrementally
currentBox.box.position.x = newBoxPositionX;

// Update the box position in state
setskyOpeningInstances((prevInstances) =>
    prevInstances.map((instance) =>
        instance.id === id ? { ...instance, positionY: currentBox.box.position.x } : instance
    )
);
}, [boxInstances, selectedMesh]);



const handleCut = useCallback((id) => {
const currentBox = boxInstances.find((box) => box.id === id);
const meshToCut = originalMeshState.current[id]?.mesh || selectedMesh.current[id];

if (!currentBox || !meshToCut) {
  console.error(`Box or Mesh not found for instance ID: ${id}`);
  return;
}

const originalMeshName = meshToCut.name;

// Clear all highlights before cutting
if (hl.current) {
  console.log('Removing highlights before cut operation.');
  hl.current.removeAllMeshes();
}

const whiteMat = new StandardMaterial('whiteMat', data[0].current);
whiteMat.diffuseColor = new Color3(1, 1, 1);

// Save the original state if it's not already saved
if (!originalMeshState.current[id]) {
  originalMeshState.current[id] = {
    mesh: meshToCut,
    name: meshToCut.name,
    position: meshToCut.position.clone(),
    scaling: meshToCut.scaling.clone(),
    rotation: meshToCut.rotation.clone(),
    material: meshToCut.material.clone(),
    visibility: meshToCut.isVisible,
  };
}

console.log('before', meshToCut.name);
meshToCut.name = 'cut' + id;

// Ensure the world matrix is up to date
currentBox.box.computeWorldMatrix(true);
meshToCut.computeWorldMatrix(true);

// Create CSG meshes based on local transforms (do not bake world transforms)
const aCSG = CSG.FromMesh(currentBox.box);
const bCSG = CSG.FromMesh(meshToCut);

if (!aCSG || !bCSG) {
  console.error(`Failed to create CSG for ID: ${id}`);
  return;
}

// Perform the CSG subtraction
const subCSG = bCSG.subtract(aCSG);
const resultMesh = subCSG.toMesh(originalMeshName, whiteMat, data[0].current);

// Copy the original mesh's world matrix to the result mesh (this applies the original transform)
resultMesh.position.copyFrom(meshToCut.position);
resultMesh.scaling.copyFrom(meshToCut.scaling);
resultMesh.rotation.copyFrom(meshToCut.rotation);

// Apply the world matrix transform from the original mesh
resultMesh.computeWorldMatrix(true);
const worldMatrix = meshToCut.getWorldMatrix();
resultMesh.setPreTransformMatrix(worldMatrix);

// Set the parent and visibility
  resultMesh.setParent(meshToCut.parent); 

resultMesh.isVisible = true;
resultMesh.isUsed = true;

// Hide the original mesh and current box
meshToCut.isVisible = false;
currentBox.box.isVisible = false;

selectedMesh.current[id] = resultMesh;

setIsAnyDialogInUse(false);
setskylightStates((prevState) => ({
  ...prevState,
  [id]: true,
}));

console.log('Skylight State:', setskylightStates);
console.log(`SkyLight operation complete for ID: ${id}`);

// setCutStates((prevState) => ({
//   ...prevState,
//   [id]: true,
// }));

// console.log('State:', setCutStates);
// console.log(`Cut operation complete for ID: ${id}`);

resultMesh.material = whiteMat;
resultMesh.isCutOrRestored = true;

// Color the resulting mesh if needed
ColorMesh(resultMesh);

if (hl.current) {
  console.log('Removing highlights after cut operation.');
  hl.current.removeAllMeshes();
}
}, [data, originalMeshState, boxInstances, loaded_meshes]);
useEffect(() => {
if (skyopenings && data[0]?.current) {
  const handlePointerMove = (evt, pickResult) => {
    const result = data[0].current.pick(
      data[0].current.pointerX,
      data[0].current.pointerY,
      null,
      null,
      data[2]
    );

    if (result.hit && isValidMeshForBox(result.pickedMesh)) {
      const pickedMesh = result.pickedMesh;

      if ( highlightedMeshes.current.has(pickedMesh)) {
        console.log(`Mesh already cut/restored or highlighted: ${pickedMesh.name || pickedMesh.id}`);
      } else {
        if (highlightedMeshes.current.size > 0) {
          hl.current.removeAllMeshes();
          highlightedMeshes.current.clear();
          console.log('Removing previous highlights.');
        }

        hl.current.addMesh(pickedMesh, Color3.Teal());
        highlightedMeshes.current.add(pickedMesh);
        console.log('Added highlight to mesh:', pickedMesh.name || pickedMesh.id);
      }
    } 
    else {
      if (highlightedMeshes.current.size > 0) {
        hl.current.removeAllMeshes();
        highlightedMeshes.current.clear();
        console.log('Removed highlight as no valid mesh is hovered.');
      }
    }
  };

  data[0].current.onPointerMove = handlePointerMove;

  return () => {
    if (data[0]?.current) {
      data[0].current.onPointerMove = null;
    }
  };
} else {
  if (hl.current) {
    hl.current.removeAllMeshes();
    console.log('Cleared highlights because openings are inactive.');
  }

  highlightedMeshes.current.clear();
}
}, [skyopenings, data]);




  return (
    <skylightcontext.Provider
      value={{
        // restoreMeshState,
        handlePositionX,
        skyopenings,
        setskyOpenings,
        setCutStates,
        handleCut,
        cutStates,
        handleWidth,
        handleHeight,
        handleClose,
        skyopeningInstances,
        toggleInstanceOpen,
        addOpeningInstance,
        setIsAnyDialogInUse,
        isAnyDialogInUse,
        handlePositionY,handlePositionZ,
        skylightStates, 
        setskylightStates,
      }}
    >
      {children}
    </skylightcontext.Provider>
  );
};

export const useskylightdetail = () => useContext(skylightcontext);


