import React, { useState, useRef, useEffect } from "react";
import { ArcRotateCamera, FreeCamera, Vector3, HemisphericLight, Engine, MeshExploder, CSG, MeshBuilder, StandardMaterial, Color3, DynamicTexture, Texture } from "@babylonjs/core";
import * as BABYLON from 'babylonjs'
import * as core from "../core/coreFunctions";
import SceneComponent from "./SceneComponent";
import * as gable from "../Structure/gable";
import { get_loaded_meshes } from './Plan'

import { loaded_meshes_for_mezzanine } from "./MezzanineMenu";
import { meshLoader } from "./WallsMenu";
import {apimeshloader} from "./ApiConnection";
import { meshLoaderopening } from "./OpeningDetailsContext";
import {skymeshLoaderopening} from "./Extras/skylight/skylight"
import { get_height_update_details } from './LeftAwningOption'
import { get_height_update_details_right } from './RightAwningOption'
import { getLeftAwningArrow, getRightAwningArrow, loaded_meshes_for_awnings } from './AwningsMenu';
import { meshLoaderFrontAwning } from './Extras/openings/ExtrasMenu';
import { meshLoaderPADoor } from "./Extras/PADoor/DoorDetailsContext";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import logo from '../logo.png'
import QRCode from 'qrcode'
import { sceneLoaderColor, meshLoaderColor } from "./ColoursMenu";
import { sceneLoaderSize, meshLoaderSize } from "./SizeMenu";
import { toPng, toJpeg } from 'html-to-image';
// import { meshLoadersky } from "./Extras/skylight/skylight";



const useLocalStorageRafterType = () => {
  const raftertypeRef = useRef(localStorage.getItem('rafter'));
  useEffect(() => {
    const intervalId = setInterval(() => {
      // console.log("rafter type: I-beam")
      const newSlabSetting = localStorage.getItem('rafter');
      if (newSlabSetting !== raftertypeRef.current) {
        // console.log("running logic")
        // camera.current.alpha = parseFloat(newCameraAngle;
        raftertypeRef.current = newSlabSetting;
        var prevPitch = parseInt(localStorage.getItem("pitch"))
        localStorage.setItem("pitch", 12)
        setTimeout(() => {
          localStorage.setItem("pitch", prevPitch)
        }, 100)
        //localStorage.setItem("pitch", prevPitch)
      }
    }, 1000); // Adjust the interval as needed (in milliseconds)
    return () => clearInterval(intervalId);

  }, []);
  return;
}



//<============================================ custom Hook for managing awning option ======================================>//
const useLocalStoragePolling = (loadedMeshes, text, frontBackText, leftText, sceneRef) => {
  const leftAwningRef = useRef(localStorage.getItem('leftAwning'));
  const rightAwningRef = useRef(localStorage.getItem('rightAwning'));
  const frontAwningRef = useRef(localStorage.getItem('frontAwning'));
  const backAwningRef = useRef(localStorage.getItem('backAwning'));
  var prevOffset = 0;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newLeftAwning = localStorage.getItem('leftAwning');
      const newRightAwning = localStorage.getItem('rightAwning');
      const newFrontAwning = localStorage.getItem('frontAwning');
      const newBackAwning = localStorage.getItem('backAwning');

      //<=============== for left Awning ===============>
      if (newLeftAwning !== leftAwningRef.current) {
        leftAwningRef.current = newLeftAwning;
        if (newLeftAwning === 'true') {
          localStorage.setItem("LeftAwningWallsVisible", true)
          loadedMeshes.current.forEach((meshes) => {
            meshes.forEach((mesh) => {
              if (mesh && (mesh.name === "leanToLeft" || mesh.name === 'leanToLeftWalls' || mesh.name === 'leanToLeftRoofs' || mesh.name === 'leantoleftcols' || mesh.name === 'leantoleftcolfront' || mesh.name === 'leantoleftcolback'
              )) {
                console.log("hit mesh: ", mesh.name)
                mesh.isVisible = true;
              }
              if(mesh.name === 'leftAwningGroundTile'){
                if(localStorage.getItem('slab') === 'Enable'){
                  mesh.isVisible = true;
                }
              }

              if (mesh.name === 'Larrow') {
                if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0 && sessionStorage.getItem("leftArrowPosition_") > 0) {
                  // console.log("should be here")
                  mesh.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + parseFloat(sessionStorage.getItem("leftArrowPosition_"))
                } else {
                  if (sessionStorage.getItem("leftArrowPosition_") > 0) {
                    mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_"))
                    // console.log("or here")
                  } else {
                    mesh.position.x += 2.5;
                    sessionStorage.setItem("leftArrowPositionAfterEnabling_", 2.5)
                    // console.log("worst case")
                  }
                }
              }

              text.current.forEach((mesh) => {
                if (mesh.name === 'Left') {
                  if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0) {
                    mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 10;
                  } else {
                    mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 10;
                  }
                } else if (mesh.name === 'leftplane') {
                  if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0) {
                    mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 13;
                  } else {
                    mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 13;
                  }
                }
              })

            });
          });
          leftText.current.forEach((mesh) => {
            if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0) {
              if (sessionStorage.getItem("leftArrowPosition_") > 0) {

                mesh.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + parseFloat(sessionStorage.getItem("leftArrowPosition_")) + parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 4;
                // console.log("all caser: ", mesh.position.x)
              } else {
                // console.log("execing ")
                mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 4;
              }
            } else {
              if (sessionStorage.getItem("leftArrowPosition_") > 0) {
                mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_")) + parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 4;
              } else {
                mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 4
              }
            }
          })
        } else if (newLeftAwning === 'false') {
          loadedMeshes.current.forEach((meshes) => {
            meshes.forEach((mesh) => {
              if (mesh && (mesh.name === "leanToLeft" || mesh.name === 'leanToLeftWalls' || mesh.name === 'leanToLeftRoofs' || mesh.name === 'leantoleftcols'
                || mesh.name === 'leanToLeftPartWall' || mesh.name === 'leanToLeftTriangle' || mesh.name === 'leanToLeftPartWallBack' || mesh.name === 'leanToLeftTriangleBack'
                || mesh.name === 'leanToLeftPurlins' || mesh.name === 'leantoleftcolfront' || mesh.name === 'leantoleftcolback' || mesh.name === 'altruss' || mesh.name === 'abltruss'
                || mesh.name === 'afltruss' || mesh.name === 'leftAwningGroundTile'
              )) {
                mesh.isVisible = false;
              }
              if (mesh.name === "cantileverLeft") {
                mesh.isVisible = false;
              }
              if (mesh.name === 'Larrow') {
                if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0) {
                  mesh.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                } else {
                  if (sessionStorage.getItem("leftArrowPosition_") > 0) {
                    // console.log("only this")
                    mesh.position.x = 0
                    sessionStorage.setItem("leftArrowPositionAfterEnabling_", 0)
                  } else {
                    if (mesh.position.x - 2.5 <= 0 || mesh.position.x - 3 <= 0) {
                      console.log("thisssss")
                      mesh.position.x = 0
                      sessionStorage.setItem("leftArrowPositionAfterEnabling_", 0)
                    } else {
                      console.log("not this: ", mesh.position.x)
                      mesh.position.x -= 2.5
                      sessionStorage.setItem("leftArrowPositionAfterEnabling_", 0)
                    }
                  }
                }
                // sessionStorage.setItem("LarrowPrevPosition", mesh.position.x );
                //   // mesh.position.x -= 2.5;
                //   var width = parseFloat(localStorage.getItem("width"));
                //   mesh.position.x = 0.4 + width/20;
                //   if(parseFloat(sessionStorage.getItem("ArrowPosition_")) !== 0){

                //     sessionStorage.setItem("ArrowPosition_",mesh.position.x + 4);
                //   }
              };
              text.current.forEach((mesh) => {
                if (mesh.name === 'Left') {
                  if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0) {
                    mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 10;
                  } else {
                    mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 10;
                  }
                }
                if (mesh.name === 'leftplane') {
                  if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0) {
                    mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 13;
                  } else {
                    mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 13;
                  }

                }
              })
            });
          });
          leftText.current.forEach((mesh) => {
            // if(mesh.position.x >= 6.5)
            if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0) {
              mesh.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 4;
            } else {
              if (sessionStorage.getItem("leftArrowPosition_") > 0) {
                // console.log("this")
                mesh.position.x = 4;
              } else {
                // console.log("or this")
                mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 4
              }
            }
          })
          sessionStorage.setItem("leftArrowPosition_",0)
          sessionStorage.setItem("leftArrowPositionAfterEnabling_", 0)
        };
      }
      //<=============== for right Awning ===============>
      if (newRightAwning !== rightAwningRef.current) {
        rightAwningRef.current = newRightAwning;
        if (newRightAwning === 'true') {
          localStorage.setItem("RightAwningWallsVisible", true)
          loadedMeshes.current.forEach((meshes) => {
            meshes.forEach((mesh) => {
              if (mesh && mesh.name === "leanToRight" || mesh.name === 'leanToRightRoofs' || mesh.name === 'leantorightcols' || mesh.name === 'leantorightcolback' || mesh.name === 'leantorightcolfront' || mesh.name === 'leanToRightWalls') {
                mesh.isVisible = true;
              }
              if(mesh.name === 'rightAwningGroundTile'){
                if(localStorage.getItem('slab') === 'Enable'){
                  mesh.isVisible = true;
                }
              }
            });
          });
          text.current.forEach((mesh) => {
            if (mesh.name === 'Right' || mesh.name === 'rightplane') {
              mesh.position.x -= 5;
            }
          });
        } else if (newRightAwning === 'false') {
          loadedMeshes.current.forEach((meshes) => {
            meshes.forEach((mesh) => {
              if (mesh && mesh.name === "leanToRight" || mesh.name === 'leanToRightRoofs' || mesh.name === 'leantorightcols' || mesh.name === 'leanToRightWalls'
                || mesh.name === 'leanToRightPartWall' || mesh.name === 'leanToRightTriangle' || mesh.name === 'leanToRightPartWallBack' || mesh.name === 'leanToRightTriangleBack'
                || mesh.name === 'leanToRightPurlins' || mesh.name === 'leantorightcolback' || mesh.name === 'leantorightcolfront' || mesh.name === 'ratruss' || mesh.name === 'abrtruss'
                || mesh.name === 'afrtruss' || mesh.name === 'rightAwningGroundTile'
              ) {
                mesh.isVisible = false;
              }
              if (mesh.name === "cantileverRight") {
                mesh.isVisible = false;
              }
            });
          });
          text.current.forEach((mesh) => {
            if (mesh.name === 'Right') {
              console.log("mesh position for Right: ", mesh.position.x)
            // Prevent the value from ever increasing above -5
            if (mesh.position.x >= -5) {
              mesh.position.x = -5; // Force it to stay at -5 or below
            } else {
              // Allow position to decrease further
              mesh.position.x += 5;
            }
            }else if (mesh.name === 'rightplane'){
              console.log("mesh position for Right plane: ", mesh.position.x)
              if(mesh.position.x >= -15){
                mesh.position.x = -10
              }else{
                mesh.position.x += 5
              }
            }
          });
        };
      }
      //<=============== for front Awning ===============>
      if (newFrontAwning !== frontAwningRef.current) {
        frontAwningRef.current = newFrontAwning;
        var frontBayOffset = gable.recieveFrontBayOffset();
        if (newFrontAwning === 'true') {
          loadedMeshes.current.forEach((meshes) => {
            meshes.forEach((mesh) => {
              if (mesh && mesh.name === "leanToFrontRoof" || mesh.name === 'leanToFrontCols') {
                mesh.isVisible = true;
              }
              if (mesh.name === 'arrow' || mesh.name === 'fGround' || mesh.name === 'fLogo') {
                if (mesh.name === 'arrow') {
                  if (sessionStorage.getItem("frontArrowPosition_") > 0) {
                    var curr = localStorage.getItem("frontAwningLength")
                    if (curr == 15) {
                      localStorage.setItem("frontAwningLength", curr - 1)
                    } else {
                      localStorage.setItem("frontAwningLength", curr - 1)
                    }

                    mesh.position.z = parseFloat(sessionStorage.getItem("frontArrowPosition_"))
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                    // console.log("set: ", mesh.position.z)
                  } else {
                    if (frontBayOffset > 0) {
                      mesh.position.z = frontBayOffset + 6;
                      gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                    } else {
                      mesh.position.z = 6;
                      gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                    }
                  }
                }
                if (mesh.name === 'fGround') {
                  if (sessionStorage.getItem("frontGroundPosition_") > 0) {
                    mesh.position.z = parseFloat(sessionStorage.getItem("frontGroundPosition_"))
                  } else {
                    if (frontBayOffset > 0) {
                      mesh.position.z = frontBayOffset + 9;
                    } else {
                      mesh.position.z = 9;
                    }
                  }
                }
                if (mesh.name === 'fLogo') {
                  if (sessionStorage.getItem("frontLogoPosition_") > 0) {
                    mesh.position.z = parseFloat(sessionStorage.getItem("frontLogoPosition_"))
                  } else {
                    if (frontBayOffset > 0) {
                      mesh.position.z = frontBayOffset + 12;
                    } else {
                      mesh.position.z = 12;
                    }
                  }
                }
              }
            });
          });
          //sessionStorage.setItem("")
          // frontBackText.current.forEach((mesh) => {
          //   if(mesh.name === 'front'){
          //       mesh.position.z += position + 4;
          //   }
          // });
          prevOffset = frontBayOffset;
        } else if (newFrontAwning === 'false') {
          var frontBayOffset = gable.recieveFrontBayOffset();
          loadedMeshes.current.forEach((meshes) => {
            meshes.forEach((mesh) => {
              if (mesh && mesh.name === "leanToFrontRoof" || mesh.name === 'leanToFrontCols') {
                mesh.isVisible = false;
              }
              if (mesh.name === "cantileverFront") {
                mesh.isVisible = false;
              }
              if (mesh.name === 'arrow') {
                mesh.position.z = frontBayOffset + 3
                gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
              }
              if (mesh.name === 'fGround') {
                mesh.position.z = frontBayOffset + 6;
              }
              if (mesh.name === 'fLogo') {
                mesh.position.z = frontBayOffset + 9;
              }
            });
          });
        };
      }
      //<=============== for back Awning ===============>
      if (newBackAwning !== backAwningRef.current) {
        backAwningRef.current = newBackAwning;
        if (newBackAwning === 'true') {
          loadedMeshes.current.forEach((meshes) => {
            meshes.forEach((mesh) => {
              if (mesh && mesh.name === "leanToBackRoof" || mesh.name === 'leanToBackCols') {
                mesh.isVisible = true;
              }
              if (mesh.name === 'Barrow' || mesh.name === 'bGround' || mesh.name === 'bLogo') {
                mesh.position.z -= 4;
                gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);

              }
            });
          });
        } else if (newBackAwning === 'false') {
          loadedMeshes.current.forEach((meshes) => {
            meshes.forEach((mesh) => {
              if (mesh && mesh.name === "leanToBackRoof" || mesh.name === 'leanToBackCols') {
                mesh.isVisible = false;
              }
              if (mesh.name === "cantileverBack") {
                mesh.isVisible = false;
              }
              if (mesh.name === 'Barrow' || mesh.name === 'bGround' || mesh.name === 'bLogo') {
                if (mesh.name === 'Barrow') {
                  if (mesh.position.z <= -18) {
                    mesh.position.z += 4;
                  } else if (mesh.position <= -17) {
                    mesh.position.z += 4;
                  } else {
                    mesh.position.z += 4.1;
                  }
                  gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);

                }
                if (mesh.name === 'bGround') {
                  mesh.position.z += 4;

                }
                if (mesh.name === 'bLogo') {
                  mesh.position.z += 4;

                }
              }
            });
          });
          frontBackText.current.forEach((mesh) => {
            if (mesh.name === 'back') {
              if (mesh.position.z >= -17.34)
                mesh.position.z += 4;
            }
          });

          localStorage.setItem("backAwningLength", 5);
        };
      }
    }, 1000); //(in milliseconds)

    return () => clearInterval(intervalId);
  }, []);

  return [leftAwningRef.current, rightAwningRef.current];
};

