import React, { useState, useRef, useEffect } from 'react';
import { CSG, StandardMaterial, Color3, Mesh, HighlightLayer } from '@babylonjs/core';
import { setup_extras } from '../../../core/coreFunctions'; // Ensure the path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faDoorClosed } from '@fortawesome/free-solid-svg-icons'; // Use an appropriate icon
import './rollerDoor.css'; // Ensure you create and import the CSS file

var loaded_meshes = [];
var id = 0;

export const meshLoaderRollerDoor = (loadedMeshes) => {
  loaded_meshes = loadedMeshes;
  return loaded_meshes;
}

const RollerDoorMenu = ({ itemClass }) => {
  const box = useRef(null);
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(1);
  const [position, setPosition] = useState(6);
  const [doors, setDoors] = useState(false);
  const selectedMesh = useRef(null);
  const data = setup_extras();
  const hl = useRef(new HighlightLayer("hl", data[0].current));
  const delay = 50;
  let lastEventTime = 0;
  let pointerMoveTimeout = null;

  useEffect(() => {
    if (doors) {
      const handlePointerDown = (evt, pickResult) => {
        const pickInfo = data[0].current.pick(data[0].current.pointerX, data[0].current.pointerY);
        selectedMesh.current = pickInfo.pickedMesh;
        if (pickInfo.hit) {
          if (isValidMeshForBox(pickInfo.pickedMesh)) {
            box.current = Mesh.CreateBox("box", 0.5, data[0].current);
            const redMat = new StandardMaterial("redMat", data[0].current);
            redMat.diffuseColor = new Color3(0, 1, 1);
            box.current.material = redMat;
            const boundingInfo = pickInfo.pickedMesh.getBoundingInfo();
            const center = boundingInfo.boundingBox.center;
            box.current.position.copyFrom(center);
            box.current.position.addInPlace(selectedMesh.current.position);
            redMat.alpha = 0.7;
          }
        }
      };

      data[0].current.onPointerDown = handlePointerDown;

      return () => {
        data[0].current.onPointerDown = null; // Cleanup
      };
    }
  }, [doors]);

  useEffect(() => {
    if (doors) {
      const handlePointerMove = (evt, pickResult) => {
        const currentTime = performance.now();
        lastEventTime = currentTime;
        clearTimeout(pointerMoveTimeout);
        pointerMoveTimeout = setTimeout(() => {
          if (performance.now() - lastEventTime >= delay) {
            const result = data[0].current.pick(data[0].current.pointerX, data[0].current.pointerY, null, null, data[2]);
            if (result.hit && isValidMeshForBox(result.pickedMesh)) {
              hl.current.removeAllMeshes();
              hl.current.addMesh(result.pickedMesh, Color3.Teal());
            }
          }
        }, delay);
      };
      data[0].current.onPointerMove = handlePointerMove;

      return () => {
        data[0].current.onPointerMove = null; // Cleanup
      };
    }
  }, [doors]);

  function isValidMeshForBox(mesh) {
    // Add conditions here to determine if the mesh is valid for placing the box
    return mesh && mesh.name !== 'ground' && mesh.name !== 'skyBox' && mesh.name !== 'fGround' &&
           mesh.name !== 'bGround' && mesh.name !== 'Left' && mesh.name !== 'Right' &&
           mesh.name !== 'arrow' && mesh.name !== 'Barrow' && mesh.name !== 'Larrow';
  }

  const handleCut = () => {
    if (box.current.isVisible && selectedMesh.current.name !== 'ground') {
      const whiteMat = new StandardMaterial("whiteMat", data[0].current);
      whiteMat.diffuseColor = new Color3(1, 1, 1);
      const aCSG = CSG.FromMesh(box.current);
      const bCSG = CSG.FromMesh(selectedMesh.current);
      selectedMesh.current.name = "cut" + id;
      const subCSG = bCSG.subtract(aCSG);
      box.current.isVisible = false;
      var resultMesh = subCSG.toMesh(selectedMesh.current.name, whiteMat, data[0].current);
      resultMesh.name = "cut" + id;
      resultMesh.position = selectedMesh.current.position;
      loaded_meshes.forEach((meshes, index) => {
        meshes.forEach((mesh, curIndex) => {
          console.log(mesh.name);
          if (mesh.name === 'cut' + id) {
            console.log("name of loaded before: ", loaded_meshes[index][curIndex]);
            loaded_meshes[index][curIndex] = resultMesh;
            console.log("name of loaded: ", loaded_meshes[index][curIndex]);
          }
        });
      });
      selectedMesh.current.dispose();
      id++;
    }
  };

  const handleWidth = (e) => {
    setWidth(e.target.value);
    if (selectedMesh.current.name === 'FWall' || selectedMesh.current.name === 'BWall') {
      console.log("in front and back walls");
      box.current.scaling.x = e.target.value;
    } else if (selectedMesh.current.name === 'Rwall' || selectedMesh.current.name === 'Lwall') {
      console.log("in left and right walls");
      box.current.scaling.z = e.target.value;
    }
  };

  const handleHeight = (e) => {
    setHeight(e.target.value);
    box.current.scaling.y = e.target.value;
  };

  const handlePositionY = (e) => {
    setPosition(e.target.value);
    box.current.position.y = e.target.value / 5;
  };

  return (
    <div className={`roller-door-container ${itemClass}`}>
      {doors === true ? <>
        <span className="roller-door-headings">
          <p>Roller Door</p>
          <FontAwesomeIcon icon={faTimesCircle} onClick={() => setDoors(!doors)} />
        </span>
        <div className="field-box">
          <span className='inner-headings'>Width</span>
          <div className="range-box">
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={width}
              onChange={(e) => handleWidth(e)}
            />
            <input
              className="sizeInput"
              type="text"
              value={width}
              readOnly
            />
          </div>
        </div>
        <div className="field-box">
          <span className='inner-headings'>Height</span>
          <div className="range-box">
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={height}
              onChange={(e) => handleHeight(e)}
            />
            <input
              className="sizeInput"
              type="text"
              value={height}
              readOnly
            />
          </div>
        </div>
        <div className="field-box">
          <span className='inner-headings'>Y</span>
          <div className="range-box">
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={position}
              onChange={(e) => handlePositionY(e)}
            />
            <input
              className="sizeInput"
              type="text"
              value={position}
              readOnly
            />
          </div>
        </div>
        <button
          onClick={() => handleCut()}
          style={{ border: '1px solid black', padding: '5px', borderRadius: '2%' }}>ok</button>
      </>
        : <>
          <button onClick={() => setDoors(!doors)} className='roller-door-toggle-button'>
            <FontAwesomeIcon icon={faDoorClosed} style={{ fontSize: '5rem' }} />
            Roller Door
          </button>
        </>
      }
    </div>
  );
};

export default RollerDoorMenu;
