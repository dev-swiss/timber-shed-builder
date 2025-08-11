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
import { setup_extras ,ColorMesh } from "../core/coreFunctions";
import { calculateBoundingBoxDimensionsAndPosition } from '../core/coreFunctions';

const OpeningDetailsContext = createContext();
var loaded_meshes = [];
var id = 0;
var bay = [];
var element = [];
export const meshLoaderopening = (loadedMeshes) => {
  loaded_meshes = loadedMeshes;
  return loaded_meshes;
};

export const OpeningDetailsProvider = ({ children }) => {
  

  const [openings, setOpenings] = useState(false);
  const [cutStates, setCutStates] = useState(false);
  // const [sizes] = useState([{ width: 920, height: 2040 }]);
  const delay = 50;
  let lastEventTime = 0;
  let pointerMoveTimeout = null;
  const [openingInstances, setOpeningInstances] = useState([]);
  const [dialogInstances, setDialogInstances] = useState({});
  const [isAnyDialogInUse, setIsAnyDialogInUse] = useState(false);
  const [boxInstances, setBoxRefInstances] = useState([]);
  const selectedMesh = useRef({});
  const originalMeshState = useRef({});
  const hl = useRef(null);
  const originalNamesRef = useRef(new Map());
  const data = setup_extras();
  const highlightedMeshes = useRef(new Set()); 
 
  useEffect(() => {
    if (data && data[0]) {
      hl.current = new HighlightLayer("hl", data[0].current);
    }
  }, [data]);
  useEffect(() => {
    if (openings) {
      const handlePointerDown = (evt, pickResult) => {
      
        const pickInfo = data[0].current.pick(
          data[0].current.pointerX,
          data[0].current.pointerY
        );
        if (pickInfo.hit) {
          console.log('Picked Mesh Name:', pickInfo.pickedMesh.name);
        }
        if (pickInfo.hit && isValidMeshForBox(pickInfo.pickedMesh)) {
          selectedMesh.current = pickInfo.pickedMesh;
          let openingInstance = openingInstances.find(
            (d) => d.isOpen && !boxInstances.some((box) => box.id === d.id && box.selectedMesh)
          );

          if (!openingInstance) {
            console.log("No open instance found.");
            return;
          }

          const id = openingInstance.id;  // Get the id from the found opening instance
          selectedMesh.current[id] = pickInfo.pickedMesh;

          console.log("Picked Mesh:", pickInfo.pickedMesh.name, pickInfo.pickedMesh.id);
          console.log("Found open instance: ", openingInstance);

          const newBox = Mesh.CreateBox("box", 0.5, data[0].current);
          console.log("New Box Created:", newBox);
          console.log("Scene:", data[0].current);
          const redMat = new StandardMaterial("redMat", data[0].current);
          redMat.diffuseColor = new Color3(0, 1, 1);
          redMat.alpha = 0.7;
          newBox.material = redMat;

          const boundingInfo = pickInfo.pickedMesh.getBoundingInfo();
          const center = boundingInfo.boundingBox.centerWorld;

          // Calculate dynamic position based on bounding box dimensions or user input
          const offsetY = 0.5 * boundingInfo.boundingBox.extendSizeWorld.y;  // Example: offset box by half the height of the mesh

          // Apply the dynamic position
          newBox.position.copyFrom(center);
          newBox.position.y += offsetY;
          newBox.isVisible = true;

          const boxInstance = {
            id: openingInstance.id,  // Ensure you're using the correct ID
            box: newBox,  // Assign the created box here
            selectedMesh: pickInfo.pickedMesh,  // Ensure selectedMesh is updated
          };

          // Update box references state
          setBoxRefInstances(prevBoxes => {
            const boxExists = prevBoxes.some(box => box.id === boxInstance.id);
            if (!boxExists) {
              console.log("Box instance created and added:", boxInstance);
              return [...prevBoxes, boxInstance];
            }
            // If it already exists, ensure the box is updated
            return prevBoxes.map(box => (box.id === boxInstance.id ? { ...box, box: newBox, selectedMesh: pickInfo.pickedMesh } : box));
          });
          hl.current.removeAllMeshes();
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

          console.log(
            "Saved original state for selected mesh:",
            originalMeshState.current[openingInstance.id]
          );
        } else {
          console.log("No valid mesh selected.");
        }
      };

      data[0].current.onPointerDown = handlePointerDown;

      return () => {
        data[0].current.onPointerDown = null;
      };
    }
  }, [openings, data, openingInstances, setBoxRefInstances]);

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
      isOpen: true,
    };

    // Update opening instances state
    setOpeningInstances(prevInstances => [
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
    setDialogInstances(prevDialogs => ({
      ...prevDialogs,
      [newId]: {
        id: newId,
        isAnyDialogInUse: true,
        handleWidth: (value) => handleWidth(newId, value),
        handleHeight: (value) => handleHeight(newId, value),
        handlePositionY: (value) => handlePositionY(newId, value),
        handleCut: () => handleCut(newId),
        handleClose: () => handleClose(newId),
      },
    }));

    setIsAnyDialogInUse(true); // Set the dialog usage state to true

  }, [isAnyDialogInUse]);

  const toggleInstanceOpen = useCallback((id) => {
    setOpeningInstances(prevInstances =>
      prevInstances.map(instance =>
        instance.id === id
          ? { ...instance, isOpen: !instance.isOpen }
          : instance
      )
    );

    // Toggle dialog state
    setDialogInstances(prevDialogs => ({
      ...prevDialogs,
      [id]: {
        ...prevDialogs[id],
        isAnyDialogInUse: !dialogInstances[id]?.isAnyDialogInUse,
      },
    }));

    // If toggling off, reset the dialog state
    if (dialogInstances[id]?.isAnyDialogInUse) {
      setIsAnyDialogInUse(false);
    }
}, [dialogInstances]);
const handleClose = useCallback((id) => {
  if (!id) {
      console.error('ID is not provided');
      return;
  }

  const currentBox = boxInstances.find((box) => box.id === id);
  if (!currentBox) {
      console.error(`No box instance found for ID ${id}.`);
      return;
  }

  const pointerMoveBackup = data[0].current.onPointerMove;
  data[0].current.onPointerMove = null;

  const originalMesh = originalMeshState.current[id]?.mesh;
  if (!originalMesh) {
      console.error(`No original mesh found for ID ${id}. This may prevent reopening.`);
      return;
  }

  // Restore the original mesh name here
  const originalName = originalMeshState.current[id]?.name; // Get the original name
  if (originalName) {
      originalMesh.name = originalName;
      console.log("RESTORED NAME",originalName) // Restore the name
  }


  if (bay[id] !== undefined && element[id] !== undefined) {
      loaded_meshes[bay[id]][element[id]].dispose();
      loaded_meshes[bay[id]][element[id]] = originalMesh;
  }

  originalMesh.position.copyFrom(originalMeshState.current[id].position);
  originalMesh.scaling.copyFrom(originalMeshState.current[id].scaling);
  originalMesh.rotation.copyFrom(originalMeshState.current[id].rotation);
  originalMesh.material = originalMeshState.current[id].material;
  originalMesh.isVisible = originalMeshState.current[id].visibility;
  originalMesh.refreshBoundingInfo();
console.log("mmm", originalMesh.name)
  // Flag the restored mesh as cut or restored
 // Prevent future highlighting

  if (hl.current && highlightedMeshes.current.has(originalMesh)) {
      console.log(`Restored mesh is still highlighted: ${originalMesh.name || originalMesh.id}`);
      hl.current.removeMesh(originalMesh);
      highlightedMeshes.current.delete(originalMesh);
      hl.current.removeAllMeshes();
      data[0].current.markAllMaterialsAsDirty(BABYLON.Constants.MATERIAL_AllDirtyFlag);
      console.log(`Highlight forcefully removed from restored mesh: ${originalMesh.name || originalMesh.id}`);
  }

  if (currentBox.box) {
      currentBox.box.dispose();
      currentBox.box = null;
      console.log(`Disposed box for ID: ${id}`);
  }

  setOpeningInstances(prevInstances => prevInstances.filter(instance => instance.id !== id));
  setBoxRefInstances(prevBoxes => prevBoxes.filter(box => box.id !== id));
  setDialogInstances(prevDialogs => {
      const { [id]: removedDialog, ...remainingDialogs } = prevDialogs;
      return remainingDialogs;
  });

  setIsAnyDialogInUse(false);
  console.log(`Closed instance for ID: ${id}`);

  data[0].current.onPointerMove = pointerMoveBackup;
  console.log('Pointer move re-enabled after mesh restoration.');
}, [boxInstances, originalMeshState]);




  const isValidMeshForBox = useCallback((mesh) => {
    const isValid = mesh instanceof BABYLON.Mesh && mesh.isVisible && mesh.name !== "";
    console.log("Validating Mesh:", mesh.name, "Is Valid:", isValid);

    return (
      mesh &&
      ![
        "fTop",
        "FTop",
        "BTop",
        "lRoof",
        "rRoof",
         "fRoof",
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

    // Update the width of the selected instance
    setOpeningInstances((prevInstances) =>
      prevInstances.map((instance) =>
        instance.id === id ? { ...instance, width: newWidth } : instance
      )
    );

    const currentBox = boxInstances.find((box) => box.id === id);
    if (currentBox) {
      const currentMesh = currentBox.selectedMesh || selectedMesh.current;

      if (currentMesh) {
        if (currentMesh.name.includes("FWall") || currentMesh.name.includes("BWall")) {
          currentBox.box.scaling.x = newWidth;
        } else if (currentMesh.name.includes("Rwall") || currentMesh.name.includes("Lwall")) {
          currentBox.box.scaling.z = newWidth;
        }
        console.log(`Updated width for box ID: ${id} to ${newWidth}`);
      }
    }
  }, [boxInstances]);

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

    // Calculate bounding box dimensions
    const boundingBox = calculateBoundingBoxDimensionsAndPosition(currentMesh);

    const maxMeshHeight = boundingBox.dimensions.y;
    const finalHeight = Math.min(newHeight, maxMeshHeight);

    // Update box height
    setOpeningInstances((prevInstances) =>
      prevInstances.map((instance) =>
        instance.id === id ? { ...instance, height: finalHeight } : instance
      )
    );
    currentBox.box.scaling.y = finalHeight;

    // Adjust Y position relative to the current position, not the mesh center
    const boxMinY = boundingBox.position.y - maxMeshHeight / 2;
    const boxMaxY = boundingBox.position.y + maxMeshHeight / 2;

    if (currentBox.position && currentBox.position.y) {
      const boxTopY = currentBox.position.y + finalHeight / 2;
      const boxBottomY = currentBox.position.y - finalHeight / 2;

      if (boxTopY > boxMaxY) {
        currentBox.position.y = boxMaxY - finalHeight / 2;
      } else if (boxBottomY < boxMinY) {
        currentBox.position.y = boxMinY + finalHeight / 2;
      }
    } else {
      console.error("Box position is undefined.");
    }
  }, [boxInstances, selectedMesh]);

  const handlePositionY = useCallback((id, value) => {
    const incrementFactor = 0.25; // Step size for position change
    const newPositionY = parseFloat(value) * incrementFactor;

    if (isNaN(newPositionY)) {
      console.error("Invalid Y position value:", value);
      return;
    }

    const currentBox = boxInstances.find((box) => box.id === id);
    const currentMesh = selectedMesh.current;

    if (!currentBox || !currentMesh || !currentBox.box || !currentBox.box.scaling || !currentBox.box.position) {
      console.error("Box or mesh properties are undefined.");
      return;
    }

    // Calculate bounding box dimensions
    const boundingBox = calculateBoundingBoxDimensionsAndPosition(currentMesh);
    const originalMeshHeight = boundingBox.dimensions.y;
    const boxHeight = currentBox.box.scaling.y; // Use the updated box height

    // Calculate min and max Y for the mesh
    const boxMinY = boundingBox.position.y - originalMeshHeight / 2;
    const boxMaxY = boundingBox.position.y + originalMeshHeight / 2;

    // Calculate the current position of the box
    const currentBoxPositionY = currentBox.box.position.y;

    // Determine the target position based on the new input
    const targetPositionY = newPositionY;

    // Determine the new position step (incrementally move towards target)
    let newBoxPositionY = currentBoxPositionY;

    if (targetPositionY > currentBoxPositionY) {
      // If the target position is above the current position, increment upward
      newBoxPositionY += incrementFactor; // Move up by incrementFactor
    } else if (targetPositionY < currentBoxPositionY) {
      // If the target position is below the current position, decrement downward
      newBoxPositionY -= incrementFactor; // Move down by incrementFactor
    }

    // Adjust the box position to ensure it stays within bounds
    const boxTopY = newBoxPositionY + boxHeight / 2; // Top of the box after position change
    const boxBottomY = newBoxPositionY - boxHeight / 2; // Bottom of the box after position change

    // Keep the box within the mesh boundaries
    if (boxBottomY < boxMinY) {
      newBoxPositionY = boxMinY + boxHeight / 2; // Align the box bottom to the mesh bottom
    } else if (boxTopY > boxMaxY) {
      newBoxPositionY = boxMaxY - boxHeight / 2; // Align the box top to the mesh top
    }

    // Update the box's Y position incrementally
    currentBox.box.position.y = newBoxPositionY;

    // Update the box position in state
    setOpeningInstances((prevInstances) =>
      prevInstances.map((instance) =>
        instance.id === id ? { ...instance, positionY: currentBox.box.position.y } : instance
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

  const originalMeshName = meshToCut.name;  // Store the original name

  // Clear all highlights before cutting
  if (hl.current) {
      console.log('Removing highlights before cut operation.');
      hl.current.removeAllMeshes(); // Clear all highlights
  }

  const whiteMat = new StandardMaterial("whiteMat", data[0].current);
  whiteMat.diffuseColor = new Color3(1, 1, 1);  // White color for the cut mesh

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

  console.log("before ", meshToCut.name);

  // Rename the mesh temporarily during cutting operation
  meshToCut.name = "cut" + id;

  // Perform CSG operation to cut the mesh
  const aCSG = CSG.FromMesh(currentBox.box);
  const bCSG = CSG.FromMesh(meshToCut);

  if (!aCSG || !bCSG) {
      console.error(`Failed to create CSG for ID: ${id}`);
      return;
  }

  const subCSG = bCSG.subtract(aCSG);
  const resultMesh = subCSG.toMesh(originalMeshName, whiteMat, data[0].current);  // Use original mesh name
  // ColorMesh(resultMesh); 
  // console.log("1",ColorMesh(resultMesh))
  // Apply original mesh's transform properties to the result mesh
  resultMesh.position.copyFrom(meshToCut.position);
  resultMesh.scaling.copyFrom(meshToCut.scaling);
  resultMesh.rotation.copyFrom(meshToCut.rotation);

  loaded_meshes.forEach((meshes, index) => {
      meshes.forEach((mesh, curIndex) => {
          if (mesh.name === "cut" + id) {
              bay[id] = index;
              element[id] = curIndex;

              meshToCut.name = originalMeshName;
              console.log("AFTER", meshToCut.name);

              loaded_meshes[index][curIndex] = resultMesh;
          }
      });
  });

  // Update the selected mesh to point to the new result mesh
  selectedMesh.current[id] = resultMesh;

  // Hide the original mesh and the cutting box
  meshToCut.isVisible = false;
  currentBox.box.isVisible = false;

  setIsAnyDialogInUse(false);

  // Mark the instance as being cut
  setCutStates((prevState) => ({
      ...prevState,
      [id]: true,  // Mark this instance as being cut
  }));

  console.log("State: ", setCutStates);

  console.log(`Cut operation complete for ID: ${id}`);
  
  // Ensure the result mesh is visible and ready
  resultMesh.material = whiteMat;
  resultMesh.isVisible = true;
  resultMesh.isUsed = true;

  // Prevent future highlighting on the result mesh
  resultMesh.isCutOrRestored = true;

  // Clear the dialog flag and highlight any remaining mesh if needed
  setIsAnyDialogInUse(false);
  ColorMesh(resultMesh);  // Call ColorMesh to apply the material/color based on mesh name
  console.log("2",ColorMesh(resultMesh))
  // Apply original mesh's transform propertie
  // Remove any existing highlights after the cut operation
  if (hl.current) {
      console.log('Removing highlights after cut operation.');
      hl.current.removeAllMeshes();
  }
}, [data, originalMeshState, boxInstances, loaded_meshes]);
useEffect(() => {
  if (openings && data[0]?.current) {
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

              // Check if the mesh has already been cut/restored or is already highlighted
              if (pickedMesh.isCutOrRestored || highlightedMeshes.current.has(pickedMesh)) {
                  console.log(`Mesh already cut/restored or highlighted: ${pickedMesh.name || pickedMesh.id}`);
              } else {
                  // Clear previous highlights before adding the new one
                  if (highlightedMeshes.current.size > 0) {
                      hl.current.removeAllMeshes();
                      highlightedMeshes.current.clear(); // Clear previous highlights
                      console.log('Removing previous highlights.');
                  }

                  // Add highlight to the new mesh and track it
                  hl.current.addMesh(pickedMesh, Color3.Teal());
                  highlightedMeshes.current.add(pickedMesh);  // Track the highlighted mesh
                  console.log('Added highlight to mesh:', pickedMesh.name || pickedMesh.id);
              }
          } else {
              // If no valid mesh is hovered, remove any existing highlights
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
              data[0].current.onPointerMove = null;  // Cleanup
          }
      };
  } else {
      // Ensure highlights are cleared if openings are not active
      if (hl.current) {
          hl.current.removeAllMeshes();
          console.log('Cleared highlights because openings are inactive.');
      }

      highlightedMeshes.current.clear();
  }
}, [openings, data]);





  return (
    <OpeningDetailsContext.Provider
      value={{
        // restoreMeshState,
        openings,
        setOpenings,
        setCutStates,
        handleCut,
        cutStates,
                handleWidth,
        handleHeight,
        handleClose,
        openingInstances,
        toggleInstanceOpen,
        addOpeningInstance,
        setIsAnyDialogInUse,
        isAnyDialogInUse,
        handlePositionY,
      }}
    >
      {children}
    </OpeningDetailsContext.Provider>
  );
};

export const useOpeningDetails = () => useContext(OpeningDetailsContext);


