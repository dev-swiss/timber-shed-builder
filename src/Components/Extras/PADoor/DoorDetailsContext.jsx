import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { CSG, StandardMaterial, Color3, Mesh, HighlightLayer } from '@babylonjs/core';
import { setup_extras } from '../../../core/coreFunctions';
import { createDoorWithKnob } from './DoorStructure';

const DoorDetailsContext = createContext();
var loaded_meshes = [];
var id = 0;
const bay = [];
const element = [];


export const meshLoaderPADoor = (loadedMeshes) => {
  loaded_meshes = loadedMeshes;
  return loaded_meshes;
};

export const DoorDetailsProvider = ({ children }) => {

  const [doors, setDoors] = useState(false);
  const [sizes] = useState([{ width: 920, height: 2040 }]);
  const [doorInstances, setDoorInstances] = useState([]);
  const [dialogInstances, setDialogInstances] = useState({});
  const [isAnydDialogInUse, setIsAnydDialogInUse] = useState(false);
  const [boxInstances, setBoxInstances] = useState([]);
  // const selectedMesh = useRef();
  const [unionStates, setUnionStates] = useState(false);// New state to store cuts


  const originalMeshRef = useRef({});
  const hl = useRef(null);
  const deletedMeshesRef = useRef([]);
  const originalNamesRef = useRef(new Map());
  const data = setup_extras();

  useEffect(() => {
    if (data && data[0]) {
      hl.current = new HighlightLayer("hl", data[0].current);
    }
  }, [data]);

  const addDoorInstance = useCallback(() => {
    if (isAnydDialogInUse) {
      return;
    }
    
    

    const newId = Date.now().toString();

    const newBox = {
      id: newId,
      box: null,
      selectedMesh: null,
    };

    const newInstance = {
      id: newId,
      positionX: 0,
      positionY: 6,
      isOpen: true,
      selectedSize: sizes[0],
    };

    setDoorInstances(prevInstances => [
      ...prevInstances,
      newInstance
    ]);

    setBoxInstances(prevBoxes => [
      ...prevBoxes,
      newBox
    ]);

    setDialogInstances(prevDialogs => ({
      ...prevDialogs,
      [newId]: {
        id: newId,
        isAnydDialogInUse: true,
        handlePositionX: (value) => handlePositionX(newId, value),
        handlePositionY: (value) => handlePositionY(newId, value),
        handleSizeChange: (value) => handleSizeChange(newId, value),
        handleUnion: () => handleUnion(newId),
        handleClose: () => handleClose(newId),
      }
    }));

    setIsAnydDialogInUse(true);

  }, [sizes, isAnydDialogInUse]);


  const toggleDoorOpen = useCallback((id) => {
    setDoorInstances(prevInstances =>
      prevInstances.map(instance =>
        instance.id === id
          ? { ...instance, isOpen: !instance.isOpen }
          : instance
      )
    );


    setDialogInstances(prevDialogs => ({
      ...prevDialogs,
      [id]: {
        ...prevDialogs[id],
        isAnydDialogInUse: !dialogInstances[id]?.isAnydDialogInUse,
      }
    }));
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

    console.log("Original mesh: ", originalMeshRef.current);
    console.log("Name: ",originalMeshRef.current[id].name) ;
    console.log("loaded mesh at index: ", loaded_meshes[bay[id]][element[id]]);

    // Check if we have a saved original mesh in the reference object
    const originalMeshData = originalMeshRef.current[id];
    if (!originalMeshData || !originalMeshData.mesh) {
        console.error(`No original mesh found for ID ${id}.`);
        return;
    }

    // Ensure the original mesh is restored and made visible
    const originalMesh = originalMeshData.mesh;
    originalMesh.isVisible = true;

    // Get scaling from the unioned mesh before disposing of it
    const unionedMesh = loaded_meshes[bay[id]][element[id]];
    if (!unionedMesh) {
        console.error(`No unioned mesh found for bay ${bay[id]} and element ${element[id]}.`);
        return;
    }

    const savedScaling = unionedMesh.scaling.clone();
    const savedPosition = unionedMesh.position.clone();
    const savedRotation = unionedMesh.rotation.clone();

    // Dispose of the unioned mesh
    unionedMesh.dispose();

    // Restore the original mesh in place of the unioned mesh
    loaded_meshes[bay[id]][element[id]] = originalMesh;
    loaded_meshes[bay[id]][element[id]].scaling = savedScaling;
    loaded_meshes[bay[id]][element[id]].position = savedPosition;
    loaded_meshes[bay[id]][element[id]].rotation = savedRotation;

    // Optionally restore the original mesh name if it was changed during union
    if (originalMeshData.name) {
        originalMesh.name = originalMeshData.name;
    }

    console.log(`Restored original mesh for ID ${id} with name: ${originalMesh.name}`);

    // If the current box has a box (bounding box), dispose of it as well
    if (currentBox.box) {
        console.log(`Disposing original box for ID ${id}`);
        currentBox.box.dispose();
        currentBox.box = null;
    }

    // Clear highlight if it exists
    if (hl.current) {
        hl.current.removeAllMeshes();
    }

    // Set the state for dialog usage to false
    setIsAnydDialogInUse(false);
}, [boxInstances, loaded_meshes, originalMeshRef]);



  const isValidMeshForBox = useCallback((mesh) => {
    return (
      mesh &&
      ![
        "fTop",
        "FTop",
        "BTop",
        "lRoof",
        "rRoof",
         "fRoof",
        "ground",
        "skyBox",
        "fGround",
        "bGround",
        "Left",
        "Right",
        "arrow",
        "Barrow",
        "Larrow",
        "leftArrow",
        "front",
        "fLogo",
        "leftplane",
        "rightplane",
        "Back",
        "bLogo",
        "plane",
      ].includes(mesh.name)
    );
  }, []);

  useEffect(() => {
    if (doors) {
      const handlePointerDown = (evt, pickResult) => {
        const pickInfo = data[0].current.pick(
          data[0].current.pointerX,
          data[0].current.pointerY
        );

        if (pickInfo.hit && isValidMeshForBox(pickInfo.pickedMesh)) {
          // selectedMesh.current = pickInfo.pickedMesh;
          console.log("Picked Mesh:", pickInfo.pickedMesh.name, pickInfo.pickedMesh.id, pickInfo.pickedMesh);

          // Find the first door instance that is open and has no mesh associated
          let doorInstance = doorInstances.find(
            (d) => d.isOpen && !boxInstances.some((box) => box.id === d.id && box.selectedMesh)
          );

          // If no such door instance exists, return early
          if (!doorInstance) {
            console.log("No available door instance found");
            return;
          }

          // Find the corresponding box for the door instance
          let currentBox = boxInstances.find((box) => box.id === doorInstance.id);

          if (currentBox) {
            // Ensure the current box isn't already associated with another mesh
            if (currentBox.selectedMesh && currentBox.selectedMesh !== pickInfo.pickedMesh) {
              console.log("Deselecting previously selected mesh");
              currentBox.selectedMesh = null; // Unselect without disposing
            }

            // Set the newly selected mesh only if it's not already set
            if (!currentBox.selectedMesh) {
              // Check if pickInfo.pickedMesh is valid
              if (!pickInfo.pickedMesh) {
                console.log("No mesh picked, exiting.");
                return;
              }
              currentBox.selectedMesh = pickInfo.pickedMesh;
              if (currentBox.selectedMesh.name) {
                console.log("Selected Mesh for Box:", currentBox.selectedMesh.name);
              } else {
                console.log("Picked mesh has no name, assigning temporary name.");
                currentBox.selectedMesh.name = `Unnamed_Mesh_${pickInfo.pickedMesh.id}`;
              }

              // If a box already exists, disable it before creating a new one
              if (currentBox.box) {
                console.log("Disabling previous box instance");
                currentBox.box.setEnabled(false);
                currentBox.box.dispose();
                currentBox.box = null;
              }

              // Create materials for the door and knob
              const doorMaterial = new StandardMaterial("doorMat", data[0].current);
              doorMaterial.diffuseColor = new Color3(0.6, 0.3, 0.1);

              const knobMaterial = new StandardMaterial("knobMat", data[0].current);
              knobMaterial.diffuseColor = new Color3(0.8, 0.8, 0.8);

              // Determine the wall type based on the mesh name
              const wallType = determineWallType(pickInfo.pickedMesh.name);

              // Create the door with the knob
              currentBox.box = createDoorWithKnob(data[0].current, doorMaterial, knobMaterial, wallType);

              // Adjust the door's scaling
              currentBox.box.scaling.x = sizes[0].width / 1000;
              currentBox.box.scaling.y = sizes[0].height / 1000;
              currentBox.box.scaling.z = 0.7;

              // Calculate and set the door's position based on the selected mesh
              const boundingInfo = pickInfo.pickedMesh.getBoundingInfo();

              const center = boundingInfo.boundingBox.centerWorld;
              currentBox.box.position.copyFrom(center);
             // currentBox.box.position.addInPlace(pickInfo.pickedMesh.position);


              // Log the door's new position
              console.log("New Door Position:", currentBox.box.position);

              // Store the original name of the selected mesh
              if (!originalNamesRef.current.has(pickInfo.pickedMesh)) {
                originalNamesRef.current.set(
                  pickInfo.pickedMesh,
                  pickInfo.pickedMesh.name
                );
              }
            }
          }
        }
      };

      data[0].current.onPointerDown = handlePointerDown;

      return () => {
        data[0].current.onPointerDown = null;
      };
    }
  }, [doors, sizes, data, doorInstances, isValidMeshForBox, boxInstances]);



  const determineWallType = (name) => {
    if (name.includes('Lwall')) return 'Lwall';
    if (name.includes('Rwall')) return 'Rwall';
    if (name.includes('FWall')) return 'FWall';
    if (name.includes('BWall')) return 'BWall';
    return '';
  };

  const handlePositionX = useCallback((id, value) => {
    setDoorInstances(prevInstances =>
      prevInstances.map(instance =>
        instance.id === id ? { ...instance, positionX: value } : instance
      )
    );

    const currentBox = boxInstances.find((box) => box.id === id);
    if (currentBox && currentBox.box && currentBox.selectedMesh) {


      // Update condition to only check for 'Lwall' without the direct full name
      const isRWallOrLWall = currentBox.selectedMesh.name.includes('Rwall') || currentBox.selectedMesh.name.includes('Lwall');
      // console.log(selectedMesh.current)
      if (isRWallOrLWall) {
        currentBox.box.position.z = value / 5 + currentBox.selectedMesh.position.z;
        console.log("if block")
      } else {
        currentBox.box.position.x = value / -5;
        console.log("Else")
      }
    }
  }, [doorInstances, boxInstances]);


  const handlePositionY = useCallback((id, value) => {
    const newY = value / 5; 
    const fGround = data[0]?.current.getMeshByName('fGround');

    const currentBox = boxInstances.find((box) => box.id === id);

    if (currentBox && currentBox.box && fGround) {
      const doorBottomPosition = currentBox.box.position.y - (currentBox.box.scaling.y / 2);

      if (doorBottomPosition + newY >= fGround.position.y) {
        setDoorInstances(prevInstances =>
          prevInstances.map(instance =>
            instance.id === id ? { ...instance, positionY: value } : instance
          )
        );
        currentBox.box.position.y = newY;
      } else {
        setDoorInstances(prevInstances =>
          prevInstances.map(instance =>
            instance.id === id ? { ...instance, positionY: fGround.position.y * 5 } : instance
          )
        );
      }
    }
  }, [doorInstances, data, boxInstances]);

  const handleSizeChange = useCallback((id, value) => {
    setDoorInstances(prevInstances =>
      prevInstances.map(instance =>
        instance.id === id
          ? {
            ...instance,
            selectedSize: sizes[value],
          }
          : instance
      )
    );

    const currentBox = boxInstances.find((box) => box.id === id);
    if (currentBox && currentBox.box) {
      currentBox.box.scaling.x = sizes[value].width / 2000;
      currentBox.box.scaling.y = sizes[value].height / 2000;
    }
  }, [doorInstances, sizes, boxInstances]);

  const handleUnion = useCallback((id) => {
    const result = data[0].current.pick(data[0].current.pointerX, data[0].current.pointerY);
    const currentBox = boxInstances.find((box) => box.id === id);

    if (result.hit && currentBox?.selectedMesh && currentBox?.box) {
      const originalMesh = currentBox.selectedMesh;


      if (!originalMeshRef.current[id]) {
        originalMeshRef.current[id] = {
          mesh: originalMesh.clone(),
          position: originalMesh.position.clone(),
          scaling: originalMesh.scaling.clone(),
          rotation: originalMesh.rotation.clone(),
          name: originalMesh.name,  //Step1: store the name of selected mesh
        };
      }

      originalMesh.name = "union" + id;

      const selectedCSG = CSG.FromMesh(currentBox.selectedMesh);
      const boxCSG = CSG.FromMesh(currentBox.box);
      const union = selectedCSG.union(boxCSG);


      const newMesh = union.toMesh(
        `${currentBox.selectedMesh.name}-union`,
        currentBox.selectedMesh.material,
        data[0].current
      );
      console.log("New mesh created with name:", newMesh.name);


      newMesh.position.copyFrom(currentBox.selectedMesh.position);
      newMesh.scaling.copyFrom(currentBox.selectedMesh.scaling);
      newMesh.rotation.copyFrom(currentBox.selectedMesh.rotation);
      currentBox.selectedMesh = newMesh;


      console.log("Hii from loaded mesh: ", loaded_meshes);
     loaded_meshes.forEach((meshes, index) => {
      meshes.forEach((mesh, curIndex) => {
        console.log(`Mesh at index ${index}, curIndex ${curIndex}, name: ${mesh.name}`); 

        if (mesh.name === "union" + id) {
          console.log("Found matching mesh. Replacing with unionized mesh.");
          bay[id] = index;
          element[id] = curIndex;
          loaded_meshes[index][curIndex].dispose();
          loaded_meshes[index][curIndex] = newMesh;  
       //   console.log("Unionized Mesh: ", newMesh);  
       console.log("New Loaded meshes: ", loaded_meshes[index][curIndex]);
        }
      });
    });
      originalMeshRef.current[id].mesh.isVisible = false;
      // originalMeshRef.current[id].mesh.setParent(newMesh);
      console.log("Created new mesh after union:", newMesh.name);



      if (currentBox.box) {
        console.log(`Disposing original box for ID ${id}`);
        currentBox.box.dispose();
        currentBox.box = null;
      }

  //    currentBox.selectedMesh.isVisible = false;
//currentBox.box.isVisible = false;

      setDialogInstances(prevDialogs => ({
        ...prevDialogs,
        [id]: {
          ...prevDialogs[id],
          isAnydDialogInUse: false,
        },
      }));
      setIsAnydDialogInUse(false);
    }
    setUnionStates((prevState) => ({
      ...prevState,
      [id]: true, // Mark this instance as being union
    }));
     console.log("Union State: ", setUnionStates);
  }, [boxInstances, data]);




  console.log("Dialog Instances State:", dialogInstances);



  return (
    <DoorDetailsContext.Provider
      value={{

        doors,
        setDoors,
        sizes,
        setUnionStates,
        unionStates,
        handlePositionX,
        handlePositionY,
        handleSizeChange,
        handleUnion,
        doorInstances,
        toggleDoorOpen,
        addDoorInstance,
        handleClose,
        setIsAnydDialogInUse,
        isAnydDialogInUse,
      }}
    >
      {children}
    </DoorDetailsContext.Provider>
  );
};

export const useDoorDetails = () => useContext(DoorDetailsContext);