const useLocalStoragePollingCameraAngle = (camera, sceneRef) => {
  const cameraAngleRef = useRef(localStorage.getItem('Angle'));
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCameraAngle = localStorage.getItem('Angle');
      if (newCameraAngle !== cameraAngleRef.current) {
        // camera.current.alpha = parseFloat(newCameraAngle;
        cameraAngleRef.current = newCameraAngle;
        if (cameraAngleRef.current === 'Rotate') {
          camera.current = new ArcRotateCamera("camera", 1.2, 1.2, 20, new Vector3(0, 1, 1), sceneRef.current);
        } else if (cameraAngleRef.current === 'Pan') {
          camera.current = new FreeCamera("freeCamera", new Vector3(0, 0, -10), sceneRef.current);
        }
      }
    }, 1000); // Adjust the interval as needed (in milliseconds)
    return () => clearInterval(intervalId);

  }, []);
  return camera.current;
}

const useLocalStoragePollingSlabSettings = (loadedMeshes) => {
  const slabSettingRef = useRef(localStorage.getItem('slab'));
  useEffect(() => {
    const intervalId = setInterval(() => {
      // console.log("running")
      const newSlabSetting = localStorage.getItem('slab');
      if (newSlabSetting !== slabSettingRef.current) {
        // camera.current.alpha = parseFloat(newCameraAngle;
        slabSettingRef.current = newSlabSetting;
        var prevPitch = parseInt(localStorage.getItem("pitch"))
        localStorage.setItem("pitch", 12)
        setTimeout(() => {
          localStorage.setItem("pitch", prevPitch)
        }, 100)
        //localStorage.setItem("pitch", prevPitch)
        // if(slabSettingRef.current === 'Enable'){
        //   loadedMeshes.current.forEach((meshes) => {
        //     meshes.forEach((mesh) => {
        //       if(mesh.name === 'groundTile'){
        //         mesh.isVisible = true;
        //       }
        //     })
        //   })
        // }else if(slabSettingRef.current === 'Disable'){
        //     loadedMeshes.current.forEach((meshes) => {
        //       meshes.forEach((mesh) => {
        //         if(mesh.name === 'groundTile'){
        //           mesh.isVisible = false;
        //         }
        //       })
        //     })
        //   }
      }
    }, 1000); // Adjust the interval as needed (in milliseconds)
    return () => clearInterval(intervalId);

  }, []);
  return;
}

