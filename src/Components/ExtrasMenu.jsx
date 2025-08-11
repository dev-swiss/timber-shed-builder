import React, { useState, useRef, useEffect } from 'react';
import './ExtrasMenu.css';
import { CSG, StandardMaterial, Color3, Mesh, HighlightLayer } from '@babylonjs/core';
import { setup_extras } from '../core/coreFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

let loadedMeshes = [];
let id = 0;

export const meshLoaderFrontAwning = (loadedMeshesInput) => {
  loadedMeshes = loadedMeshesInput;
  return loadedMeshes;
};

const ExtrasMenu = ({ itemClass }) => {
  const [dialogs, setDialogs] = useState([]);
  const [isAnyDialogInUse, setIsAnyDialogInUse] = useState(false);
  const dataRef = useRef(setup_extras());
  const dialogsRef = useRef([]);
  const deletedMeshesRef = useRef([]);
  const originalNamesRef = useRef(new Map());

  const addDialog = () => {
    if (isAnyDialogInUse) {
      alert('Please finish using the previous opening before creating a new one.');
      return;
    }

    const newDialog = {
      id: id++,
      box: null,
      width: 5,
      height: 1,
      position: 6,
      openings: false,
      selectedMesh: null,
      hl: new HighlightLayer(`hl-${id}`, dataRef.current[0].current),
      delay: 50,
      lastEventTime: 0,
      pointerMoveTimeout: null,
      inUse: false,
    };

    setDialogs([...dialogsRef.current, newDialog]);
    dialogsRef.current.push(newDialog);
  };

  const updateDialog = (dialogId, updates) => {
    const updatedDialogs = dialogsRef.current.map((dialog) =>
      dialog.id === dialogId ? { ...dialog, ...updates } : dialog
    );
    setDialogs(updatedDialogs);
    dialogsRef.current = updatedDialogs;

    if (updates.openings === false) {
      const deletedMesh = deletedMeshesRef.current.find((mesh) => mesh.dialogId === dialogId);
      if (deletedMesh) {
        const { originalMesh, originalParent } = deletedMesh;
        loadedMeshes.forEach((meshes, index) => {
          meshes.forEach((curMesh, curIndex) => {
            if (curMesh.name === originalMesh.name) {
              loadedMeshes[index][curIndex] = originalMesh;
            }
          });
        });

        if (originalParent) {
          originalParent.addChild(originalMesh);
        } else {
          originalMesh.parent = null;
        }

        originalMesh.isVisible = true;
        originalMesh.isUsed = false;
        deletedMesh.mesh.dispose();
        deletedMeshesRef.current = deletedMeshesRef.current.filter((m) => m.dialogId !== dialogId);
      }
    }
  };

  useEffect(() => {
    const handlePointerDown = (evt, pickResult) => {
      const pickInfo = dataRef.current[0].current.pick(dataRef.current[0].current.pointerX, dataRef.current[0].current.pointerY);
      const dialog = dialogsRef.current.find(d => d.openings && !d.selectedMesh);

      if (dialog && pickInfo.hit && isValidMeshForBox(pickInfo.pickedMesh)) {
        dialog.selectedMesh = pickInfo.pickedMesh;
        if (!dialog.box) {
          dialog.box = Mesh.CreateBox('box', 0.5, dataRef.current[0].current);
          const redMat = new StandardMaterial('redMat', dataRef.current[0].current);
          redMat.diffuseColor = new Color3(0, 1, 1);
          dialog.box.material = redMat;
          const boundingInfo = pickInfo.pickedMesh.getBoundingInfo();
          const center = boundingInfo.boundingBox.centerWorld;
          dialog.box.position.copyFrom(center);
          redMat.alpha = 0.7;
          updateDialog(dialog.id, { box: dialog.box, selectedMesh: dialog.selectedMesh });

          if (!originalNamesRef.current.has(dialog.selectedMesh)) {
            originalNamesRef.current.set(dialog.selectedMesh, dialog.selectedMesh.name);
          }
        }
      }
    };

    const handlePointerMove = (evt, pickResult) => {
      const currentTime = performance.now();
      const dialog = dialogsRef.current.find(d => d.openings && d.selectedMesh == null);

      if (dialog) {
        dialog.lastEventTime = currentTime;
        clearTimeout(dialog.pointerMoveTimeout);
        dialog.pointerMoveTimeout = setTimeout(() => {
          if (performance.now() - dialog.lastEventTime >= dialog.delay) {
            const result = dataRef.current[0].current.pick(dataRef.current[0].current.pointerX, dataRef.current[0].current.pointerY, null, null, dataRef.current[2]);
            if (result.hit && isValidMeshForBox(result.pickedMesh)) {
              dialog.hl.removeAllMeshes();
              dialog.hl.addMesh(result.pickedMesh, Color3.Teal());
            }
          }
        }, dialog.delay);
      }
    };

    dataRef.current[0].current.onPointerDown = handlePointerDown;
    dataRef.current[0].current.onPointerMove = handlePointerMove;

    return () => {
      dataRef.current[0].current.onPointerDown = null;
      dataRef.current[0].current.onPointerMove = null;
    };
  }, [dialogs]);

  const isValidMeshForBox = (mesh) => {
    return mesh && !['ground', 'skyBox', 'fGround', 'bGround', 'Left', 'Right', 'arrow', 'Barrow', 'Larrow', 'leftArrow', 'front', 'fLogo', 'leftplane', 'rightplane'].includes(mesh.name) && !mesh.isUsed;
  };

  const handleCut = (dialog) => {
    const { box, selectedMesh } = dialog;
    if (box.isVisible && selectedMesh.name !== 'ground') {
      const whiteMat = new StandardMaterial('whiteMat', dataRef.current[0].current);
      whiteMat.diffuseColor = new Color3(1, 1, 1);
      const aCSG = CSG.FromMesh(box);
      const bCSG = CSG.FromMesh(selectedMesh);
      selectedMesh.name = 'cut' + id;
      const subCSG = bCSG.subtract(aCSG);
      box.isVisible = false;
      const resultMesh = subCSG.toMesh(selectedMesh.name, whiteMat, dataRef.current[0].current);
      resultMesh.name = 'cut' + id;
      resultMesh.position = selectedMesh.position;
      loadedMeshes.forEach((meshes, index) => {
        meshes.forEach((mesh, curIndex) => {
          if (mesh.name === 'cut' + id) {
            loadedMeshes[index][curIndex] = resultMesh;
          }
        });
      });
      selectedMesh.isVisible = false;
      updateDialog(dialog.id, { inUse: false });
      setIsAnyDialogInUse(false);
      resultMesh.isUsed = true;
      deletedMeshesRef.current.push({ dialogId: dialog.id, mesh: resultMesh, originalMesh: selectedMesh, originalParent: selectedMesh.parent });
      id++;
    }
  };

  const handleWidth = (dialog, e) => {
    const width = e.target.value;
    updateDialog(dialog.id, { width });

    const originalName = originalNamesRef.current.get(dialog.selectedMesh);
    if (dialog.selectedMesh && ['FWall', 'BWall'].includes(originalName)) {
      dialog.box.scaling.x = width;
    } else if (dialog.selectedMesh && ['Rwall', 'Lwall'].includes(originalName)) {
      dialog.box.scaling.z = width;
    }

    // if (dialog.box && dialog.selectedMesh) {
    //   updateBoxPosition(dialog);
    // }
  };

  const handleHeight = (dialog, e) => {
    const height = e.target.value;
    updateDialog(dialog.id, { height });
    if (dialog.box) {
      dialog.box.scaling.y = height;
    }

    // if (dialog.box && dialog.selectedMesh) {
    //   updateBoxPosition(dialog);
    // }
  };

  const handlePositionY = (dialog, e) => {
    const position = e.target.value;
    updateDialog(dialog.id, { position });
    if (dialog.box) {
      dialog.box.position.y = position / 5;
    }

    // if (dialog.box && dialog.selectedMesh) {
    //   updateBoxPosition(dialog);
    // }
  };

  const updateBoxPosition = (dialog) => {
    const boundingInfo = dialog.selectedMesh.getBoundingInfo();
    const min = boundingInfo.boundingBox.minimumWorld;
    const max = boundingInfo.boundingBox.maximumWorld;
    const size = max.subtract(min);
    const center = min.add(size.scale(0.5));
    dialog.box.position.copyFrom(center);
  };

  const handleOpeningsToggle = (dialog) => {
    if (!isAnyDialogInUse) {
      updateDialog(dialog.id, { openings: !dialog.openings });
      setIsAnyDialogInUse(!dialog.openings);
      if (!dialog.openings) {
        updateDialog(dialog.id, { selectedMesh: null, box: null });
      }
    } else {
      alert('Please finish using the previous opening before creating a new one.');
    }
  };

  return (
    <div className={`extras-container ${itemClass}`}>
      {dialogs.length === 0 ? (
        <button onClick={addDialog} className='opening'>
          <FontAwesomeIcon icon={faSquarePlus} style={{ fontSize: '5rem' }} />
          Openings
        </button>
      ) : (
        dialogs.map((dialog) => (
          <div key={dialog.id} className={`extras-instance`}>
            {dialog.openings ? (
              <>
                <span className="extra-headings">
                  <p>Openings</p>
                  <FontAwesomeIcon icon={faTimesCircle} onClick={() => handleOpeningsToggle(dialog)} />
                </span>
                <div className="field-box">
                  <span className='inner-headings'>Width</span>
                  <div className="range-box">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={dialog.width}
                      onChange={(e) => handleWidth(dialog, e)}
                    />
                    <input
                      className="sizeInput"
                      type="text"
                      value={dialog.width}
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
                      value={dialog.height}
                      onChange={(e) => handleHeight(dialog, e)}
                    />
                    <input
                      className="sizeInput"
                      type="text"
                      value={dialog.height}
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
                      value={dialog.position}
                      onChange={(e) => handlePositionY(dialog, e)}
                    />
                    <input
                      className="sizeInput"
                      type="text"
                      value={dialog.position}
                      readOnly
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleCut(dialog)}
                  style={{ border: '1px solid black', padding: '5px', borderRadius: '2%' }}>ok</button>
              </>
            ) : (
              <button onClick={() => handleOpeningsToggle(dialog)} className='opening'>
                <FontAwesomeIcon icon={faSquarePlus} style={{ fontSize: '5rem' }} />
                Openings
              </button>
            )}
          </div>
        ))
      )}
      {dialogs.length > 0 && <button onClick={addDialog}>Add Dialog</button>}
    </div>
  );
};
export default ExtrasMenu;