const useLocalStoragePollingSlabHeight = () => {
  const slabSettingRef = useRef(localStorage.getItem('slabSize'));
  useEffect(() => {
    const intervalId = setInterval(() => {
      // console.log("running heihgt")
      const newSlabSetting = localStorage.getItem('slabSize');
      if (newSlabSetting !== slabSettingRef.current) {
        // console.log("running logic")
        // camera.current.alpha = parseFloat(newCameraAngle;
        slabSettingRef.current = newSlabSetting;
        var prevPitch = parseInt(localStorage.getItem("pitch"))
        localStorage.setItem("pitch", 12)
        setTimeout(() => {
          localStorage.setItem("pitch", prevPitch)
        }, 100)
        //localStorage.setItem("pitch", prevPitch)
      }
    }, 1000); // Adjust the interval as needed (in milliseconds)
    return () => clearInterval(intervalId);

  }, []);
  return;
}
//<============================================ custom Hook for managing awning options ======================================>//
const useLocalStoragePollingOptions = (loadedMeshes, text, prevLeftAwningLength, prevRightAwningLength, leftText, sceneRef) => {
  const leftAwningLengthRef = useRef(parseInt(localStorage.getItem('leftAwningLength')));
  const rightAwningLengthRef = useRef(parseInt(localStorage.getItem('rightAwningLength')));
  const frontAwningLengthRef = useRef(parseInt(localStorage.getItem('frontAwningLength')));
  const backAwningLengthRef = useRef(parseInt(localStorage.getItem('backAwningLength')));
  const leftAwningPitchRef = useRef(parseFloat(localStorage.getItem('leftAwningPitch')));
  const rightAwningPitchRef = useRef(parseFloat(localStorage.getItem('rightAwningPitch')));
  const numberOfBaysRef = useRef(parseInt(localStorage.getItem('bay_no')));
  const numberOfBaysRightRef = useRef(parseInt(localStorage.getItem('bay_no')));



  useEffect(() => {
    leftAwningLengthRef.current = 10
    rightAwningLengthRef.current = 10
    frontAwningLengthRef.current = 5
    backAwningLengthRef.current = 5
    leftAwningPitchRef.current = 2.5;
    rightAwningPitchRef.current = 2.5;
    numberOfBaysRef.current = 3;
    numberOfBaysRightRef.current = 3;
    var heightArrow = null;
    var rightHeightArrow = null;
    var heightArrow1 = null;
    var rightHeightArrow1 = null;
    var heightArrow2 = null;
    var rightHeightArrow2 = null;
    var recievedFromAwningsMenu = false;
    var recievedFromLeftAwningsMenu = false;
    var recievedFromAppendToFront = false;
    var recievedFromRightAwningsMenu = false;
    var recievedFromRightAwningsMenu = false;
    var recievedFromRightAppendToFront = false;
    const intervalId = setInterval(() => {
      const newLeftAwningLength = parseInt(localStorage.getItem('leftAwningLength'));
      const newRightAwningLength = parseInt(localStorage.getItem('rightAwningLength'));
      const newFrontAwningLength = parseInt(localStorage.getItem('frontAwningLength'));
      const newBackAwningLength = parseInt(localStorage.getItem('backAwningLength'));
      const newLeftAwningPitch = parseFloat(localStorage.getItem('leftAwningPitch'));
      const newRightAwningPitch = parseFloat(localStorage.getItem('rightAwningPitch'))
      const newNumberOfBays = parseInt(localStorage.getItem('bay_no'))
      const newNumberOfBaysRight = parseInt(localStorage.getItem('bay_no'))
      if (newLeftAwningPitch !== leftAwningPitchRef.current) {
        leftAwningPitchRef.current = newLeftAwningPitch;
        if (localStorage.getItem("rightAwning") === 'true' || localStorage.getItem("rightCantilever") === "true") {
          rightHeightArrow = core.sendRightHeightArrow()
        }
        heightArrow = core.sendHeightArrow()
        setTimeout(() => {
          if (localStorage.getItem("rightAwning") === 'true' || localStorage.getItem("rightCantilever") === "true") {
            rightHeightArrow = core.sendRightHeightArrow()
          }
          heightArrow = core.sendHeightArrow()
        }, 1000)
        recievedFromLeftAwningsMenu = true;
        recievedFromAppendToFront = false;
        recievedFromAwningsMenu = false;
      } else if (newNumberOfBays !== numberOfBaysRef.current) {
        numberOfBaysRef.current = newNumberOfBays;
        if (localStorage.getItem("rightAwning") === 'true' || localStorage.getItem("rightCantilever") === "true") {
          rightHeightArrow1 = core.sendRightHeightArrow()
        }
        heightArrow1 = core.sendHeightArrow()
        setTimeout(() => {
          if (localStorage.getItem("rightAwning") === 'true' || localStorage.getItem("rightCantilever") === "true") {
            rightHeightArrow1 = core.sendRightHeightArrow()
          }
          heightArrow1 = core.sendHeightArrow()
        }, 1000)
        recievedFromLeftAwningsMenu = false;
        recievedFromAppendToFront = true;
        recievedFromAwningsMenu = false;
      } else if (heightArrow == null) {
        // console.log("in null");
        if (localStorage.getItem("rightAwning") || localStorage.getItem("rightCantilever") === "true") {
          rightHeightArrow2 = getRightAwningArrow();
        }
        heightArrow2 = getLeftAwningArrow();
        setTimeout(() => {
          if (localStorage.getItem("rightAwning") || localStorage.getItem("rightCantilever") === "true") {
            rightHeightArrow2 = getRightAwningArrow();
          }
          heightArrow2 = core.sendHeightArrow()
        }, 1000)
        recievedFromLeftAwningsMenu = false;
        recievedFromAppendToFront = false;
        recievedFromAwningsMenu = true;
      }

      if (newRightAwningPitch !== rightAwningPitchRef.current) {
        rightAwningPitchRef.current = newRightAwningPitch;
        rightHeightArrow = core.sendRightHeightArrow()
        if (localStorage.getItem("leftAwning") || localStorage.getItem("leftCantilever")) {
          heightArrow = core.sendHeightArrow()
        }
        setTimeout(() => {
          rightHeightArrow = core.sendRightHeightArrow()
          if (localStorage.getItem("leftAwning") || localStorage.getItem("leftCantilever")) {
            heightArrow = core.sendHeightArrow()
          }
        }, 1000)
        recievedFromRightAwningsMenu = true;
        recievedFromRightAppendToFront = false;
        recievedFromRightAwningsMenu = false;
      } else if (newNumberOfBaysRight !== numberOfBaysRightRef.current) {
        numberOfBaysRightRef.current = newNumberOfBaysRight;
        rightHeightArrow1 = core.sendRightHeightArrow()
        if (localStorage.getItem("leftAwning") || localStorage.getItem("leftCantilever")) {
          heightArrow1 = core.sendHeightArrow()
        }
        setTimeout(() => {
          rightHeightArrow1 = core.sendRightHeightArrow()
          if (localStorage.getItem("leftAwning") || localStorage.getItem("leftCantilever")) {
            heightArrow1 = core.sendHeightArrow()
          }
        }, 1000)
        recievedFromRightAwningsMenu = false;
        recievedFromRightAppendToFront = true;
        recievedFromRightAwningsMenu = false;
      } else if (rightHeightArrow == null) {
        // console.log("in default")
        rightHeightArrow2 = getRightAwningArrow();
        if (localStorage.getItem("lefttAwning") || localStorage.getItem("leftCantilever")) {
          heightArrow2 = getLeftAwningArrow();
        }
        setTimeout(() => {
          rightHeightArrow2 = getRightAwningArrow();
          if (localStorage.getItem("lefttAwning") || localStorage.getItem("leftCantilever")) {
            heightArrow2 = getLeftAwningArrow();
          }
        }, 1000)
        recievedFromRightAwningsMenu = false;
        recievedFromRightAppendToFront = false;
        recievedFromRightAwningsMenu = true;
      }

      if (
        newLeftAwningLength !== leftAwningLengthRef.current ||
        newRightAwningLength !== rightAwningLengthRef.current ||
        newFrontAwningLength !== frontAwningLengthRef.current ||
        newBackAwningLength !== backAwningLengthRef.current
      ) {
        if (newLeftAwningLength !== leftAwningLengthRef.current) {
          prevLeftAwningLength = leftAwningLengthRef.current;
          leftAwningLengthRef.current = newLeftAwningLength;

          //factor for scaling meshes
          var scalingFactor = (newLeftAwningLength - prevLeftAwningLength) * 0.09;
          var roundedScalingFactor = Math.round(scalingFactor * 100) / 100;

          var boundinginfo;
          loadedMeshes.current.forEach((meshes) => {
            meshes.forEach((mesh) => {
              if (mesh.name === 'container_left' || mesh.name === 'cantileverLeft' || mesh.name === 'leftAwningGroundTile') {
                if(mesh.name === 'leftAwningGroundTile'){
                  mesh.setPivotPoint(new Vector3(-1.25, 0, 0));
                  mesh.scaling.x = newLeftAwningLength / 10;
                }else{
                  mesh.setPivotPoint(new Vector3(2.5, 0, 0));
                  mesh.scaling.x = newLeftAwningLength / 10;
                  core.leftawninglengthgetter(mesh.scaling.x);
                }
              }
              if (mesh.name === 'Larrow') {
                // mesh.position.x += roundedScalingFactor + roundedScalingFactor;
                // core.getarrowpos(mesh.position.x);
                // sessionStorage.setItem("ArrowPosition_",mesh.position.x);
                if (newLeftAwningLength == 1) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 0.25;
                    //mesh.poition.
                    sessionStorage.setItem("leftArrowPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 0.25 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftArrowPosition_", 0.25);
                  }
                } else if (newLeftAwningLength == 2) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 0.5;
                    sessionStorage.setItem("leftArrowPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 0.5 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftArrowPosition_", 0.5);
                  }
                } else if (newLeftAwningLength == 3) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 0.75;
                    sessionStorage.setItem("leftArrowPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 0.75 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftArrowPosition_", 0.75);
                  }
                } else if (newLeftAwningLength == 4) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 1;
                    sessionStorage.setItem("leftArrowPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 1 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftArrowPosition_", 1);
                  }
                } else if (newLeftAwningLength == 5) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 1.25;
                    sessionStorage.setItem("leftArrowPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 1.25 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftArrowPosition_", 1.25);
                  }
                } else if (newLeftAwningLength == 6) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 1.5;
                    sessionStorage.setItem("leftArrowPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 1.5 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftArrowPosition_", 1.5);
                  }
                } else if (newLeftAwningLength == 7) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 1.75;
                    sessionStorage.setItem("leftArrowPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 1.75 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftArrowPosition_", 1.75);
                  }
                } else if (newLeftAwningLength == 8) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 2;
                    sessionStorage.setItem("leftArrowPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 2 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftArrowPosition_", 2);
                  }
                } else if (newLeftAwningLength == 9) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 2.25;
                    sessionStorage.setItem("leftArrowPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 2.25 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftArrowPosition_", 2.25);
                  }
                } else if (newLeftAwningLength == 10) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 2.5;
                    sessionStorage.setItem("leftArrowPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 2, 5 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftArrowPosition_", 2.5);
                  }
                } else if (newLeftAwningLength == 11) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 2.75;
                    sessionStorage.setItem("leftArrowPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 2.75 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftArrowPosition_", 2.75);
                  }
                } else if (newLeftAwningLength == 12) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 3;
                    sessionStorage.setItem("leftArrowPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 3 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftArrowPosition_", 0.45);
                  }
                } else if (newLeftAwningLength == 13) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 3.25;
                    sessionStorage.setItem("leftArrowPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 3.25 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftArrowPosition_", 3.25);
                  }
                } else if (newLeftAwningLength == 14) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 3.5;
                    sessionStorage.setItem("leftArrowPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 3.5 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftArrowPosition_", 3.5);
                  }
                } else if (newLeftAwningLength == 15) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 4;
                    sessionStorage.setItem("leftArrowPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 4 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftArrowPosition_", 4);
                  }
                }
              }
              leftText.current.forEach((mesh) => {
                if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                  mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_")) + 4; // 4 is for default pos for text
                }
                else {
                  mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_")) + 4 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                }
                // mesh.position.x = parseFloat(sessionStorage.getItem("ArrowPosition_")) ;
                // core.getltextpos(mesh.position.x);
              })
              if (mesh.name === "leantoleftcols" || mesh.name === "leantoleftcolfront" || mesh.name === "leantoleftcolback") {
                if (newLeftAwningLength == 1) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = -2.25;
                    //mesh.poition.
                    sessionStorage.setItem("leftAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = -2.25 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftAwningWallPosition_", -2.25);
                  }
                } else if (newLeftAwningLength == 2) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = -2.00;
                    sessionStorage.setItem("leftAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = -2.00 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftAwningWallPosition_", -2.00);
                  }
                } else if (newLeftAwningLength == 3) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = -1.75;
                    sessionStorage.setItem("leftAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = -1.75 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftAwningWallPosition_", -1.75);
                  }
                } else if (newLeftAwningLength == 4) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = -1.5;
                    sessionStorage.setItem("leftAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = -1.5 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftAwningWallPosition_", -1.5);
                  }
                } else if (newLeftAwningLength == 5) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = -1.25;
                    sessionStorage.setItem("leftAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = -1.25 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftAwningWallPosition_", -1.25);
                  }
                } else if (newLeftAwningLength == 6) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = -1.0;
                    sessionStorage.setItem("leftAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = -1.0 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftAwningWallPosition_", -1.0);
                  }
                } else if (newLeftAwningLength == 7) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = -0.75;
                    sessionStorage.setItem("leftAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = -0.75 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftAwningWallPosition_", -0.75);
                  }
                } else if (newLeftAwningLength == 8) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = -0.5;
                    sessionStorage.setItem("leftAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = -0.5 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftAwningWallPosition_", -0.5);
                  }
                } else if (newLeftAwningLength == 9) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = -0.25;
                    sessionStorage.setItem("leftAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = -0.25 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftAwningWallPosition_", -0.25);
                  }
                } else if (newLeftAwningLength == 10) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 0;
                    sessionStorage.setItem("leftAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 0 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftAwningWallPosition_", 0);
                  }
                } else if (newLeftAwningLength == 11) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 0.2;
                    sessionStorage.setItem("leftAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 0.2 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftAwningWallPosition_", 0.2);
                  }
                } else if (newLeftAwningLength == 12) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 0.45;
                    sessionStorage.setItem("leftAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 0.45 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftAwningWallPosition_", 0.45);
                  }
                } else if (newLeftAwningLength == 13) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 0.7;
                    sessionStorage.setItem("leftAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 0.7 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftAwningWallPosition_", 0.7);
                  }
                } else if (newLeftAwningLength == 14) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 0.95;
                    sessionStorage.setItem("leftAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 0.95 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftAwningWallPosition_", 0.95);
                  }
                } else if (newLeftAwningLength == 15) {
                  if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 1.20;
                    sessionStorage.setItem("leftAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 1.20 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("leftAwningWallPosition_", 1.20);
                  }
                }
              } else if (mesh.name === 'abltruss' || mesh.name === 'afltruss' || mesh.name === 'altruss') {
                mesh.position.x = 5 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
              }
            });
            if (heightArrow != null) {
              heightArrow.forEach((mesh) => {
                if (mesh.name === 'textContainer' || mesh.name === 'container_arrow_left') {
                  console.log("hitting height arrow 1")
                  if (newLeftAwningLength == 1) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -2.1;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -2.1 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -2.1);
                    }
                  } else if (newLeftAwningLength == 2) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.8;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.8 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -1.8);
                    }
                  } else if (newLeftAwningLength == 3) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.6;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.6 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -1.6);
                    }
                  } else if (newLeftAwningLength == 4) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.4;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.4 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -1.4);
                    }
                  } else if (newLeftAwningLength == 5) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.2;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.2 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -1.2);
                    }
                  } else if (newLeftAwningLength == 6) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.0;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.0 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -1.0);
                    }
                  } else if (newLeftAwningLength == 7) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.8;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.8 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -0.8);
                    }
                  } else if (newLeftAwningLength == 8) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.5;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.5 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -0.5);
                    }
                  } else if (newLeftAwningLength == 9) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.3;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.3 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -0.3);
                    }
                  } else if (newLeftAwningLength == 10) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.1;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.1 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -0.1);
                    }
                  } else if (newLeftAwningLength == 11) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.2;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.2 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", 0.2);
                    }
                  } else if (newLeftAwningLength == 12) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.4;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.4 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", 0.4);
                    }
                  } else if (newLeftAwningLength == 13) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.6;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.6 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", 0.6);
                    }
                  } else if (newLeftAwningLength == 14) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.9;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.9 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", 0.9);
                    }
                  } else if (newLeftAwningLength == 15) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.2;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.2 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", 1.2);
                    }
                  }
                  // heightArrow = gable.updateLeftAwningHeight(loadedMeshes,sceneRef);
                  // core.recieveHeightArrowCore(heightArrow)
                }
                if (mesh.name === 'textrect') {
                  var awningHeight = core.updateAwningHeight(parseFloat(localStorage.getItem("height")), parseFloat(localStorage.getItem("leftAwningPitch")), parseFloat(localStorage.getItem("leftAwningLength")));
                  // Create and set the dynamic texture
                  var materialRect = new StandardMaterial("Material", sceneRef.current);
                  var textureRect = new DynamicTexture("new rect", { width: 512, height: 256 }, sceneRef.current, false, Texture.TRILINEAR_SAMPLINGMODE);
                  var textureContext = textureRect.getContext();
                  textureContext.clearRect(0, 0, textureRect.getSize().width, textureRect.getSize().height);
                  var font = "bold 200px monospace";
                  textureRect.drawText(awningHeight, 50, 170, font, "white", "transparent");
                  textureRect.hasAlpha = true;
                  materialRect.emissiveTexture = textureRect;
                  materialRect.diffuseColor = new Color3(1, 1, 1);
                  materialRect.opacityTexture = textureRect;
                  materialRect.backFaceCulling = false;
                  mesh.material = materialRect;
                }
              })
            }
            if (heightArrow1 != null) {
              heightArrow1 = core.sendHeightArrow()
              heightArrow1.forEach((mesh) => {
                console.log("hitting height arrow 2")
                if (mesh.name === 'textContainer' || mesh.name === 'container_arrow_left') {
                  if (newLeftAwningLength == 1) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -2.1;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -2.1 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -2.1);
                    }
                  } else if (newLeftAwningLength == 2) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.8;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.8 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -1.8);
                    }
                  } else if (newLeftAwningLength == 3) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.6;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.6 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -1.6);
                    }
                  } else if (newLeftAwningLength == 4) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.4;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.4 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -1.4);
                    }
                  } else if (newLeftAwningLength == 5) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.2;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.2 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -1.2);
                    }
                  } else if (newLeftAwningLength == 6) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.0;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.0 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -1.0);
                    }
                  } else if (newLeftAwningLength == 7) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.8;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.8 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -0.8);
                    }
                  } else if (newLeftAwningLength == 8) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.5;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.5 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -0.5);
                    }
                  } else if (newLeftAwningLength == 9) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.3;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.3 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -0.3);
                    }
                  } else if (newLeftAwningLength == 10) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.1;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.1 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -0.1);
                    }
                  } else if (newLeftAwningLength == 11) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.2;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.2 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", 0.2);
                    }
                  } else if (newLeftAwningLength == 12) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.4;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.4 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", 0.4);
                    }
                  } else if (newLeftAwningLength == 13) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.6;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.6 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", 0.6);
                    }
                  } else if (newLeftAwningLength == 14) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.9;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.9 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", 0.9);
                    }
                  } else if (newLeftAwningLength == 15) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.2;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.2 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", 1.2);
                    }
                  }
                  // heightArrow = gable.updateLeftAwningHeight(loadedMeshes,sceneRef);
                  // core.recieveHeightArrowCore(heightArrow)
                }
                if (mesh.name === 'textrect') {
                  var awningHeight = core.updateAwningHeight(parseFloat(localStorage.getItem("height")), parseFloat(localStorage.getItem("leftAwningPitch")), parseFloat(localStorage.getItem("leftAwningLength")));
                  // Create and set the dynamic texture
                  var materialRect = new StandardMaterial("Material", sceneRef.current);
                  var textureRect = new DynamicTexture("new rect", { width: 512, height: 256 }, sceneRef.current, false, Texture.TRILINEAR_SAMPLINGMODE);
                  var textureContext = textureRect.getContext();
                  textureContext.clearRect(0, 0, textureRect.getSize().width, textureRect.getSize().height);
                  var font = "bold 200px monospace";
                  textureRect.drawText(awningHeight, 50, 170, font, "white", "transparent");
                  textureRect.hasAlpha = true;
                  materialRect.emissiveTexture = textureRect;
                  materialRect.diffuseColor = new Color3(1, 1, 1);
                  materialRect.opacityTexture = textureRect;
                  materialRect.backFaceCulling = false;
                  mesh.material = materialRect;
                }
              })
            }else{
              heightArrow1 = core.sendHeightArrow()
            }
            if (heightArrow2 != null) {
              console.log("hitting height arrow 3")
              heightArrow2.forEach((mesh) => {
                if (mesh.name === 'textContainer' || mesh.name === 'container_arrow_left') {
                  if (newLeftAwningLength == 1) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -2.1;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -2.1 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -2.1);
                    }
                  } else if (newLeftAwningLength == 2) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.8;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.8 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -1.8);
                    }
                  } else if (newLeftAwningLength == 3) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.6;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.6 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -1.6);
                    }
                  } else if (newLeftAwningLength == 4) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.4;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.4 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -1.4);
                    }
                  } else if (newLeftAwningLength == 5) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.2;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.2 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -1.2);
                    }
                  } else if (newLeftAwningLength == 6) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.0;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.0 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -1.0);
                    }
                  } else if (newLeftAwningLength == 7) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.8;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.8 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -0.8);
                    }
                  } else if (newLeftAwningLength == 8) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.5;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.5 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -0.5);
                    }
                  } else if (newLeftAwningLength == 9) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.3;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.3 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -0.3);
                    }
                  } else if (newLeftAwningLength == 10) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.1;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.1 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", -0.1);
                    }
                  } else if (newLeftAwningLength == 11) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.2;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.2 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", 0.2);
                    }
                  } else if (newLeftAwningLength == 12) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.4;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.4 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", 0.4);
                    }
                  } else if (newLeftAwningLength == 13) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.6;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.6 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", 0.6);
                    }
                  } else if (newLeftAwningLength == 14) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.9;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.9 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", 0.9);
                    }
                  } else if (newLeftAwningLength == 15) {
                    if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.2;
                      sessionStorage.setItem("leftHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.2 + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("leftHeightArrowPosition_", 1.2);
                    }
                  }
                  // heightArrow = gable.updateLeftAwningHeight(loadedMeshes,sceneRef);
                  // core.recieveHeightArrowCore(heightArrow)
                }
                if (mesh.name === 'textrect') {
                  var awningHeight = core.updateAwningHeight(parseFloat(localStorage.getItem("height")), parseFloat(localStorage.getItem("leftAwningPitch")), parseFloat(localStorage.getItem("leftAwningLength")));
                  // Create and set the dynamic texture
                  var materialRect = new StandardMaterial("Material", sceneRef.current);
                  var textureRect = new DynamicTexture("new rect", { width: 512, height: 256 }, sceneRef.current, false, Texture.TRILINEAR_SAMPLINGMODE);
                  var textureContext = textureRect.getContext();
                  textureContext.clearRect(0, 0, textureRect.getSize().width, textureRect.getSize().height);
                  var font = "bold 200px monospace";
                  textureRect.drawText(awningHeight, 50, 170, font, "white", "transparent");
                  textureRect.hasAlpha = true;
                  materialRect.emissiveTexture = textureRect;
                  materialRect.diffuseColor = new Color3(1, 1, 1);
                  materialRect.opacityTexture = textureRect;
                  materialRect.backFaceCulling = false;
                  mesh.material = materialRect;
                }
              })
            }
          });

        }

        if (newRightAwningLength !== rightAwningLengthRef.current) {
          prevRightAwningLength = rightAwningLengthRef.current;
          rightAwningLengthRef.current = newRightAwningLength;


          const scalingFactor = (newRightAwningLength - prevRightAwningLength) * 0.06;
          const roundedScalingFactor = Math.round(scalingFactor * 100) / 100;

          loadedMeshes.current.forEach((meshes) => {
            meshes.forEach((mesh) => {
              if (mesh.name === 'container_right' || mesh.name === 'cantileverRight' || mesh.name === 'rightAwningGroundTile') {
                if(mesh.name === 'rightAwningGroundTile'){
                  mesh.setPivotPoint(new Vector3(1.25, 0, 0));
                  mesh.scaling.x = newRightAwningLength / 10;
                }else{
                  mesh.setPivotPoint(new Vector3(-2.5, 0, 0));
                  mesh.scaling.x = newRightAwningLength / 10;
                  core.rightawninglengthgetter(mesh.scaling.x);
                }
                if (mesh.name === 'cantileverRight') {
                  mesh.position.y = 0;
                }
              }
              if (mesh.name === "leantorightcols" || mesh.name === "leantorightcolfront" || mesh.name === "leantorightcolback") {
                if (newRightAwningLength == 1) {
                  if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 2.25;
                    //mesh.poition.
                    sessionStorage.setItem("rightAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 2.25 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("rightAwningWallPosition_", 2.25);
                  }
                } else if (newRightAwningLength == 2) {
                  if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 2.00;
                    sessionStorage.setItem("rightAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 2.00 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("rightAwningWallPosition_", 2.00);
                  }
                } else if (newRightAwningLength == 3) {
                  if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 1.75;
                    sessionStorage.setItem("rightAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 1.75 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("rightAwningWallPosition_", 1.75);
                  }
                } else if (newRightAwningLength == 4) {
                  if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 1.5;
                    sessionStorage.setItem("rightAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 1.5 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("rightAwningWallPosition_", 1.5);
                  }
                } else if (newRightAwningLength == 5) {
                  if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 1.25;
                    sessionStorage.setItem("rightAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 1.25 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("rightAwningWallPosition_", 1.25);
                  }
                } else if (newRightAwningLength == 6) {
                  if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 1.0;
                    sessionStorage.setItem("rightAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 1.0 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("rightAwningWallPosition_", 1.0);
                  }
                } else if (newRightAwningLength == 7) {
                  if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 0.75;
                    sessionStorage.setItem("rightAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 0.75 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("rightAwningWallPosition_", 0.75);
                  }
                } else if (newRightAwningLength == 8) {
                  if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 0.5;
                    sessionStorage.setItem("rightAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 0.5 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("rightAwningWallPosition_", 0.5);
                  }
                } else if (newRightAwningLength == 9) {
                  if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 0.25;
                    sessionStorage.setItem("rightAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 0.25 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("rightAwningWallPosition_", 0.25);
                  }
                } else if (newRightAwningLength == 10) {
                  if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = 0;
                    sessionStorage.setItem("rightAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = 0 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("rightAwningWallPosition_", 0);
                  }
                } else if (newRightAwningLength == 11) {
                  if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = -0.2;
                    sessionStorage.setItem("rightAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = - 0.2 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("rightAwningWallPosition_", -0.2);
                  }
                } else if (newRightAwningLength == 12) {
                  if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = -0.45;
                    sessionStorage.setItem("rightAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = -0.45 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("rightAwningWallPosition_", -0.45);
                  }
                } else if (newRightAwningLength == 13) {
                  if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = -0.7;
                    sessionStorage.setItem("rightAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = -0.7 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("rightAwningWallPosition_", -0.7);
                  }
                } else if (newRightAwningLength == 14) {
                  if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = -0.95;
                    sessionStorage.setItem("rightAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = -0.95 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("rightAwningWallPosition_", -0.95);
                  }
                } else if (newRightAwningLength == 15) {
                  if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                    mesh.position.x = -1.20;
                    sessionStorage.setItem("rightAwningWallPosition_", mesh.position.x);
                  }
                  else {
                    mesh.position.x = -1.20 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                    sessionStorage.setItem("rightAwningWallPosition_", -1.20);
                  }
                }
              } else if (mesh.name === 'abrtruss' || mesh.name === 'afrtruss' || mesh.name === 'ratruss') {
                mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) - 5
              }
            });
            if (rightHeightArrow != null) {
              rightHeightArrow.forEach((mesh) => {
                if (mesh.name === 'textContainer' || mesh.name === 'container_arrow_right') {
                  if (newRightAwningLength == 1) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 2.1;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 2.1 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 2.1);
                    }
                  } else if (newRightAwningLength == 2) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.8;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.8 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 1.8);
                    }
                  } else if (newRightAwningLength == 3) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.6;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.6 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 1.6);
                    }
                  } else if (newRightAwningLength == 4) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.4;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.4 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 1.4);
                    }
                  } else if (newRightAwningLength == 5) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.2;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.2 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 1.2);
                    }
                  } else if (newRightAwningLength == 6) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.0;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.0 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 1.0);
                    }
                  } else if (newRightAwningLength == 7) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.8;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.8 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 0.8);
                    }
                  } else if (newRightAwningLength == 8) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.5;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.5 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 0.5);
                    }
                  } else if (newRightAwningLength == 9) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.3;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.3 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 0.3);
                    }
                  } else if (newRightAwningLength == 10) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.1;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.1 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 0.1);
                    }
                  } else if (newRightAwningLength == 11) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.2;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.2 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", -0.2);
                    }
                  } else if (newRightAwningLength == 12) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.4;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.4 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", -0.4);
                    }
                  } else if (newRightAwningLength == 13) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.6;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.6 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", -0.6);
                    }
                  } else if (newRightAwningLength == 14) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.9;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.9 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", -0.9);
                    }
                  } else if (newRightAwningLength == 15) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.2;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.2 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", -1.2);
                    }
                  }
                  // heightArrow = gable.updaterightAwningHeight(loadedMeshes,sceneRef);
                  // core.recieveHeightArrowCore(heightArrow)
                }
                if (mesh.name === 'textrect') {
                  var awningHeight = core.updateAwningHeight(parseFloat(localStorage.getItem("height")), parseFloat(localStorage.getItem("rightAwningPitch")), parseFloat(localStorage.getItem("rightAwningLength")));
                  // Create and set the dynamic texture
                  var materialRect = new StandardMaterial("Material", sceneRef.current);
                  var textureRect = new DynamicTexture("new rect", { width: 512, height: 256 }, sceneRef.current, false, Texture.TRILINEAR_SAMPLINGMODE);
                  var textureContext = textureRect.getContext();
                  textureContext.clearRect(0, 0, textureRect.getSize().width, textureRect.getSize().height);
                  var font = "bold 200px monospace";
                  textureRect.drawText(awningHeight, 50, 170, font, "white", "transparent");
                  textureRect.hasAlpha = true;
                  materialRect.emissiveTexture = textureRect;
                  materialRect.diffuseColor = new Color3(1, 1, 1);
                  materialRect.opacityTexture = textureRect;
                  materialRect.backFaceCulling = false;
                  mesh.material = materialRect;
                }
              })
            }
            if (rightHeightArrow1 != null) {
              rightHeightArrow1 = core.sendRightHeightArrow();
              rightHeightArrow1.forEach((mesh) => {
                if (mesh.name === 'textContainer' || mesh.name === 'container_arrow_right') {
                  if (newRightAwningLength == 1) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 2.1;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 2.1 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 2.1);
                    }
                  } else if (newRightAwningLength == 2) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.8;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.8 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 1.8);
                    }
                  } else if (newRightAwningLength == 3) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.6;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.6 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 1.6);
                    }
                  } else if (newRightAwningLength == 4) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.4;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.4 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 1.4);
                    }
                  } else if (newRightAwningLength == 5) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.2;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.2 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 1.2);
                    }
                  } else if (newRightAwningLength == 6) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.0;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.0 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 1.0);
                    }
                  } else if (newRightAwningLength == 7) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.8;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.8 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 0.8);
                    }
                  } else if (newRightAwningLength == 8) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.5;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.5 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 0.5);
                    }
                  } else if (newRightAwningLength == 9) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.3;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.3 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 0.3);
                    }
                  } else if (newRightAwningLength == 10) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.1;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.1 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 0.1);
                    }
                  } else if (newRightAwningLength == 11) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.2;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.2 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", -0.2);
                    }
                  } else if (newRightAwningLength == 12) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.4;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.4 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", -0.4);
                    }
                  } else if (newRightAwningLength == 13) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.6;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.6 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", -0.6);
                    }
                  } else if (newRightAwningLength == 14) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.9;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.9 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", -0.9);
                    }
                  } else if (newRightAwningLength == 15) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.2;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.2 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", -1.2);
                    }
                  }
                  // heightArrow = gable.updaterightAwningHeight(loadedMeshes,sceneRef);
                  // core.recieveHeightArrowCore(heightArrow)
                }
                if (mesh.name === 'textrect') {
                  var awningHeight = core.updateAwningHeight(parseFloat(localStorage.getItem("height")), parseFloat(localStorage.getItem("rightAwningPitch")), parseFloat(localStorage.getItem("rightAwningLength")));
                  // Create and set the dynamic texture
                  var materialRect = new StandardMaterial("Material", sceneRef.current);
                  var textureRect = new DynamicTexture("new rect", { width: 512, height: 256 }, sceneRef.current, false, Texture.TRILINEAR_SAMPLINGMODE);
                  var textureContext = textureRect.getContext();
                  textureContext.clearRect(0, 0, textureRect.getSize().width, textureRect.getSize().height);
                  var font = "bold 200px monospace";
                  textureRect.drawText(awningHeight, 50, 170, font, "white", "transparent");
                  textureRect.hasAlpha = true;
                  materialRect.emissiveTexture = textureRect;
                  materialRect.diffuseColor = new Color3(1, 1, 1);
                  materialRect.opacityTexture = textureRect;
                  materialRect.backFaceCulling = false;
                  mesh.material = materialRect;
                }
              })
            }else{
              rightHeightArrow1 = core.sendRightHeightArrow();
            }
            if (rightHeightArrow2 != null) {
              rightHeightArrow2.forEach((mesh) => {
                if (mesh.name === 'textContainer' || mesh.name === 'container_arrow_right') {
                  if (newRightAwningLength == 1) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 2.1;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 2.1 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 2.1);
                    }
                  } else if (newRightAwningLength == 2) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.8;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.8 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 1.8);
                    }
                  } else if (newRightAwningLength == 3) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.6;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.6 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 1.6);
                    }
                  } else if (newRightAwningLength == 4) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.4;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.4 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 1.4);
                    }
                  } else if (newRightAwningLength == 5) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.2;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.2 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 1.2);
                    }
                  } else if (newRightAwningLength == 6) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 1.0;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 1.0 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 1.0);
                    }
                  } else if (newRightAwningLength == 7) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.8;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.8 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 0.8);
                    }
                  } else if (newRightAwningLength == 8) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.5;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.5 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 0.5);
                    }
                  } else if (newRightAwningLength == 9) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.3;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.3 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 0.3);
                    }
                  } else if (newRightAwningLength == 10) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = 0.1;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = 0.1 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", 0.1);
                    }
                  } else if (newRightAwningLength == 11) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.2;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.2 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", -0.2);
                    }
                  } else if (newRightAwningLength == 12) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.4;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.4 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", -0.4);
                    }
                  } else if (newRightAwningLength == 13) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.6;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.6 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", -0.6);
                    }
                  } else if (newRightAwningLength == 14) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -0.9;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -0.9 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", -0.9);
                    }
                  } else if (newRightAwningLength == 15) {
                    if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                      mesh.position.x = -1.2;
                      sessionStorage.setItem("rightHeightArrowPosition_", mesh.position.x);
                    }
                    else {
                      mesh.position.x = -1.2 - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
                      sessionStorage.setItem("rightHeightArrowPosition_", -1.2);
                    }
                  }
                  // heightArrow = gable.updaterightAwningHeight(loadedMeshes,sceneRef);
                  // core.recieveHeightArrowCore(heightArrow)
                }
                if (mesh.name === 'textrect') {
                  var awningHeight = core.updateAwningHeight(parseFloat(localStorage.getItem("height")), parseFloat(localStorage.getItem("rightAwningPitch")), parseFloat(localStorage.getItem("rightAwningLength")));
                  // Create and set the dynamic texture
                  var materialRect = new StandardMaterial("Material", sceneRef.current);
                  var textureRect = new DynamicTexture("new rect", { width: 512, height: 256 }, sceneRef.current, false, Texture.TRILINEAR_SAMPLINGMODE);
                  var textureContext = textureRect.getContext();
                  textureContext.clearRect(0, 0, textureRect.getSize().width, textureRect.getSize().height);
                  var font = "bold 200px monospace";
                  textureRect.drawText(awningHeight, 50, 170, font, "white", "transparent");
                  textureRect.hasAlpha = true;
                  materialRect.emissiveTexture = textureRect;
                  materialRect.diffuseColor = new Color3(1, 1, 1);
                  materialRect.opacityTexture = textureRect;
                  materialRect.backFaceCulling = false;
                  mesh.material = materialRect;
                }
              })
            }
          });
        }

        if (newFrontAwningLength !== frontAwningLengthRef.current) {
          const prevFrontAwningLength = frontAwningLengthRef.current;
          frontAwningLengthRef.current = newFrontAwningLength;

          //factor for scaling meshes
          const scalingFactor = (newFrontAwningLength - prevFrontAwningLength) * 0.09;
          core.frontawninglengthgetter(scalingFactor);
          var frontBayOffset = gable.recieveFrontBayOffset();
          // console.log("offset: ",frontBayOffset)

          loadedMeshes.current.forEach((meshes) => {
            meshes.forEach((mesh) => {

              if (mesh.name === 'cantileverFront' || mesh.name === 'container_front') {
                mesh.setPivotPoint(new Vector3(0, 0, -1.2));
                mesh.scaling.z = newFrontAwningLength / 7;
                core.frontawninglengthgetter(mesh.scaling.z);
              }

              if (mesh.name === 'arrow') {
                if (newFrontAwningLength == 1) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 3 + frontBayOffset;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  } else {
                    mesh.position.z = 3;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  }
                } else if (newFrontAwningLength == 2) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 3.5 + frontBayOffset;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  } else {
                    mesh.position.z = 3.5;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  }
                } else if (newFrontAwningLength == 3) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 4 + frontBayOffset;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  } else {
                    mesh.position.z = 4;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  }
                } else if (newFrontAwningLength == 4) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 4.5 + frontBayOffset;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  } else {
                    mesh.position.z = 4.5;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  }
                } else if (newFrontAwningLength == 5) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 5 + frontBayOffset;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  } else {
                    mesh.position.z = 5;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  }
                } else if (newFrontAwningLength == 6) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 5.8 + frontBayOffset;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  } else {
                    mesh.position.z = 5.8;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  }
                } else if (newFrontAwningLength == 7) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 6.3 + frontBayOffset;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  } else {
                    mesh.position.z = 6.3;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  }
                } else if (newFrontAwningLength == 8) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 6.8 + frontBayOffset;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  } else {
                    mesh.position.z = 6.8;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  }
                } else if (newFrontAwningLength == 9) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 7.3 + frontBayOffset;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  } else {
                    mesh.position.z = 7.3;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  }
                } else if (newFrontAwningLength == 10) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 7.8 + frontBayOffset;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  } else {
                    mesh.position.z = 7.8;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  }
                } else if (newFrontAwningLength == 11) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 8.3 + frontBayOffset;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  } else {
                    mesh.position.z = 8.3;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  }
                } else if (newFrontAwningLength == 12) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 8.8 + frontBayOffset;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  } else {
                    mesh.position.z = 8.8;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  }
                } else if (newFrontAwningLength == 13) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 9.3 + frontBayOffset;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  } else {
                    mesh.position.z = 9.3;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  }
                } else if (newFrontAwningLength == 14) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 9.8 + frontBayOffset;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  } else {
                    mesh.position.z = 9.8;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  }
                } else if (newFrontAwningLength == 15) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 10.3 + frontBayOffset;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  } else {
                    mesh.position.z = 10.3;
                    sessionStorage.setItem("frontArrowPosition_", mesh.position.z);
                    gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                  }
                }
              }
              if (mesh.name === 'fGround') {
                if (newFrontAwningLength == 1) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 6 + frontBayOffset;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 6;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 2) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 6.5 + frontBayOffset;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 6.5;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 3) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 7 + frontBayOffset;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 7;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 4) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 7.5 + frontBayOffset;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 7.5;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 5) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 8 + frontBayOffset;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 8;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 6) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 8.8 + frontBayOffset;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 8.8;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 7) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 9.3 + frontBayOffset;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 9.3;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 8) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 9.8;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 9.8;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 9) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 10.3 + frontBayOffset;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 10.3;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 10) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 10.8 + frontBayOffset;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 10.8;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 11) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 11.3 + frontBayOffset;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 11.3;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 12) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 11.8 + frontBayOffset;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 11.8;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 13) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 12.3 + frontBayOffset;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 12.3;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 14) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 12.8 + frontBayOffset;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 12.8;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 15) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 13.3 + frontBayOffset;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 13.3;
                    sessionStorage.setItem("frontGroundPosition_", mesh.position.z);
                  }
                }
              }
              if (mesh.name === 'fLogo') {
                if (newFrontAwningLength == 1) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 9 + frontBayOffset;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 9;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 2) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 9.5 + frontBayOffset;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 9.5;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 3) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 10 + frontBayOffset;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 10;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 4) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 10.5 + frontBayOffset;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 10.5;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 5) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 11 + frontBayOffset;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 11;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 6) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 11.8 + frontBayOffset;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 11.8;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 7) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 12.3 + frontBayOffset;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 12.3;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 8) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 12.8 + frontBayOffset;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 12.8;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 9) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 13.3 + frontBayOffset;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 13.3;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 10) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 13.8 + frontBayOffset;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 13.8;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 11) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 14.3 + frontBayOffset;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 14.3;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 12) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 14.8 + frontBayOffset;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 14.8;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 13) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 15.3 + frontBayOffset;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 15.3;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 14) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 15.8 + frontBayOffset;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 15.8;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  }
                } else if (newFrontAwningLength == 15) {
                  if (frontBayOffset > 0) {
                    mesh.position.z = 16.3 + frontBayOffset;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  } else {
                    mesh.position.z = 16.3;
                    sessionStorage.setItem("frontLogoPosition_", mesh.position.z);
                  }
                }
              }
            });
          });

        }

        if (newBackAwningLength !== backAwningLengthRef.current) {
          const prevBackAwningLength = backAwningLengthRef.current;
          backAwningLengthRef.current = newBackAwningLength;

          //factor for scaling meshes
          const scalingFactor = (newBackAwningLength - prevBackAwningLength) * 0.08;
          core.backawninglengthgetter(scalingFactor);
          loadedMeshes.current.forEach((meshes) => {
            meshes.forEach((mesh) => {
              if (mesh.name === 'cantileverBack' || mesh.name === 'container_back') {
                mesh.setPivotPoint(new Vector3(0, 0, 1.2));
                mesh.scaling.z += scalingFactor;
                console.log("scaled: ", mesh.name)
                core.backawninglengthgetter(mesh.scaling.z);
              }
              if (newBackAwningLength < prevBackAwningLength) {
                if (mesh.name === 'Barrow' || mesh.name === 'bGround' || mesh.name === 'bLogo') {
                  // mesh.position.z -= scalingFactor;   
                  mesh.position.z -= (scalingFactor * 2.5) - 0.3;
                  // Save the new position to localStorage
                  sessionStorage.setItem(`${mesh.name}_position_z`, mesh.position.z);
                  gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                }

              } else {
                if (mesh.name === 'Barrow' || mesh.name === 'bGround' || mesh.name === 'bLogo') {
                  mesh.position.z -= (scalingFactor * 2.5) + 0.2;
                  sessionStorage.setItem(`${mesh.name}_position_z`, mesh.position.z);
                  gable.checkDepthChange(localStorage.getItem("width"), loadedMeshes.current, sceneRef.current);
                }

              }

            });
          });
        }
      }
    }, 1000); // Adjust the interval as needed (in milliseconds)

    return () => clearInterval(intervalId);
  }, []);

  return [leftAwningLengthRef.current, rightAwningLengthRef.current];
};


//<============================================ custom Hook for managing awning options ======================================>//
const useLocalStoragePollingCantilever = (loadedMeshes, text,leftText) => {
  const leftCantileverRef = useRef(null);
  const prevLeftCantileverRef = useRef(false); // To track the previous value
  const rightCantileverRef = useRef(null);
  const prevRighttCantileverRef = useRef(false); // To track the previous value
  const isLeftAwning = useRef(null);
  const isRightAwning = useRef(null);
  const frontCantileverRef = useRef(null);
  const prevFrontCantileverRef = useRef(false); // To track the previous value
  const backCantileverRef = useRef(null);
  const prevBackCantileverRef = useRef(false); // To track the previous value
  const isFrontAwning = useRef(null);
  const isBackAwning = useRef(null);
  // const isRightAwning = useRef(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      leftCantileverRef.current = localStorage.getItem('leftCantilever');
      rightCantileverRef.current = localStorage.getItem('rightCantilever');
      frontCantileverRef.current = localStorage.getItem('frontCantilever');
      backCantileverRef.current = localStorage.getItem('backCantilever');
      isLeftAwning.current = localStorage.getItem('leftAwning');
      isRightAwning.current = localStorage.getItem('rightAwning');
      isFrontAwning.current = localStorage.getItem('frontAwning');
      isBackAwning.current = localStorage.getItem('backAwning');

      //<=============== for left cantilever ===============>
      if (leftCantileverRef.current !== prevLeftCantileverRef.current) {
        if (leftCantileverRef.current === 'true') {
          loadedMeshes.current.forEach((meshes) => {
            meshes.forEach((mesh) => {
              if (mesh && mesh.name === "leanToLeftRoofs") {
                mesh.isVisible = true;
              }
              if (mesh && mesh.name === "leanToLeft") {
                mesh.isVisible = false;
              }
              if (mesh.name === 'Larrow') {
                console.log("indeddddd")
                if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0 && sessionStorage.getItem("leftArrowPosition_") > 0) {
                  // console.log("should be here")
                  mesh.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + parseFloat(sessionStorage.getItem("leftArrowPosition_"))
                } else {
                  if (sessionStorage.getItem("leftArrowPosition_") > 0) {
                    mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_"))
                    // console.log("or here")
                  } else {
                    mesh.position.x += 2.5;
                    sessionStorage.setItem("leftArrowPositionAfterEnabling_", 2.5)
                    // console.log("worst case")
                  }
                }
              }

              text.current.forEach((mesh) => {
                if (mesh.name === 'Left') {
                  if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0) {
                    mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 10;
                  } else {
                    mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 10;
                  }
                } else if (mesh.name === 'leftplane') {
                  if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0) {
                    mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 13;
                  } else {
                    mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 13;
                  }
                }
              })

            });
          });
          console.log("executing indef")
          leftText.current.forEach((mesh) => {
            if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0) {
              if (sessionStorage.getItem("leftArrowPosition_") > 0) {

                mesh.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + parseFloat(sessionStorage.getItem("leftArrowPosition_")) + parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 4;
                // console.log("all caser: ", mesh.position.x)
              } else {
                // console.log("execing ")
                mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 4;
              }
            } else {
              if (sessionStorage.getItem("leftArrowPosition_") > 0) {
                mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPosition_")) + parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 4;
              } else {
                mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 4
              }
            }
            });
        } else {
            console.log("in false executing ")
            loadedMeshes.current.forEach((meshes) => {
              meshes.forEach((mesh) => {
                if (mesh && mesh.name === "leanToLeftRoofs" && leftCantileverRef.current === 'false') {
                  mesh.isVisible = false;
                } if (mesh.name === 'leanToLeftRoofs' && leftCantileverRef.current === 'false' && isLeftAwning.current === 'true') {
                  mesh.isVisible = true;
                }
                if (mesh.name === 'Larrow') {
                  if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0) {
                    mesh.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
                  } else {
                    if (sessionStorage.getItem("leftArrowPosition_") > 0) {
                      // console.log("only this")
                      mesh.position.x = 0
                      sessionStorage.setItem("leftArrowPositionAfterEnabling_", 0)
                    } else {
                      if (mesh.position.x - 2.5 <= 0 || mesh.position.x - 3 <= 0) {
                        console.log("thisssss")
                        mesh.position.x = 0
                        sessionStorage.setItem("leftArrowPositionAfterEnabling_", 0)
                      } else {
                        console.log("not this: ", mesh.position.x)
                        mesh.position.x -= 2.5
                        sessionStorage.setItem("leftArrowPositionAfterEnabling_", 0)
                      }
                    }
                  }
                  // sessionStorage.setItem("LarrowPrevPosition", mesh.position.x );
                  //   // mesh.position.x -= 2.5;
                  //   var width = parseFloat(localStorage.getItem("width"));
                  //   mesh.position.x = 0.4 + width/20;
                  //   if(parseFloat(sessionStorage.getItem("ArrowPosition_")) !== 0){
  
                  //     sessionStorage.setItem("ArrowPosition_",mesh.position.x + 4);
                  //   }
                };
              });
            });
            text.current.forEach((mesh) => {
              if (mesh.name === 'Left') {
                if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0) {
                  mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 10;
                } else {
                  mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 10;
                }
              }
              if (mesh.name === 'leftplane') {
                if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0) {
                  mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 13;
                } else {
                  mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 13;
                }
  
              }
            })
            leftText.current.forEach((mesh) => {
              // if(mesh.position.x >= 6.5)
              if (sessionStorage.getItem("leftHeightArrowPositionAfterWidth_") > 0) {
                mesh.position.x = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 4;
              } else {
                if (sessionStorage.getItem("leftArrowPosition_") > 0) {
                  // console.log("this")
                  mesh.position.x = 4;
                } else {
                  // console.log("or this")
                  mesh.position.x = parseFloat(sessionStorage.getItem("leftArrowPositionAfterEnabling_")) + 4
                }
              }
            })
            sessionStorage.setItem("leftArrowPosition_",0)
            sessionStorage.setItem("leftArrowPositionAfterEnabling_", 0)
        }
        prevLeftCantileverRef.current = leftCantileverRef.current;
      }
      if (localStorage.getItem('leftCantilever') == 'true') {
        console.log("in true executing ")
        loadedMeshes.current.forEach((meshes) => {
          meshes.forEach((mesh) => {
            if (mesh && mesh.name === "leanToLeftRoofs") {
              mesh.isVisible = true;
            }
            if (mesh && mesh.name === "leanToLeft") {
              mesh.isVisible = false;
            }
          })
        });
      }
      //<=============== for right cantilever ===============>
      if (rightCantileverRef.current === 'true') {
        loadedMeshes.current.forEach((meshes) => {
          meshes.forEach((mesh) => {
            if (mesh && mesh.name === "leanToRightRoofs") {
              mesh.isVisible = true;
            }
          });
        });
      } else {
        loadedMeshes.current.forEach((meshes) => {
          meshes.forEach((mesh) => {

            if (mesh && mesh.name === "leanToRightRoofs" && rightCantileverRef.current === 'false') {
              mesh.isVisible = false;
            } if (mesh.name === "leanToRightRoofs" && rightCantileverRef.current === 'false' && isRightAwning.current === 'true') {
              mesh.isVisible = true;
            }
          });
        });
      }

      //<=============== for front cantilever ===============>
      if (frontCantileverRef.current === 'true') {
        loadedMeshes.current.forEach((meshes) => {
          meshes.forEach((mesh) => {
            if (mesh && mesh.name === "leanToFrontRoof") {
              mesh.isVisible = true;
            }
          });
        });
      } else {
        loadedMeshes.current.forEach((meshes) => {
          meshes.forEach((mesh) => {
            if (mesh && mesh.name === "leanToFrontRoof" && frontCantileverRef.current === 'false') {
              mesh.isVisible = false;
            } if (mesh.name === "leanToFrontRoof" && frontCantileverRef.current === 'false' && isFrontAwning.current === 'true') {
              mesh.isVisible = true;
            }
          });
        });
      }

      //<=============== for back cantilever ===============>
      if (backCantileverRef.current === 'true') {
        loadedMeshes.current.forEach((meshes) => {
          meshes.forEach((mesh) => {
            if (mesh && mesh.name === "leanToBackRoof") {
              mesh.isVisible = true;
            }
          });
        });
      } else {
        loadedMeshes.current.forEach((meshes) => {
          meshes.forEach((mesh) => {
            if (mesh && mesh.name === "leanToBackRoof") {
              mesh.isVisible = false;
            }
            if (mesh && mesh.name === "leanToBackRoof" && backCantileverRef.current === 'false' && isBackAwning.current === 'true') {
              mesh.isVisible = true;
            }
          });
        });
      }
    }, 1000); // Adjust the interval as needed (in milliseconds)

    return () => clearInterval(intervalId);
  }, []);

  return [leftCantileverRef.current, rightCantileverRef.current];
};


const SceneRenderComponent = () => {
  const camera = useRef(null);
  const camera1 = useRef(null);
  const frontBayDimensions = useRef(null);
  const frontBayPosition = useRef(null);
  const centerBayDimensions = useRef(null);
  const centerBayPosition = useRef(null);
  const loadedMeshes = useRef(null);
  const sceneRef = useRef(null);
  const textRef = useRef(null);
  const frontBackTextRef = useRef(null);
  const leftArrowTextRef = useRef(null);
  var prevLeftAwningLength = 5;
  var prevRightAwningLength = 5;
  const [leftAwning, rightAwning, frontAwning, backAwning] = useLocalStoragePolling(loadedMeshes, textRef, frontBackTextRef, leftArrowTextRef, sceneRef);
  const [leftAwningLength, rightAwningLength] = useLocalStoragePollingOptions(loadedMeshes, textRef, prevLeftAwningLength, prevRightAwningLength, leftArrowTextRef, sceneRef);
  const [leftAwningCanti, rightAwningCanti] = useLocalStoragePollingCantilever(loadedMeshes,textRef,leftArrowTextRef);
  const slabEnabler = useLocalStoragePollingSlabSettings(loadedMeshes)
  const slabHeightEnabler = useLocalStoragePollingSlabHeight();
  const raftertype = useLocalStorageRafterType();
  var cameraAngleRef = localStorage.getItem('Angle');
    //<============================================ local storage global default states ======================================>//\
    var newWidth = localStorage.setItem('width', '5.0')
    var newHeight = localStorage.setItem('height', '5.0')
    var newLength = localStorage.setItem('length', '30')
    var newPitch = localStorage.setItem('pitch', '5')
    var newBayNumber = localStorage.setItem('bay_no', '3');
    var newBaySize = localStorage.setItem('bay_size', '10.0');
    localStorage.setItem('leftAwning', 'false');
    localStorage.setItem('rightAwning', 'false');
    localStorage.setItem('frontAwning', 'false');
    localStorage.setItem('backAwning', 'false');
    localStorage.setItem('leftAwningLength', 10);
    localStorage.setItem('rightAwningLength', 10);
    localStorage.setItem('frontAwningLength', 5);
    localStorage.setItem('backAwningLength', 5);
    localStorage.setItem('leftAwningPitch', 2.5);
    localStorage.setItem('rightAwningPitch', 2.5);
    localStorage.setItem("leftCantilever", "false");
    localStorage.setItem("rightCantilever", "false");
    localStorage.setItem("frontCantilever", "false");
    localStorage.setItem("backCantilever", "false");
    localStorage.setItem('Angle', 'Rotate');
    localStorage.setItem("mezzanine_height",'null');
    localStorage.setItem("rafter", "rafter");
  
    sessionStorage.setItem("ArrowPosition_", 0);
    sessionStorage.setItem("LarrowPrevPosition", 0);
    sessionStorage.setItem("leftHeightArrowPosition_", 0);
    sessionStorage.setItem("leftHeightArrowPositionAfterWidth_", 0);
    sessionStorage.setItem("rightHeightArrowPosition_", 0);
    sessionStorage.setItem("rightHeightArrowPositionAfterWidth_", 0);
    sessionStorage.setItem("leftDepthArrowAfterWidth_", 0);
    sessionStorage.setItem("rightDepthArrowAfterWidth_", 0);
    sessionStorage.setItem("depthRightArrowPos_", 0);
    sessionStorage.setItem("depthLeftArrowPos_", 0);
    sessionStorage.setItem("frontAwning_scalingFactor", 0);
    sessionStorage.setItem("leftAwningWallPosition_", 0);
    sessionStorage.setItem("rightAwningWallPosition_", 0);
    sessionStorage.setItem("leftArrowPositionAfterWidth_", 0)
    sessionStorage.setItem("leftArrowPosition_", 0)
    sessionStorage.setItem("leftArrowPositionAfterEnabling_", 0)
    sessionStorage.setItem("frontArrowPosition_", 0);
    sessionStorage.setItem("frontGroundPosition_", 0);
    sessionStorage.setItem("frontLogoPosition_", 0);
    localStorage.setItem("RightWallsVisible", "true");
    localStorage.setItem("LeftWallsVisible", "true");
    localStorage.setItem("RightAwningWallsVisible", "true");
    localStorage.setItem("LeftAwningWallsVisible", "true");
    sessionStorage.setItem('bayStates', JSON.stringify({}));
    sessionStorage.setItem('RightColCenter', JSON.stringify({}));
    sessionStorage.setItem('leftColCenter', JSON.stringify({}));
    sessionStorage.setItem('col1', true);
    sessionStorage.setItem('col2', true);

  // camera1.current = useLocalStoragePollingCameraAngle(camera1, sceneRef);
  useEffect(() => {
    meshLoader(loadedMeshes.current);
    apimeshloader(loadedMeshes.current);
    get_loaded_meshes(loadedMeshes.current)
    loaded_meshes_for_mezzanine(loadedMeshes.current)
    meshLoader(loadedMeshes.current);
    meshLoaderColor(loadedMeshes.current);
    meshLoaderSize(loadedMeshes.current);
    skymeshLoaderopening(loadedMeshes.current);
    // sceneLoaderColor(sceneRef.current);
    loaded_meshes_for_awnings(loadedMeshes.current);
    get_height_update_details(5, loadedMeshes.current, sceneRef.current);
    get_height_update_details_right(loadedMeshes.current, sceneRef.current);


    //meshLoaderFrontAwning(loadedMeshes.current);
  }, [loadedMeshes.current]);

  const onSceneReady = (scene) => {

    sessionStorage.removeItem('colCenter1AwningEnabledStates');
    sessionStorage.removeItem('colCenter2AwningEnabledStates');
    sessionStorage.removeItem('colCenter1EnabledStates');
    sessionStorage.removeItem('colCenter2EnabledStates');
    //basic babylon logic on boot
    var minBeta = 0.1;
    var maxBeta = Math.PI / 2 - 0.05;
    // Create an ArcRotateCamera with the minimum alpha and beta angles
    camera.current = new ArcRotateCamera("camera", 1.2, 1.2, 20, new Vector3(0, 1, 1), scene);
    camera1.current = new FreeCamera("freeCamera", new Vector3(1.2, 5, 20), scene);
    camera1.current.setTarget(new Vector3(0, 1, 1));
    // This targets the camera to scene origin
    camera.current.lowerRadiusLimit = 10;
    camera.current.upperRadiusLimit = 500;
    camera.current.lowerBetaLimit = minBeta;
    camera.current.upperBetaLimit = maxBeta;
    const canvas = scene.getEngine().getRenderingCanvas();

    // Attach camera controls
    camera.current.attachControl(canvas, true);
    camera1.current.attachControl(canvas, true);
    // camera.current.active = false;
    camerapolling();

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    var light2 = new HemisphericLight("light2", new Vector3(0, 1, 2), scene);
    var light3 = new HemisphericLight("light2", new Vector3(0, 1, -5), scene);
    var light4 = new HemisphericLight("light2", new Vector3(0, -1, 0), scene);
    light4.intensity = 0.3;
    light3.intensity = 0.3;
    light2.intensity = 0.3;
    light.intensity = 0.4;
    core.setupGround(scene);
    core.setupSkybox(scene);

    // Create Front Bay
    var frontBayMeshes = gable.createFrontBay(1, 0, scene, 5, 10);

    // Calculate FrontBay Dimensions and Position
    var frontBayDimensionsAndPosition = core.calculateBoundingBoxDimensionsAndPosition(
      frontBayMeshes
    );
    frontBayDimensions.current = frontBayDimensionsAndPosition.dimensions;
    frontBayPosition.current = frontBayDimensionsAndPosition.position;

    // Create CenterBay
    var centerBayMeshes = gable.createCenterBay(
      frontBayDimensions.current,
      frontBayPosition.current,
      0.976,
      scene,
      5,
      10
    );

    // Calculate CenterBay Dimensions and Position
    var centerBayDimensionsAndPosition = core.calculateBoundingBoxDimensionsAndPosition(
      centerBayMeshes
    );
    centerBayDimensions.current = centerBayDimensionsAndPosition.dimensions;
    centerBayPosition.current = centerBayDimensionsAndPosition.position;

    // Create BackBay
    var backBayMeshes = gable.createBackBay(
      centerBayDimensions.current,
      centerBayPosition.current,
      2,
      scene,
      5,
      10
    );

    loadedMeshes.current = [backBayMeshes, frontBayMeshes, centerBayMeshes];
    meshLoader(loadedMeshes.current);
    apimeshloader(loadedMeshes.current);
    // meshLoadersky(loadedMeshes.current);
    get_height_update_details(5, loadedMeshes.current, sceneRef.current);
    get_height_update_details_right(loadedMeshes.current, sceneRef.current);
    // meshLoaderColor(loadedMeshes.current);
    loaded_meshes_for_awnings(loadedMeshes.current);
    meshLoaderFrontAwning(loadedMeshes.current);
    meshLoaderPADoor(loadedMeshes.current);
    meshLoaderopening(loadedMeshes.current);
    skymeshLoaderopening(loadedMeshes.current);
    sceneRef.current = scene;
    sceneLoaderColor(sceneRef.current);
    sceneLoaderSize(sceneRef.current);
    textRef.current = core.writings(frontBayDimensionsAndPosition, sceneRef.current,)
    //for first boot
    // textRef.current.forEach((mesh) => {
    //   if (mesh.name === 'Right') {
    //     mesh.position.x = -5;
    //   }else if (mesh.name === 'rightplane'){
    //     mesh.position.x = -10
    //   }
    // });
    frontBackTextRef.current = gable.checkDepthChange(5, loadedMeshes.current, sceneRef.current);
    leftArrowTextRef.current = gable.checkBaySize(10, loadedMeshes.current, sceneRef.current);

    //   function convertToBabylonMesh(mesh) {
    //     // Check if mesh is defined and not null
    //     if (!mesh) {
    //         // console.error("Invalid mesh:", mesh);
    //         return null;
    //     }

    //     // Create a new Babylon.js mesh
    //     var babylonMesh = new BABYLON.Mesh(mesh.name, scene);

    //     // Copy relevant properties from the picked mesh to the Babylon.js mesh
    //     babylonMesh.position.copyFrom(mesh.position);
    //     babylonMesh.rotation.copyFrom(mesh.rotation);
    //     babylonMesh.scaling.copyFrom(mesh.scaling);
    //     babylonMesh.isVisible = mesh.isVisible;
    //     babylonMesh.setEnabled(mesh.isEnabled);

    //     // Copy material if exists
    //     if (mesh.material) {
    //         babylonMesh.material = mesh.material;
    //     }

    //     // Copy other relevant properties as needed

    //     return babylonMesh;
    // }




  };
  useEffect(() => {
    core.setup_requirements(frontBayDimensions, centerBayDimensions, frontBayPosition, centerBayPosition, sceneRef, loadedMeshes, leftArrowTextRef, baySize)
    gable.checkDepthChange(5, loadedMeshes.current, sceneRef.current)
    // var height_text = gable.checkHeightChange(5,loadedMeshes.current,sceneRef.current);
  }, [frontBayDimensions, centerBayDimensions, frontBayPosition, centerBayPosition, sceneRef, loadedMeshes])
  //<=================================================apex Handler===================================================>//

  var newPitch;
  var newWidth;
  var newHeight;
  var prevApex = 5.04;
  const apexHandler = () => {
    var newApex = core.updateApex(newPitch, newWidth, newHeight);
    if (newApex === prevApex) {
      //do nothing
    }
    else {
      localStorage.setItem('apex', newApex);
    }
    prevApex = newApex;
  };

  useEffect(() => {
    // Polling every second to detect changes within the same tab
    const intervalId = setInterval(apexHandler, 50);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  //<=============================================== camera polling ========================================>//

  const camerapolling = () => {
    const intervalId = setInterval(() => {
      const newCameraAngle = localStorage.getItem('Angle');
      if (newCameraAngle !== cameraAngleRef) {
        // camera.current.alpha = parseFloat(newCameraAngle;
        cameraAngleRef = newCameraAngle;
        if (cameraAngleRef === 'Rotate') {
          sceneRef.current.activeCamera = camera.current
        } else if (cameraAngleRef === 'Pan') {
          sceneRef.current.activeCamera = camera1.current
        }
      }
    }, 1000); // Adjust the interval as needed (in milliseconds)
    return () => clearInterval(intervalId);
  }


  //<=============================================== pitch handler ========================================>//


  var prevPitch = 5;
  const pitchHandler = () => {
    newPitch = localStorage.getItem('pitch');
    if (newPitch === prevPitch) {
      //do nothing
    }
    else {
      var totalLength = loadedMeshes.current.length;
      //array disposal before sending ref to core
      //   loadedMeshes.current.forEach((meshes) => {
      //     if (meshes) {
      //       meshes.forEach((mesh) => {
      //         if (mesh) {
      //           mesh.dispose();
      //         }
      //       });
      //     }
      //  });
      //   loadedMeshes.current =  [[], [], []];
      //recieving modified array from core and pointing ref to modified array
      loadedMeshes.current = core.handlePitch(loadedMeshes.current,
        newPitch,
        centerBayDimensions.current,
        centerBayPosition.current,
        frontBayDimensions.current,
        frontBayPosition.current,
        sceneRef.current, totalLength);
    }

    //update pitch checker to prevent unwanted repetition
    prevPitch = newPitch;
  };

  useEffect(() => {
    // Polling every second to detect changes within the same tab
    const intervalId = setInterval(pitchHandler, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  //<============================================ Width Handler ========================================>//
  var prevWidth = 5.0;
  var widthProcessing
  const widthHandler = () => {
    newWidth = parseFloat(localStorage.getItem('width'));
    if (newWidth === prevWidth) {
      //do nothing
    }
    else {
      //calling function from core to handle width
      if (!isNaN(newWidth))
        core.updateMeshesScaling(newWidth, 'x', loadedMeshes.current, sceneRef.current, textRef.current, leftArrowTextRef.current);
      frontBackTextRef.current = gable.checkDepthChange(newWidth, loadedMeshes.current, sceneRef.current);
    }
    prevWidth = newWidth
  };

  useEffect(() => {
    // Polling every second to detect changes within the same tab
    const intervalId = setInterval(widthHandler, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  //<========================================= Height Handler ========================================>//

  var prevHeight = 5;
  const heightHandler = () => {
    newHeight = localStorage.getItem('height');
    if (newHeight === prevHeight) {
      //do nothing
    }
    else {
      if (!isNaN(newHeight))
        core.updateMeshesHeightScaling(newHeight, 'y', loadedMeshes.current);
    }
    prevHeight = newHeight
  };

  useEffect(() => {
    // Polling every second to detect changes within the same tab
    const intervalId = setInterval(heightHandler, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  //<================================= screenshot handler ========================>//
  const captureScreen = () => {
    return new Promise((resolve, reject) => {
      const engine = sceneRef.current.getEngine();

      // Register a callback for the next frame render
      engine.onEndFrameObservable.addOnce(() => {
        const canvas = engine.getRenderingCanvas();
        // Check if the canvas is ready
        if (canvas) {
          const dataURL = canvas.toDataURL("image/jpeg");
          resolve(dataURL);
        } else {
          reject(new Error("Canvas not found."));
        }
      });
    });
  };
  const waitForElement = (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(interval);
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          clearInterval(interval);
          reject(new Error("Element did not render in time"));
        }
      }, 100);
    });
  };
  const capture_view_type = async (element) => {
    try {
      const boundingBox = element.getBoundingClientRect(); // Get the element's dimensions
      await waitForElement('.type__container');
      const screenshot = await toJpeg(element, {
        quality: 1,
        useWebKitFallback: true,
        backgroundColor: '#ffffff', // Set the background color to white
        width: boundingBox.width, // Use the element's width
        height: boundingBox.height, // Use the element's height
        style: {
          transform: 'scale(1)', // Ensure no scaling
          transformOrigin: 'top left', // Set the origin
        },
      });
      return screenshot;
    } catch (error) {
      console.error("Error capturing view type with html-to-image:", error);
      throw error;
    }
  };

  const generatePDF = async (imageData, plan_view, floor_view) => {
    const pdf = new jsPDF('landscape');
    var pageWidth = pdf.internal.pageSize.getWidth();
    var pageHeight = pdf.internal.pageSize.getHeight();
    var qrtext = window.location.href;
    // ---------------------------------------- Page # 01 ----------------------------------- //
    pdf.addImage(logo, 'PNG', 5, 5, 20, 20);
    pdf.setFontSize(25); pdf.setFont('bold');
    pdf.text('3D View', 30, 20); pdf.setFontSize(14)
    pdf.text('Visit Our Site: ', 5, 32);
    pdf.setFontSize(14); pdf.setFont('normal'); pdf.setTextColor('blue');
    pdf.text('https://www.aqsteelbuilt.com/', 35, 32);
    const qrpic = await QRCode.toDataURL(qrtext);
    const img = new Image();
    img.src = qrpic;
    pdf.addImage(img, 'PNG', pageWidth - 120, 3, 30, 30);
    pdf.setTextColor('blue'); pdf.setFontSize(12);
    pdf.text('+44 1296 925854', pageWidth - 92, 11)
    pdf.text('2F, No. 5255, Songjiang District, Shanghai, China.', pageWidth - 92, 18)
    pdf.text('https://www.aqsteelbuilt.com', pageWidth - 92, 26)
    var margin = 2;
    // var textWidth = pdf.getStringUnitWidth("AQ Steel Sheds") * 20 / pdf.internal.scaleFactor;
    // var x = (pdf.internal.pageSize.getWidth() - textWidth) / 2;
    // pdf.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin, 'S');
    pdf.rect(4, 35, pageWidth - 8, pageHeight - 58);
    // Add the image below the title with some space
    pdf.addImage(imageData, "JPEG", 5, 37, pageWidth - 10, pageHeight - 60);
    // ---------------------------------------- Page # 01 ----------------------------------- //
    // ---------------------------------------- Page # 02 ----------------------------------- //
    pdf.addPage(); pdf.setFont('normal');
    pdf.addImage(logo, 'PNG', 5, 5, 20, 20);
    pdf.setFontSize(25); pdf.setFont('bold');
    pdf.text('Floor View', 30, 20); pdf.setFontSize(14)
    pdf.text('Visit Our Site: ', 5, 32);
    pdf.setFontSize(14); pdf.setFont('normal'); pdf.setTextColor('blue');
    pdf.text('https://www.aqsteelbuilt.com/', 35, 32);
    pdf.addImage(img, 'PNG', pageWidth - 120, 2, 30, 30);
    pdf.setTextColor('blue'); pdf.setFontSize(12);
    pdf.text('+44 1296 925854', pageWidth - 92, 10)
    pdf.text('2F, No. 5255, Songjiang District, Shanghai, China.', pageWidth - 92, 17)
    pdf.text('https://www.aqsteelbuilt.com', pageWidth - 92, 25)
    pdf.rect(4, 35, pageWidth - 8, pageHeight - 58);
    pdf.addImage(floor_view, "png", -10, 37, pageWidth - 10, pageHeight - 60);
    // ---------------------------------------- Page # 03 ----------------------------------- //
    pdf.addPage(); pdf.setFont('normal');
    pdf.addImage(logo, 'PNG', 5, 5, 20, 20);
    pdf.setFontSize(25); pdf.setFont('bold');
    pdf.text('Plan View', 30, 20); pdf.setFontSize(14)
    pdf.text('Visit Our Site: ', 5, 32);
    pdf.setFontSize(14); pdf.setFont('normal'); pdf.setTextColor('blue');
    pdf.text('https://www.aqsteelbuilt.com/', 35, 32);
    pdf.addImage(img, 'PNG', pageWidth - 120, 2, 30, 30);
    pdf.setTextColor('blue'); pdf.setFontSize(12);
    pdf.text('+44 1296 925854', pageWidth - 92, 10)
    pdf.text('2F, No. 5255, Songjiang District, Shanghai, China.', pageWidth - 92, 17)
    pdf.text('https://www.aqsteelbuilt.com', pageWidth - 92, 25)
    pdf.rect(4, 35, pageWidth - 8, pageHeight - 58);
    const xOffset = (pageWidth - (pageWidth - 10)) / 2;
    const yOffset = (pageHeight - (pageHeight - 60)) / 2;
    pdf.addImage(plan_view, "png", -10 , 37, pageWidth - 10, pageHeight - 60);
    pdf.save("Captured_Shed.pdf");
  };

  const generateImage = (imageData) => {
    // Create a link element and trigger a download
    const link = document.createElement('a');
    link.download = 'scene_capture.jpg'; // File name
    link.href = imageData;
    link.click();
  };

  window.printScene = async () => {
    try {
      const imageData = await captureScreen();
      const container = document.getElementsByClassName('type__container')[0];
      container.style.display = 'flex';
      container.setAttribute('type', 'Plan');
      const plan_view = await capture_view_type(container);
      container.style.display = 'none';
      container.style.display = 'flex';
      container.setAttribute('type', 'Floor');
      const floor_view = await capture_view_type(container);
      generatePDF(imageData, floor_view, plan_view);
      container.style.display = 'none';
    } catch (error) {
      console.error("Error capturing the screen:", error);
    }
  };
  
  window.export_image = async () => {
    try {
      const imageData = await captureScreen();
      generateImage(imageData);
    } catch (error) {
      console.error("Error capturing the screen:", error);
    }
  };


    //<===================================================== Length Handler =============================================>//
    var prevLength = 30.0;
    var newLength;
    var baySize = 10.0;
    const  lengthHandler = () => {
      newLength = parseFloat(localStorage.getItem('length'));
      if (newLength === prevLength) {
        meshLoader(loadedMeshes.current);
        apimeshloader(loadedMeshes.current);
        meshLoaderColor(loadedMeshes.current);
        meshLoaderSize(loadedMeshes.current);
        // meshLoadersky(loadedMeshes.current);
        get_loaded_meshes(loadedMeshes.current);
        loaded_meshes_for_mezzanine(loadedMeshes.current);
        get_height_update_details(5, loadedMeshes.current, sceneRef.current)
        get_height_update_details_right(loadedMeshes.current, sceneRef.current);
        loaded_meshes_for_awnings(loadedMeshes.current, sceneRef.current)
        meshLoaderFrontAwning(loadedMeshes.current);
        meshLoaderPADoor(loadedMeshes.current);
        meshLoaderopening(loadedMeshes.current);
        skymeshLoaderopening(loadedMeshes.current);
        // do nothing
      } else if (newLength > prevLength) {
        for (let i = prevLength; i < newLength; i += baySize) {
          var localPosition = loadedMeshes.current[1][0].position.z;
          if(loadedMeshes.current.length != bayNumberDefault){
            loadedMeshes.current = core.appendToFront(loadedMeshes.current, centerBayDimensions.current, centerBayPosition.current, sceneRef.current, leftArrowTextRef.current);
          }
          textRef.current.forEach((mesh) => {
              var totalbays = localStorage.getItem("bay_no");
              // (loadedMeshes.length - 2)/2
              if(totalbays <=5){
                mesh.position.z = (totalbays/2) - 2 ;
              }
              else if(totalbays <= 10){
                mesh.position.z = (totalbays/2) * 2 ;
              }
              else if(totalbays <= 20){
                mesh.position.z = (totalbays/2) * 3 ;
              }
              else{
                mesh.position.z = (totalbays/2) * 4 ;
              }
              
          })
          
          gable.checkDepthChange(prevWidth, loadedMeshes.current, sceneRef.current);
          camera.current.setTarget(new Vector3(0,0,localPosition));
        }
        meshLoader(loadedMeshes.current);
        apimeshloader(loadedMeshes.current);
        meshLoaderColor(loadedMeshes.current);
        // meshLoadersky(loadedMeshes.current);
        meshLoaderSize(loadedMeshes.current);
        get_loaded_meshes(loadedMeshes.current);
        loaded_meshes_for_mezzanine(loadedMeshes.current);
        loaded_meshes_for_awnings(loadedMeshes.current, sceneRef.current)
        get_height_update_details(5, loadedMeshes.current, sceneRef.current)
        get_height_update_details_right(loadedMeshes.current, sceneRef.current);
        core.setup_requirements(frontBayDimensions,centerBayDimensions,frontBayPosition,centerBayPosition,sceneRef,loadedMeshes,leftArrowTextRef, baySize)
        meshLoaderFrontAwning(loadedMeshes.current);
        meshLoaderPADoor(loadedMeshes.current);
        meshLoaderopening(loadedMeshes.current);
        skymeshLoaderopening(loadedMeshes.current);
      } else if (newLength < prevLength) {
        for (let i = newLength; i < prevLength; i += baySize) {
          if(loadedMeshes.current.length != bayNumberDefault){
            loadedMeshes.current = core.deleteFromFront(loadedMeshes.current, sceneRef.current);
          }
          textRef.current.forEach((mesh) => {
            var totalbays = localStorage.getItem("bay_no");
            // (loadedMeshes.length - 2)/2
            if(totalbays == 3){
              mesh.position.z = (totalbays/2) - 7   ;
            }
            else if(totalbays <=5){
              mesh.position.z = (totalbays/2) - 3 ;
            }
            else if(totalbays <= 10){
              mesh.position.z = (totalbays/2) * 1.8 ;
            }
            else if(totalbays <= 20){
              mesh.position.z = (totalbays/2) * 3 ;
            }
            else{
              mesh.position.z = (totalbays/2) * 4 ;
            }
            
        })
          var localPosition = loadedMeshes.current[1][0].position.z;
          gable.checkDepthChange(prevWidth, loadedMeshes.current, sceneRef.current);
          camera.current.setTarget(new Vector3(0,0,localPosition));
        }
        gable.checkBaySize(baySize,loadedMeshes.current,sceneRef.current);
        meshLoader(loadedMeshes.current)
        apimeshloader(loadedMeshes.current);
        // meshLoadersky(loadedMeshes.current);
        meshLoaderColor(loadedMeshes.current);
        meshLoaderSize(loadedMeshes.current);
        get_loaded_meshes(loadedMeshes.current);
        loaded_meshes_for_mezzanine(loadedMeshes.current);
        get_height_update_details(5, loadedMeshes.current, sceneRef.current)
        get_height_update_details_right(loadedMeshes.current, sceneRef.current);
        loaded_meshes_for_awnings(loadedMeshes.current, sceneRef.current)
        get_height_update_details(5, loadedMeshes.current, sceneRef.current)
        core.setup_requirements(frontBayDimensions,centerBayDimensions,frontBayPosition,centerBayPosition,sceneRef,loadedMeshes, leftArrowTextRef,baySize)
        meshLoaderFrontAwning(loadedMeshes.current);
        meshLoaderPADoor(loadedMeshes.current);
        meshLoaderopening(loadedMeshes.current);
        skymeshLoaderopening(loadedMeshes.current);
      }
      prevLength = newLength;
    };
    
  
    useEffect(() => {
      // Polling every second to detect changes within the same tab
      const intervalId = setInterval(lengthHandler, 40);
  
      return () => {
        clearInterval(intervalId);
      };
    }, []);



  //<=========================================== Number of Bays Handler ===================================>//

  var bayNumberDefault = 3;
  var prevBayNumber = 3;
  var maxLength;
  const bayNumberHandler = () => {
    maxLength = 30 * baySize;
    newBayNumber = parseInt(localStorage.getItem('bay_no'));
    bayNumberDefault = newBayNumber;
    if (newBayNumber === prevBayNumber) {
      // do nothing
    } else if (bayNumberDefault > prevBayNumber) {
      for (let i = prevBayNumber; i < bayNumberDefault; i++) {
        if (newLength < maxLength) {
          newLength = (baySize * newBayNumber).toFixed(1);
        } else {
          break;
        }
      }
      localStorage.setItem("length", newLength);
      lengthHandler();
    } else if (bayNumberDefault < prevBayNumber) {
      for (let i = bayNumberDefault; i < prevBayNumber; i++) {
        if (newLength > (baySize * 3).toFixed(1)) {
          newLength = (baySize * newBayNumber).toFixed(1);
        } else {
          break;
        }

      }
      // var local_length = newLength.toFixed(1)
      localStorage.setItem("length", newLength);
      lengthHandler();
    }
    prevBayNumber = newBayNumber;
  };

  useEffect(() => {
    // Polling every second to detect changes within the same tab
    const intervalId = setInterval(bayNumberHandler, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  //<=========================================== Bay Size Handler ===================================>//

  var prevBaySize = 10.0;
  const baySizeHandler = () => {
    newBaySize = parseFloat(localStorage.getItem('bay_size'));
    if (newBaySize == prevBaySize) {
      //do nothing
    }
    else {
      baySize = newBaySize;
      prevLength = (baySize * prevBayNumber).toFixed(1);
      newLength = (baySize * prevBayNumber).toFixed(1);
      localStorage.setItem('length', prevLength);
      leftArrowTextRef.current = gable.checkBaySize(newBaySize, loadedMeshes.current, sceneRef.current);
      core.setup_requirements(frontBayDimensions, centerBayDimensions, frontBayPosition, centerBayPosition, sceneRef, loadedMeshes, leftArrowTextRef, baySize)
      //core.handleBaySize(loadedMeshes.current, sceneRef.current, centerBayDimensions.current, centerBayPosition.current, frontBayDimensions.current, frontBayPosition.current);
    }
    prevBaySize = newBaySize;
  };

  useEffect(() => {
    // Polling every second to detect changes within the same tab
    const intervalId = setInterval(baySizeHandler, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);




  return (
    <div>
      {/* <button onClick={printScene}>Print Scene</button> */}
      <SceneComponent antialias onSceneReady={onSceneReady} id="my-canvas" camera={camera} />
    </div>
  );
};

export default SceneRenderComponent;
