import { Vector3, MeshBuilder, StandardMaterial, Texture, CubeTexture, Color3, AbstractMesh, DynamicTexture, Scene } from "@babylonjs/core";
import logo from '/assets/images/logo.png'
import * as gable from "../Structure/gable";
import { getLeftAwningArrow, getRightAwningArrow } from "../Components/AwningsMenu";
import { AwningRoofUtility, RoofPitchUtility } from "./RoofPitchUtility";
import { mezzanineHeightFixer } from "./mezzanineHeightFixer";
import { enableTrussesForDeletingAwningBays, enableTrussesForDeletingBays, enableTrussesForNewAwningBays, enableTrussesForNewBays, getAllChecksForEnablingAwningTrusses, getAllChecksForEnablingAwningTrussesDeletion, getAllChecksForEnablingBayTrussesDeletion, getAllChecksForEnablingShedTrusses } from "./addRemoveUtils";



// <======================================= Colours Handlers =================================================>//
var roofcolorObject = "";
export const RoofColorHandler = (color) => {
  roofcolorObject = color;
  return roofcolorObject;
}

var wallcolorObject = "";
export const WallColorHandler = (color) => {
  wallcolorObject = color;
  return wallcolorObject;
}

export const ColorMesh = (mesh) => {
  if (roofcolorObject && (mesh.name === 'fRoof'||mesh.name === 'lRoof' || mesh.name === 'rRoof' || mesh.name === 'leanToFront' || mesh.name === 'BTop' || mesh.name === 'FTop' 
    || mesh.name === 'leanToBack' || mesh.name === 'leanToLeftRoofs' || mesh.name === 'leanToRightRoofs' || mesh.name === "cantileverLeft" || mesh.name === "cantileverRight" 
    || mesh.name === "cantileverBack" || mesh.name === "cantileverFront" || mesh.name === "leanToFrontRoof" || mesh.name === "leanToBackRoof")) {
      console.log("colorMesh called for: ", mesh.name)
    mesh.material = roofcolorObject;
  }
  if (wallcolorObject && (mesh.name === 'Rwall' || mesh.name === 'Lwall' || mesh.name === 'BWall' || mesh.name === 'FWall' || mesh.name === "leanToLeftWalls" || mesh.name === "leanToRightWalls"
    || mesh.name === 'leanToLeftPartWall' || mesh.name === 'leanToRightPartWall' || mesh.name === 'leanToLeftPartWallBack' || mesh.name === 'leanToRightPartWallBack'
    || mesh.name === 'leanToLeftTriangle' || mesh.name === 'leanToRightTriangle' || mesh.name === 'leanToRightTriangleBack'
    || mesh.name === 'leanToLeftTriangleBack'
  )) {
    mesh.material = wallcolorObject;
  }

}
//<========================================= BoundingBox calucator ===========================================>//
export function calculateBoundingBoxDimensionsAndPosition(meshes) {
  // Check if meshes is an array
  if (Array.isArray(meshes)) {
    // Initialize min and max coordinates
    var minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, minZ = Number.MAX_VALUE;
    var maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE, maxZ = Number.MIN_VALUE;

    // Iterate over each mesh and update min/max coordinates
    meshes.forEach(function (mesh) {
      var boundingBox = mesh.getBoundingInfo().boundingBox;
      var boundingBoxMin = boundingBox.minimumWorld;
      var boundingBoxMax = boundingBox.maximumWorld;

      minX = Math.min(minX, boundingBoxMin.x);
      minY = Math.min(minY, boundingBoxMin.y);
      minZ = Math.min(minZ, boundingBoxMin.z);

      maxX = Math.max(maxX, boundingBoxMax.x);
      maxY = Math.max(maxY, boundingBoxMax.y);
      maxZ = Math.max(maxZ, boundingBoxMax.z);
    });

    // Calculate dimensions and position for an array of meshes
    var dimensions = new Vector3(maxX - minX, maxY - minY, maxZ - minZ);
    var position = new Vector3((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);

    return { dimensions: dimensions, position: position };
  } else if (meshes instanceof AbstractMesh) {
    // Handle the case when meshes are a single merged mesh
    var boundingBox = meshes.getBoundingInfo().boundingBox;
    var boundingBoxMin = boundingBox.minimumWorld;
    var boundingBoxMax = boundingBox.maximumWorld;

    // Calculate dimensions and position for the merged mesh
    var dimensions = new Vector3(boundingBoxMax.x - boundingBoxMin.x, boundingBoxMax.y - boundingBoxMin.y, boundingBoxMax.z - boundingBoxMin.z);
    var position = new Vector3((boundingBoxMin.x + boundingBoxMax.x) / 2, (boundingBoxMin.y + boundingBoxMax.y) / 2, (boundingBoxMin.z + boundingBoxMax.z) / 2);

    return { dimensions: dimensions, position: position };
  } else {
    // Handle other cases or throw an error
    throw new Error("Invalid input. Expected an array of meshes or a single mesh.");
  }
}

//<========================================= Ground Texture loader with a promis ===========================================>//

async function loadTextureAsync(texturePath, scene) {
  try {
    const texture = new Texture(texturePath, scene);
    await texture.readyPromise;
    return texture;
  } catch (error) {
    console.error("Error loading texture:", error);
    throw error; // Rethrow the error to be caught in the calling function
  }
}

//<========================================= Async ground loader ===========================================>//

export async function setupGround(scene) {
  try {
    const groundTexture = await loadTextureAsync("/textures/ground/ground.jpg", scene);
    groundTexture.uScale = 110;
    groundTexture.vScale = 110;

    const groundMat = new StandardMaterial("groundMaterial", scene);
    groundMat.diffuseTexture = groundTexture;

    const ground = MeshBuilder.CreateGround("ground", { width: 1000, height: 1000, subdivisions: 1000 }, scene);
    ground.material = groundMat;
  } catch (error) {
    console.error("Error loading ground texture:", error);
  }
}

//<========================================= Async Cube Texture loader with a promise ===========================================>//

async function loadCubeTextureAsync(folderPath, scene) {
  try {
    const texture = CubeTexture.CreateFromImages(
      [`${folderPath}/nx.jpg`, `${folderPath}/ny.jpg`, `${folderPath}/nz.jpg`, `${folderPath}/px.jpg`, `${folderPath}/py.jpg`, `${folderPath}/pz.jpg`],
      scene
    );
    await texture.readyPromise;
    return texture;
  } catch (error) {
    console.error("Error loading cube texture:", error);
    throw error; // Rethrow the error to be caught in the calling function
  }
}

//<========================================= Skybox creator ===========================================>//

export async function setupSkybox(scene) {
  try {
    const skyboxTexture = await loadCubeTextureAsync("/textures/skybox/", scene);

    const skyboxMat = new StandardMaterial("skyBox", scene);
    skyboxMat.backFaceCulling = false;
    skyboxMat.reflectionTexture = skyboxTexture;
    skyboxMat.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMat.diffuseColor = new Color3(0, 0, 0);
    skyboxMat.specularColor = new Color3(0, 0, 0);

    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    skybox.material = skyboxMat;
  } catch (error) {
    console.error("Error setting up skybox:", error);
  }
}
//<========================================= Side writings ====================================================>//
export function writings(frontBayDimensionsAndPosition, scene) {

  //<======== for left ========>//
  var textRect = MeshBuilder.CreateGround("rect", { width: 2, height: 1.2 }, scene);
  textRect.position.x = 7;
  textRect.position.y = 0.05;
  textRect.position.z = -5;
  textRect.rotation = new Vector3(0, -1.5708, 0)

  // Create a material with the background texture
  var materialRect = new StandardMaterial("Material", scene);
  var backgroundTexture = new Texture("/textures/ground/ground.jpg", scene);
  materialRect.diffuseTexture = backgroundTexture;

  // Create a dynamic texture for drawing text
  var textureRect = new DynamicTexture("new rect", { width: 512, height: 256 }, scene);
  var textureContext = textureRect.getContext();
  var font = "bold 150px monospace";
  textureRect.drawText("Left", 50, 170, font, "white");

  // Assign the dynamic texture as an emissive texture to blend with the background
  materialRect.emissiveTexture = textureRect;
  materialRect.useEmissiveAsIllumination = true;

  textRect.material = materialRect;
  textRect.name = 'Left';

  //<============================for drawing logos====================================>
  // Create a plane mesh
  const leftLogo = MeshBuilder.CreatePlane('leftplane', { size: 2 }, scene);

  // Create a material
  const materiallogo = new StandardMaterial('material', scene);

  // Load logo texture
  const texture = new Texture(logo, scene);
  materiallogo.diffuseTexture = texture;

  // Apply material to the plane mesh
  leftLogo.material = materiallogo;

  // Position and scale the plane mesh
  leftLogo.rotation = new Vector3(1.5708, -1.5708, 0);
  leftLogo.position = new Vector3(12, 0.05, -5); // Adjust scale as needed
  leftLogo.scaling = new Vector3(1.5, 1.5, 1.5)
  //<======= for right =======>

  var textRect1 = MeshBuilder.CreateGround("rect", { width: 2, height: 1.2 }, scene);
  textRect1.position.x = -5;
  textRect1.position.y = 0.05;
  textRect1.position.z = -5;
  textRect1.rotation = new Vector3(0, 1.5708, 0)

  // Create a material with the background texture
  var materialRect1 = new StandardMaterial("Material", scene);
  var backgroundTexture1 = new Texture("/textures/ground/ground.jpg", scene);
  materialRect1.diffuseTexture = backgroundTexture1;

  // Create a dynamic texture for drawing text
  var textureRect1 = new DynamicTexture("new rect", { width: 512, height: 256 }, scene);
  var textureContext1 = textureRect1.getContext();
  textureRect1.drawText("Right", 50, 170, font, "white");

  // Assign the dynamic texture as an emissive texture to blend with the background
  materialRect1.emissiveTexture = textureRect1;
  materialRect1.useEmissiveAsIllumination = true;

  textRect1.material = materialRect1;
  textRect1.name = 'Right'
  //<============================for drawing logos====================================>
  // Create a plane mesh
  const rightLogo = MeshBuilder.CreatePlane('rightplane', { size: 2 }, scene);

  // Apply material to the plane mesh
  rightLogo.material = materiallogo;

  // Position and scale the plane mesh
  rightLogo.rotation = new Vector3(1.5708, 1.5708, 0);
  rightLogo.position = new Vector3(-10, 0.05, -5); // Adjust scale as needed
  rightLogo.scaling = new Vector3(1.5, 1.5, 1.5)

  return [textRect, textRect1, leftLogo, rightLogo];
}
//<========================================= Apex Height calculator ===========================================>//

export function updateApex(roofPitch, width, height) {
  const roofPitchRadians = (roofPitch * Math.PI) / 180;
  var perpendicular = (Math.tan(roofPitchRadians) * width / 2);
  var apex = perpendicular + parseFloat(height);
  var apexNumber = parseFloat(apex);
  if (!isNaN(apexNumber)) {
    apex = apexNumber.toFixed(2);
  } else {
    //do nothing
  }

  return apex;
}

//<========================================= Awning Height calculator ===========================================>//
export function updateAwningHeight(kneeHeight, awningDegree, awningLength) {
  let angleInRadians = awningDegree * (Math.PI / 180);

  var Y = Math.tan(angleInRadians) * awningLength;

  var awningHeight = kneeHeight - Y;
  return awningHeight;
}

//<================================================= roof Pitch Handler ================================================>
var degree;
export function handlePitch(loadedMeshes, newPitch, centerBayDimensions, centerBayPosition, frontBayDimensions, frontBayPosition, scene, totalLength) {
  //logic for handling pitch values
  var copy = loadedMeshes.map(meshes => {
    return meshes.map(mesh => {
      // Create a new instance with the same prototype and properties
      return Object.create(Object.getPrototypeOf(mesh), Object.getOwnPropertyDescriptors(mesh));
    });
  });

  if (newPitch == null) {
    degree = 1;
  }
  else {
    degree = newPitch;
  }
  // disposal logic
  loadedMeshes.forEach((meshes) => {
    if (meshes) {
      meshes.forEach((mesh) => {
        if (mesh) {
          mesh.dispose();
        }
      });
    }
  });
  loadedMeshes = [[], [], []];
  //creation logic
  loadedMeshes[0] = gable.createBackBay(
    centerBayDimensions,
    centerBayPosition,
    2,
    scene,
    degree,
    10
  );
  loadedMeshes[1] = gable.createFrontBay(1, 0, scene, degree, 10);
  loadedMeshes[2] = gable.createCenterBay(
    frontBayDimensions,
    frontBayPosition,
    0.976,
    scene,
    degree,
    10
  );
  loadedMeshes[2].forEach((mesh) => {
    if (mesh) {
      if (mesh.name == 'arrow' || mesh.name == 'Larrow') {
        // if(finalPosition){
        //   mesh.position.x = finalPosition;
        //   if(localStorage.getItem('leftAwning') === 'true' || localStorage.getItem('cantileverLeft') === 'true'){
        //     mesh.position.x += 2.5;
        //    }
        // }

      } else if (mesh.name === 'fRoof' || mesh.name === 'topCenter' || mesh.name === 'FTop' || mesh.name === 'BTop') {
        mesh.scaling.x += TotalWidthScaling;
        if(mesh.name === 'fRoof'){
          RoofPitchUtility(mesh)
          mesh.scaling.y += totalRoofUpscaling;
          const children = mesh.getChildMeshes(); // Gets all child meshes of the container
          children.forEach(child => {
              if (child.material) {
                  ColorMesh(child)
              }
          });
        }else{
          mesh.setPivotPoint(new Vector3(0, 2.45, 0));
          mesh.scaling.y += totalRoofUpscaling;
        }
      if(TotalHeightScaling != 0){
        //mesh.setPivotPoint(new Vector3(0, 0, 0));
        if(mesh.name === 'fRoof'){
          console.log("mesh position y = ", mesh.position.y, " totoa pos y: ", totalRoofPositioning)
          mesh.position.y += totalRoofPositioning;
          console.log("after: pos: ", mesh.position.y)
        }else{
          mesh.position.y = totalRoofPositioning;
        }
      }

    ColorMesh(mesh);
      } else if (mesh.name === 'container_left') {
        if (leanToLeftPos > 0) {
          mesh.position.x = leanToLeftPos;
        }
        if (leftscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(2.5, 0, 0));
          mesh.scaling.x = leftscalingFactor;
        }
        if (TotalHeightScaling != 0) {
          mesh.scaling.y += TotalHeightScaling;
        }
      }else if (mesh.name === 'leftAwningGroundTile'){
        if(leanToLeftPos > 0){
          console.log("pushing leantoleft pos: ", mesh.position.x, "is now +: ", leanToLeftPos)
          mesh.position.x += leanToLeftPos;
        }
        if (leftscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(-1.25, 0, 0));
          mesh.scaling.x = leftscalingFactor;
        }
      }else if (mesh.name === 'rightAwningGroundTile'){
        if(leanToRightPos < 0){
          mesh.position.x += leanToRightPos
        }
        if (rightscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(1.25, 0, 0));
          mesh.scaling.x = rightscalingFactor;
        }
      }
      else if (mesh.name === 'altruss') {
        if (TotalHeightScaling != 0) {
          mesh.position.y += totalAwningTrussHeight;
        }
        if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
        }
        else {
          mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
        }
      }
      else if (mesh.name === 'ratruss') {
        if (TotalHeightScaling != 0) {
          mesh.position.y += totalAwningTrussHeight;
        }
        if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
        }
        else {
          mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) + (-parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")))
        }
      } else if (mesh.name === 'container_right') {
        if (leanToRightPos < 0) {
          mesh.position.x = leanToRightPos;
        }
        if (rightscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(-2.5, 0, 0));
          mesh.scaling.x = rightscalingFactor;
        }
        if (TotalHeightScaling != 0) {
          mesh.scaling.y += TotalHeightScaling;
        }
        // if(mesh.name === 'cantileverRight'){
        //   mesh.position.y = 0;
        // }
      } else if (mesh.name === "leantoleftcols" || mesh.name === 'leantoleftcolfront' || mesh.name === 'leantoleftcolback') {
        if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
        }
        else {
          mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
        }
        mesh.scaling.y += TotalHeightScaling - 0.1;
        // if(parseInt(localStorage.getItem("height")) >=6){
        //   if(parseInt(localStorage.getItem('height')) == 6){
        //       mesh.scaling.y += 0.1;
        //   }else if(parseInt(localStorage.getItem('height')) == 7){
        //       mesh.scaling.y += 0.2;
        //   }else if(parseInt(localStorage.getItem('height')) == 8){
        //       mesh.scaling.y += 0.3;
        //   }else if(parseInt(localStorage.getItem('height')) == 9){
        //       mesh.scaling.y += 0.4;
        //   }else if(parseInt(localStorage.getItem('height')) == 10){
        //       mesh.scaling.y += 0.5;
        //   }
        // }
      } else if (mesh.name === "leantorightcols" || mesh.name === "leantorightcolfront" || mesh.name === "leantorightcolback") {
        if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
        }
        else {
          mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
        }
        mesh.scaling.y += TotalHeightScaling;
        // if(parseInt(localStorage.getItem("height")) >=6){
        //   if(parseInt(localStorage.getItem('height')) == 6){
        //       mesh.scaling.y += 0.1;
        //   }else if(parseInt(localStorage.getItem('height')) == 7){
        //       mesh.scaling.y += 0.2;
        //   }else if(parseInt(localStorage.getItem('height')) == 8){
        //       mesh.scaling.y += 0.3;
        //   }else if(parseInt(localStorage.getItem('height')) == 9){
        //       mesh.scaling.y += 0.4;
        //   }else if(parseInt(localStorage.getItem('height')) == 10){
        //       mesh.scaling.y += 0.5;
        //   }
        // }
      }

      else if (mesh.name !== 'LHarrow' && mesh.name !== 'RHarrow' && mesh.name !== 'leanToLeft' && mesh.name !== 'leanToRight' && mesh.name !== 'cantileverLeft' && mesh.name !== 'cantileverRight'
        && mesh.name !== 'leanToLeftWalls' && mesh.name !== 'leanToLeftRoofs' && mesh.name !== 'leantoleftcols' && mesh.name !== 'leantoleftcolfront' && mesh.name !== 'leantoleftcolback'
        && mesh.name !== 'leanToRightRoofs' && mesh.name !== 'leantorightcols' && mesh.name !== "leantorightcolfront" && mesh.name !== "leantorightcolback" && mesh.name !== 'leanToRightWalls'
        && mesh.name !== 'container_left' && mesh.name !== 'container_right' && mesh.name !== 'container_front' && mesh.name !== 'leanToLeftPartWall' && mesh.name !== 'leanToLeftTriangle'
        && mesh.name !== 'leanToRightPartWall' && mesh.name !== 'leanToRightTriangle' && mesh.name !== 'leanToFrontRoof' && mesh.name !== 'col1' && mesh.name !== 'col2' && mesh.name !== 'col3' && mesh.name !== 'col4' && mesh.name !== 'colfront1' && mesh.name !== 'colfront2'
        && mesh.name !== 'colCenter1' && mesh.name !== 'colCenter2'
      ) {
        if (mesh.name === 'ltruss' || mesh.name === 'rtruss') {
          if (TotalHeightScaling > 0) {
            console.log("hitting all meshesesdsdfsdsd: ", mesh.name)
            mesh.position.y += totalRoofPositioning;
          }
          if (mesh.name === 'ltruss') {
            if (leanToLeftPos > 0) {
              mesh.position.x += leanToLeftPos;
            }
          } else {
            if (leanToRightPos < 0) {
              mesh.position.x += leanToRightPos;
            }
          }
        }
        if (mesh.name === 'container_left_bracing' || mesh.name === 'container_right_bracing') {
          if (mesh.name === 'container_left_bracing') {
            if (leanToLeftPos > 0) {
              console.log("set left")
              mesh.position.x = leanToLeftPos;
            }
          }
          if (mesh.name === 'container_right_bracing') {
            if (leanToRightPos < 0) {
              mesh.position.x = leanToRightPos;
            }
          }
        } else if (mesh.name !== 'ltruss' && mesh.name !== 'rtruss') {
          mesh.scaling.x += TotalWidthScaling;
        }
        if (mesh.name !== 'ltruss' && mesh.name !== 'rtruss' && mesh.name !== 'groundTile' && mesh.name !== 'container_left_mezzanine' && mesh.name !== 'container_right_mezzanine') {
          mesh.scaling.y += TotalHeightScaling;
          ColorMesh(mesh);
        }
        ColorMesh(mesh);
      }
    }
    if(mesh.name === 'leanToLeft' || mesh.name === 'cantileverLeft' || mesh.name === 'leanToLeftWalls' || mesh.name === 'leanToLeftRoofs' 
      || mesh.name === 'leanToRight' || mesh.name === 'cantileverRight' || mesh.name === 'leanToRightWalls' || mesh.name === 'leanToRightRoofs' 
    ){
      ColorMesh(mesh);
    }
  });
  // Apply scaling to front mesh
  if (loadedMeshes[1]) {
    loadedMeshes[1].forEach((mesh) => {
      if (mesh) {
        if(mesh.name === 'Larrow'){

        }else if (mesh.name === 'arrow' || mesh.name === 'fGround' || mesh.name === 'fLogo') {
          var frontBayOffset = gable.recieveFrontBayOffset();
          if (mesh.name === 'arrow') {
            if (sessionStorage.getItem("frontArrowPosition_") > 0) {
              console.log("this is running")
              mesh.position.z = parseFloat(sessionStorage.getItem("frontArrowPosition_"))
              // console.log("set: ", mesh.position.z)
            } else {
              if (frontBayOffset > 0) {
                mesh.position.z = 6;
              } else {
                if(localStorage.getItem("frontAwning") === 'true'){
                  mesh.position.z = 6;
                }
              }
            }
            if(TotalWidthScaling > 0){
              mesh.scaling.x += TotalWidthScaling;
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
          ColorMesh(mesh);
        }
        else if (mesh.name == 'fGround' || mesh.name === 'fLogo') {
          //do nothing
        } else if (mesh.name === 'container_left' || mesh.name === 'cantileverLeft') {
          if (leanToLeftPos > 0) {
            mesh.position.x = leanToLeftPos;
          }
          if (leftscalingFactor != 0) {
            mesh.setPivotPoint(new Vector3(2.5, 0, 0));
            mesh.scaling.x = leftscalingFactor;
          }
          if (TotalHeightScaling != 0) {
            mesh.scaling.y += TotalHeightScaling;
          }
          if (mesh.name === 'cantileverLeft') {
            mesh.position.y = 0;
          }
        }else if (mesh.name === 'leftAwningGroundTile'){
          if(leanToLeftPos > 0){
            mesh.position.x += leanToLeftPos;
          }
          if (leftscalingFactor != 0) {
            mesh.setPivotPoint(new Vector3(-1.25, 0, 0));
            mesh.scaling.x = leftscalingFactor;
          }
        }else if (mesh.name === 'rightAwningGroundTile'){
          if(leanToRightPos < 0){
            mesh.position.x += leanToRightPos;
          }
          if (rightscalingFactor != 0) {
            mesh.setPivotPoint(new Vector3(1.25, 0, 0));
            mesh.scaling.x = rightscalingFactor;
          }
        }
        else if (mesh.name === 'afltruss') {
          if (TotalHeightScaling != 0) {
            mesh.position.y += totalAwningTrussHeight;
          }
          if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
            mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
          }
          else {
            mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
          }
        }
        else if (mesh.name === 'afrtruss') {
          if (TotalHeightScaling != 0) {
            mesh.position.y += totalAwningTrussHeight;
          }
          if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
            mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
          }
          else {
            mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) + (-parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")))
          }
        } else if (mesh.name === 'container_right' || mesh.name === 'cantileverRight') {
          if (leanToRightPos < 0) {
            mesh.position.x = leanToRightPos;
          }
          if (rightscalingFactor != 0) {
            mesh.setPivotPoint(new Vector3(-2.5, 0, 0));
            mesh.scaling.x = rightscalingFactor;
          }
          if (TotalHeightScaling != 0) {
            mesh.scaling.y += TotalHeightScaling;
          }
          if (mesh.name === 'cantileverRight') {
            mesh.position.y = 0;
          }
        }
        else if (mesh.name === 'container_front') {
          if (frontscalingFactor != 0) {
            mesh.setPivotPoint(new Vector3(-1.2, 0, 0));
            mesh.scaling.z = frontscalingFactor;
          }
        }
        else if(mesh.name === 'leanToLeft' || mesh.name === 'cantileverLeft' || mesh.name === 'leanToLeftWalls' || mesh.name === 'leanToLeftRoofs' 
          || mesh.name === 'leanToRight' || mesh.name === 'cantileverRight' || mesh.name === 'leanToRightWalls' || mesh.name === 'leanToRightRoofs' 
        ){
          ColorMesh(mesh);
        }
        else if (mesh.name === 'fRoof' || mesh.name === ' topCenter' || mesh.name === 'FTop' || mesh.name === 'BTop' || mesh.name === 'leanToFrontRoof'
          || mesh.name === 'cantileverFront') {
            mesh.scaling.x += TotalWidthScaling;
              if(mesh.name === 'fRoof'){
                RoofPitchUtility(mesh)
                mesh.scaling.y += totalRoofUpscaling;
                const children = mesh.getChildMeshes(); // Gets all child meshes of the container
                children.forEach(child => {
                    if (child.material) {
                        ColorMesh(child)
                    }
                });
              }else{
                mesh.setPivotPoint(new Vector3(0, 2.45, 0));
                mesh.scaling.y += totalRoofUpscaling;
                // if(mesh.name === 'leanToFrontRoof' ){
                //   AwningRoofUtility(mesh)
                // }
              }
            if(TotalHeightScaling != 0){
              //mesh.setPivotPoint(new Vector3(0, 0, 0));
              if(mesh.name === 'fRoof' || mesh.name === 'leanToFrontRoof') {
                console.log("mesh position y = ", mesh.position.y, " totoa pos y: ", totalRoofPositioning)
                mesh.position.y += totalRoofPositioning;
                console.log("after: pos: ", mesh.position.y)
              }else if(mesh.name === 'FTop' || mesh.name === 'BTop'){
                if(localStorage.getItem('slab') !== 'Disable'){
                  if(parseInt(localStorage.getItem('slabSize')) < 50){
                    mesh.position.y = totalRoofPositioning;
                  }else if(parseInt(localStorage.getItem('slabSize')) >= 50 && parseInt(localStorage.getItem('slabSize')) < 100){
                    mesh.position.y = totalRoofPositioning + 0.1;
                  }else if(parseInt(localStorage.getItem('slabSize')) >= 100 && parseInt(localStorage.getItem('slabSize')) < 150){
                    mesh.position.y = totalRoofPositioning + 0.2;
                  }else if(parseInt(localStorage.getItem('slabSize')) >= 150){
                    mesh.position.y = totalRoofPositioning + 0.4;
                  }
                }else{
                  mesh.position.y = totalRoofPositioning;
                }
              }else{
                mesh.position.y = totalRoofPositioning;
              }
            }

          ColorMesh(mesh);
        } else if (mesh.name === "leantoleftcols" || mesh.name === 'leantoleftcolfront' || mesh.name === 'leantoleftcolback') {
          if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
            mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
          }
          else {
            mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
          }
          mesh.scaling.y += TotalHeightScaling - 0.1;
          // if(parseInt(localStorage.getItem("height")) >=6){
          //   if(parseInt(localStorage.getItem('height')) == 6){
          //       mesh.scaling.y += 0.1;
          //   }else if(parseInt(localStorage.getItem('height')) == 7){
          //       mesh.scaling.y += 0.2;
          //   }else if(parseInt(localStorage.getItem('height')) == 8){
          //       mesh.scaling.y += 0.3;
          //   }else if(parseInt(localStorage.getItem('height')) == 9){
          //       mesh.scaling.y += 0.4;
          //   }else if(parseInt(localStorage.getItem('height')) == 10){
          //       mesh.scaling.y += 0.5;
          //   }
          // }
        } else if (mesh.name === "leantorightcols" || mesh.name === "leantorightcolfront" || mesh.name === "leantorightcolback") {
          if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
            mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
          }
          else {
            mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
          }
          mesh.scaling.y += TotalHeightScaling - 0.1;
          // if(parseInt(localStorage.getItem("height")) >=6){
          //   if(parseInt(localStorage.getItem('height')) == 6){
          //       mesh.scaling.y += 0.1;
          //   }else if(parseInt(localStorage.getItem('height')) == 7){
          //       mesh.scaling.y += 0.2;
          //   }else if(parseInt(localStorage.getItem('height')) == 8){
          //       mesh.scaling.y += 0.3;
          //   }else if(parseInt(localStorage.getItem('height')) == 9){
          //       mesh.scaling.y += 0.4;
          //   }else if(parseInt(localStorage.getItem('height')) == 10){
          //       mesh.scaling.y += 0.5;
          //   }
          // }
        } else if (mesh.name !== 'LHarrow' && mesh.name !== 'RHarrow' && mesh.name !== 'leanToLeft' && mesh.name !== 'leanToRight' && mesh.name !== 'cantileverLeft' && mesh.name !== 'cantileverRight'
          && mesh.name !== 'leanToLeftWalls' && mesh.name !== 'leanToLeftRoofs' && mesh.name !== 'leantoleftcols' && mesh.name !== 'leantoleftcolfront' && mesh.name !== 'leantoleftcolback'
          && mesh.name !== 'leanToRightRoofs' && mesh.name !== 'leantorightcols' && mesh.name !== "leantorightcolfront" && mesh.name !== "leantorightcolback" && mesh.name !== 'leanToRightWalls'
          && mesh.name !== 'container_left' && mesh.name !== 'container_right' && mesh.name !== 'container_front' && mesh.name !== 'leanToLeftPartWall' && mesh.name !== 'leanToLeftTriangle'
          && mesh.name !== 'leanToRightPartWall' && mesh.name !== 'leanToRightTriangle' && mesh.name !== 'leanToLeftRoof' && mesh.name !== 'col1' && mesh.name !== 'col2' && mesh.name !== 'col3' && mesh.name !== 'col4' && mesh.name !== 'colfront1' && mesh.name !== 'colfront2'
          && mesh.name !== 'colCenter1' && mesh.name !== 'colCenter2' && mesh.name !== 'leanToFrontRoof'
        ) {
          if (mesh.name === 'fltruss' || mesh.name === 'frtruss') {
            if (TotalHeightScaling > 0) {
              mesh.position.y += totalRoofPositioning;
            }
            if (mesh.name === 'fltruss') {
              if (leanToLeftPos > 0) {
                mesh.position.x += leanToLeftPos;
              }
            } else {
              if (leanToRightPos < 0) {
                mesh.position.x += leanToRightPos;
              }
            }
          }
          if (mesh.name === 'container_left_bracing' || mesh.name === 'container_right_bracing') {
            if (mesh.name === 'container_left_bracing') {
              if (leanToLeftPos > 0) {
                console.log("set left")
                mesh.position.x += leanToLeftPos;
              }
            }
            if (mesh.name === 'container_right_bracing') {
              if (leanToRightPos < 0) {
                console.log("set right")
                mesh.position.x += leanToRightPos;
              }
            }
          } else if (mesh.name !== 'frtruss' && mesh.name !== 'fltruss') {
            mesh.scaling.x += TotalWidthScaling;
          }
          if (mesh.name !== 'frtruss' && mesh.name !== 'fltruss' && mesh.name !== 'groundTile' && mesh.name !== 'container_left_mezzanine' && mesh.name !== 'container_right_mezzanine') {
            mesh.scaling.y += TotalHeightScaling;
            ColorMesh(mesh);
          }
          ColorMesh(mesh);
        }
      }
    });
  }
  loadedMeshes[0].forEach((mesh) => {
    if (mesh) {
      if(mesh.name === 'Larrow'){

      }else if (mesh.name === 'Barrow' || mesh.name === 'bGround' || mesh.name === 'bLogo') {
        if(sessionStorage.getItem(`${mesh.name}_position_z`)){
          var position = parseFloat(sessionStorage.getItem(`${mesh.name}_position_z`));
          mesh.position.z = position;
        }else{
          if(localStorage.getItem('backAwning') == 'true'){
            mesh.position.z -= 4;
          }
        }
        if(mesh.name === 'Barrow'){
          if(TotalWidthScaling > 0){
            mesh.scaling.x += TotalWidthScaling;
          }
        }
      }else if (mesh.name === 'container_left') {
        if (leanToLeftPos > 0) {
          mesh.position.x = leanToLeftPos;
        }
        if (leftscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(2.5, 0, 0));
          mesh.scaling.x = leftscalingFactor;
        }
        if (TotalHeightScaling != 0) {
          mesh.scaling.y += TotalHeightScaling;
        }
        // if(mesh.name === 'cantileverLeft'){
        //   mesh.position.y = 0;
        // }
      }else if (mesh.name === 'leftAwningGroundTile'){
        if(leanToLeftPos > 0){
          mesh.position.x += leanToLeftPos;
        }
        if (leftscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(-1.25, 0, 0));
          mesh.scaling.x = leftscalingFactor;
        }
      }else if (mesh.name === 'rightAwningGroundTile'){
        if(leanToRightPos < 0){
          mesh.position.x += leanToRightPos;
        }
        if (rightscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(1.25, 0, 0));
          mesh.scaling.x = rightscalingFactor;
        }
      }
      else if (mesh.name === 'abltruss') {
        if (TotalHeightScaling != 0) {
          mesh.position.y += totalAwningTrussHeight;
        }
        if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
        }
        else {
          mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
        }
      }
      else if (mesh.name === 'abrtruss') {
        if (TotalHeightScaling != 0) {
          mesh.position.y += totalAwningTrussHeight;
        }
        if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
        }
        else {
          mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) + (-parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")))
        }
      } else if (mesh.name === 'container_right') {
        if (leanToRightPos < 0) {
          mesh.position.x = leanToRightPos;
        }
        if (rightscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(-2.5, 0, 0));
          mesh.scaling.x = rightscalingFactor;
        }
        if (TotalHeightScaling != 0) {
          mesh.scaling.y += TotalHeightScaling;
        }
        // if(mesh.name === 'cantileverRight'){
        //   mesh.position.y = 0;
        // }
      } else if (mesh.name === 'container_back') {
        if (backscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(1.2, 0, 0));
          mesh.scaling.z = backscalingFactor;
        }
      }
      else if(mesh.name === 'leanToLeft' || mesh.name === 'cantileverLeft' || mesh.name === 'leanToLeftWalls' || mesh.name === 'leanToLeftRoofs' 
        || mesh.name === 'leanToRight' || mesh.name === 'cantileverRight' || mesh.name === 'leanToRightWalls' || mesh.name === 'leanToRightRoofs' 
      ){
        ColorMesh(mesh);
      }
      else if (mesh.name === 'fRoof' || mesh.name === ' topCenter' || mesh.name === 'FTop' || mesh.name === 'BTop' || mesh.name === 'leanToBackRoof'
        || mesh.name === 'leanToBack' || mesh.name === 'cantileverFront' || mesh.name === 'cantileverBack') {
          mesh.scaling.x += TotalWidthScaling;
          if(mesh.name === 'fRoof'){
            RoofPitchUtility(mesh)
            mesh.scaling.y += totalRoofUpscaling;
            const children = mesh.getChildMeshes(); // Gets all child meshes of the container
            children.forEach(child => {
                if (child.material) {
                    ColorMesh(child)
                }
            });
          }else{
            mesh.setPivotPoint(new Vector3(0, 2.45, 0));
            mesh.scaling.y += totalRoofUpscaling;
          }
        if(TotalHeightScaling != 0){
          //mesh.setPivotPoint(new Vector3(0, 0, 0));
          if(mesh.name === 'fRoof' || mesh.name === 'leanToFrontRoof') {
            console.log("mesh position y = ", mesh.position.y, " totoa pos y: ", totalRoofPositioning)
            mesh.position.y += totalRoofPositioning;
            console.log("after: pos: ", mesh.position.y)
          }else if(mesh.name === 'FTop' || mesh.name === 'BTop'){
            if(localStorage.getItem('slab') !== 'Disable'){
              if(parseInt(localStorage.getItem('slabSize')) < 50){
                mesh.position.y = totalRoofPositioning;
              }else if(parseInt(localStorage.getItem('slabSize')) >= 50 && parseInt(localStorage.getItem('slabSize')) < 100){
                mesh.position.y = totalRoofPositioning + 0.1;
              }else if(parseInt(localStorage.getItem('slabSize')) >= 100 && parseInt(localStorage.getItem('slabSize')) < 150){
                mesh.position.y = totalRoofPositioning + 0.2;
              }else if(parseInt(localStorage.getItem('slabSize')) >= 150){
                mesh.position.y = totalRoofPositioning + 0.4;
              }
            }else{
              mesh.position.y = totalRoofPositioning;
            }
          }else{
            mesh.position.y = totalRoofPositioning;
          }
        }
      ColorMesh(mesh);
      } else if (mesh.name === "leantoleftcols" || mesh.name === 'leantoleftcolfront' || mesh.name === 'leantoleftcolback') {
        if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
        }
        else {
          console.log("in else of pitch")
          mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
        }
        mesh.scaling.y += TotalHeightScaling - 0.1;
        // if(parseInt(localStorage.getItem("height")) >=6){
        //   if(parseInt(localStorage.getItem('height')) == 6){
        //       mesh.scaling.y += 0.1;
        //   }else if(parseInt(localStorage.getItem('height')) == 7){
        //       mesh.scaling.y += 0.2;
        //   }else if(parseInt(localStorage.getItem('height')) == 8){
        //       mesh.scaling.y += 0.3;
        //   }else if(parseInt(localStorage.getItem('height')) == 9){
        //       mesh.scaling.y += 0.4;
        //   }else if(parseInt(localStorage.getItem('height')) == 10){
        //       mesh.scaling.y += 0.5;
        //   }
        // }
      } else if (mesh.name === "leantorightcols" || mesh.name === "leantorightcolfront" || mesh.name === "leantorightcolback") {
        if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
        }
        else {
          mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
        }
        mesh.scaling.y += TotalHeightScaling - 0.1;
        // if(parseInt(localStorage.getItem("height")) >=6){
        //   if(parseInt(localStorage.getItem('height')) == 6){
        //       mesh.scaling.y += 0.1;
        //   }else if(parseInt(localStorage.getItem('height')) == 7){
        //       mesh.scaling.y += 0.2;
        //   }else if(parseInt(localStorage.getItem('height')) == 8){
        //       mesh.scaling.y += 0.3;
        //   }else if(parseInt(localStorage.getItem('height')) == 9){
        //       mesh.scaling.y += 0.4;
        //   }else if(parseInt(localStorage.getItem('height')) == 10){
        //       mesh.scaling.y += 0.5;
        //   }
        // }
      } else if (mesh.name === 'backAwning') {
      } else if (mesh.name !== 'LHarrow' && mesh.name !== 'RHarrow' && mesh.name !== 'leanToLeft' && mesh.name !== 'leanToRight' && mesh.name !== 'cantileverLeft' && mesh.name !== 'cantileverRight'
        && mesh.name !== 'leanToLeftWalls' && mesh.name !== 'leanToLeftRoofs' && mesh.name !== 'leantoleftcols' && mesh.name !== 'leantoleftcolfront' && mesh.name !== 'leantoleftcolback'
        && mesh.name !== 'leanToRightRoofs' && mesh.name !== 'leantorightcols' && mesh.name !== "leantorightcolfront" && mesh.name !== "leantorightcolback" && mesh.name !== 'leanToRightWalls'
        && mesh.name !== 'container_left' && mesh.name !== 'container_right' && mesh.name !== 'container_back' && mesh.name !== 'leanToLeftPartWall' && mesh.name !== 'leanToLeftTriangle'
        && mesh.name !== 'leanToRightPartWall' && mesh.name !== 'leanToRightTriangle' && mesh.name !== 'leanToRightTriangleBack' && mesh.name !== 'leanToRightPartWallBack'
        && mesh.name !== 'leanToLeftTriangleBack' && mesh.name !== 'leanToLeftPartWallBack' && mesh.name !== 'leanToBackRoof' && mesh.name !== 'col1' && mesh.name !== 'col2' && mesh.name !== 'col3' && mesh.name !== 'col4' && mesh.name !== 'colfront1' && mesh.name !== 'colfront2'
        && mesh.name !== 'colCenter1' && mesh.name !== 'colCenter2'
      ) {
        if (mesh.name === 'bltruss' || mesh.name === 'brtruss') {
          if (TotalHeightScaling > 0) {
            mesh.position.y += totalRoofPositioning;
          }
          if (mesh.name === 'bltruss') {
            if (leanToLeftPos > 0) {
              mesh.position.x += leanToLeftPos;
            }
          } else {
            if (leanToRightPos < 0) {
              mesh.position.x += leanToRightPos;
            }
          }
        }
        if (mesh.name === 'container_left_bracing' || mesh.name === 'container_right_bracing') {
          if (mesh.name === 'container_left_bracing') {
            if (leanToLeftPos > 0)
              mesh.position.x += leanToLeftPos;
          }
          if (mesh.name === 'container_right_bracing') {
            if (leanToRightPos < 0)
              mesh.position.x += leanToRightPos;
          }
        } else if (mesh.name !== 'bltruss' && mesh.name !== 'brtruss') {
          mesh.scaling.x += TotalWidthScaling;
        }
        if (mesh.name !== 'bltruss' && mesh.name !== 'brtruss' && mesh.name !== 'groundTile' && mesh.name !== 'container_left_mezzanine' && mesh.name !== 'container_right_mezzanine') {
          mesh.scaling.y += TotalHeightScaling;
          ColorMesh(mesh);
        }
      }
    }
  });
  frontCount = 1;
  for (var i = 0; i < totalLength - 3; i++) {
    loadedMeshes = appendToFront(loadedMeshes, centerBayDimensions, centerBayPosition, scene)
  }


  loadedMeshes.forEach((mesh, index) => {
    mesh.forEach((element, elem_index) => {
      if(element.name !== 'groundTile' && element.name !== 'leftAwningGroundTile' && element.name !== 'rightAwningGroundTile'){
        if (element.name === 'container_left_mezzanine' || element.name === 'container_right_mezzanine') {
          if (copy[index][elem_index].isEnabled() == true) {
            element.setEnabled(true);
            console.log("hit true")
          } else {
            element.setEnabled(false);
          }
        }
        element.isVisible = copy[index][elem_index].isVisible;
      }
    })
  })
  // return new loadedMeshes Array
  //localStorage.setItem('reset','true');
  return loadedMeshes;
}
var frontBayDimensionsRef, frontBayPositionRef, centerBayDimensionsRef, centerBayPositionRef, sceneRef, loadedMeshesRef, leftText, baySizeRef;
//<========================================= Ref-setter hook ===========================================>//
export function setup_requirements(frontBayDimensions, centerBayDimensions, frontBayPosition, centerBayPosition, scene, loadedMeshes, leftTextRef, baySize) {
  frontBayDimensionsRef = frontBayDimensions;
  frontBayPositionRef = frontBayPosition;
  centerBayDimensionsRef = centerBayDimensions;
  centerBayPositionRef = centerBayPosition;
  sceneRef = scene
  loadedMeshesRef = loadedMeshes;
  leftText = leftTextRef;
  baySizeRef = baySize;
}

export function setup_extras() {
  return [sceneRef, loadedMeshesRef];
}

//<================================================= awning Pitch Handler ================================================>
var awningPitch;
var leftscalingFactor = 0;
var rightscalingFactor = 0;
var frontscalingFactor = 0;
var backscalingFactor = 0;
var larrowPos = 0;
var lTextPos = 0;
var prevLeftAwningPitch = 2.5;
var prevRightAwningPitch = 2.5;
export function leftawninglengthgetter(scaling) {
  leftscalingFactor = scaling;
}
export function rightawninglengthgetter(scaling) {
  rightscalingFactor = scaling;
}
export function frontawninglengthgetter(scaling) {
  frontscalingFactor = scaling;
}
export function backawninglengthgetter(scaling) {
  backscalingFactor = scaling;
}
export function getarrowpos(pos) {
  larrowPos = pos;
}
export function getltextpos(pos) {
  lTextPos = pos;
}
export function awningPitchHandler(pitch) {
  //logic for handling pitch values

  if (pitch == null) {
    awningPitch = 2.5;
  }
  else {
    awningPitch = pitch;
  }
  var copy = loadedMeshesRef.current.map(meshes => {
    return meshes.map(mesh => {
      // Create a new instance with the same prototype and properties
      return Object.create(Object.getPrototypeOf(mesh), Object.getOwnPropertyDescriptors(mesh));
    });
  });


  var totalLength = loadedMeshesRef.current.length;
  //disposal logic
  loadedMeshesRef.current.forEach((meshes) => {
    if (meshes) {
      meshes.forEach((mesh) => {
        if (mesh) {
          mesh.dispose();
        }
      });
    }
  });
  loadedMeshesRef.current = [[], [], []];
  //creation logic
  loadedMeshesRef.current[0] = gable.createBackBay(
    centerBayDimensionsRef,
    centerBayPositionRef,
    2,
    sceneRef.current,
    degree,
    awningPitch
  );
  loadedMeshesRef.current[1] = gable.createFrontBay(1, 0, sceneRef.current, degree, awningPitch);
  loadedMeshesRef.current[2] = gable.createCenterBay(
    frontBayDimensionsRef,
    frontBayPositionRef,
    0.976,
    sceneRef.current,
    degree,
    awningPitch
  );
  loadedMeshesRef.current[2].forEach((mesh) => {
    if (mesh) {
      if (mesh.name == 'arrow' || mesh.name == 'Larrow') {
        // console.log("hit: ", mesh.name)
        // if(finalPosition){
        // mesh.position.x = finalPosition;
        // if(localStorage.getItem('leftAwning') === 'true' || localStorage.getItem('cantileverLeft') === 'true'){
        //   mesh.position.x =  (sessionStorage.getItem("ArrowPosition_") -4);
        //  }
        // }

      } else if (mesh.name === 'fRoof' || mesh.name === 'topCenter' || mesh.name === 'FTop' || mesh.name === 'BTop' || mesh.name === 'leanToFrontRoof') {
        mesh.scaling.x += TotalWidthScaling;
        if(mesh.name === 'fRoof'){
          RoofPitchUtility(mesh)
          mesh.scaling.y += totalRoofUpscaling;
          const children = mesh.getChildMeshes(); // Gets all child meshes of the container
          children.forEach(child => {
              if (child.material) {
                  ColorMesh(child)
              }
          });
        }else{
          mesh.setPivotPoint(new Vector3(0, 2.45, 0));
          mesh.scaling.y += totalRoofUpscaling;
        }
      if(TotalHeightScaling != 0){
        //mesh.setPivotPoint(new Vector3(0, 0, 0));
        if(mesh.name === 'fRoof' || mesh.name === 'leanToFrontRoof') {
          console.log("mesh position y = ", mesh.position.y, " totoa pos y: ", totalRoofPositioning)
          mesh.position.y += totalRoofPositioning;
          console.log("after: pos: ", mesh.position.y)
        }else if(mesh.name === 'FTop' || mesh.name === 'BTop'){
          if(localStorage.getItem('slab') !== 'Disable'){
            if(parseInt(localStorage.getItem('slabSize')) < 50){
              mesh.position.y = totalRoofPositioning;
            }else if(parseInt(localStorage.getItem('slabSize')) >= 50 && parseInt(localStorage.getItem('slabSize')) < 100){
              mesh.position.y = totalRoofPositioning + 0.1;
            }else if(parseInt(localStorage.getItem('slabSize')) >= 100 && parseInt(localStorage.getItem('slabSize')) < 150){
              mesh.position.y = totalRoofPositioning + 0.2;
            }else if(parseInt(localStorage.getItem('slabSize')) >= 150){
              mesh.position.y = totalRoofPositioning + 0.4;
            }
          }else{
            mesh.position.y = totalRoofPositioning;
          }
        }else{
          mesh.position.y = totalRoofPositioning;
        }
      }
    ColorMesh(mesh);
        // previous maybe redudant code, keep until sure not required
        // mesh.scaling.x += TotalWidthScaling;
        // if(mesh.name === 'fRoof'){
        //   if (localStorage.getItem("slab") === "Enable"){ 
        //     if (parseInt(localStorage.getItem("slabSize")) > 150) {
        //       mesh.setPivotPoint(new Vector3(0, 2.35, 0));
        //       mesh.position.y = totalRoofPositioning + 0.48;
        //     } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100) {
        //       mesh.setPivotPoint(new Vector3(0, 2.35, 0));
        //       mesh.position.y = totalRoofPositioning + 0.47;
        //     } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50) {
        //       mesh.setPivotPoint(new Vector3(0, 2.35, 0));
        //       mesh.position.y = totalRoofPositioning + 0.46;
        //     } else if (parseInt(localStorage.getItem("slabSize")) < 50) {
        //       mesh.setPivotPoint(new Vector3(0, 2.00, 0));
        //       mesh.position.y = totalRoofPositioning + 0.45;
        //     }else{
        //       mesh.position.y = totalRoofPositioning + 0.45;
        //     } 
        //   }else{
        //     mesh.setPivotPoint(new Vector3(0, 2.00, 0));
        //   }
        //   mesh.scaling.y += totalRoofUpscaling + 0.45;
        // }else{
        //   mesh.setPivotPoint(new Vector3(0, 2.45, 0));
        //   mesh.scaling.y += totalRoofUpscaling;
        // }
        // if (TotalHeightScaling != 0) {
        //   if (totalRoofPositioning > 0) {
        //     if (localStorage.getItem("slab") === "Enable") {            
        //     if (parseInt(localStorage.getItem("slabSize")) > 150) {
        //       mesh.position.y = totalRoofPositioning + 0.4;
        //     } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100) {
        //       mesh.position.y = totalRoofPositioning + 0.2;
        //     } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50) {
        //       mesh.position.y = totalRoofPositioning + 0.1;
        //     } else if (parseInt(localStorage.getItem("slabSize")) < 50) {
        //       mesh.position.y = totalRoofPositioning;
        //     }else{
        //       mesh.position.y = totalRoofPositioning + 0.3;
        //     }
        //       // mesh.position.y = totalRoofPositioning +;
        //     } else {
        //       console.log("total roof positioning: ", totalRoofPositioning)
        //       mesh.position.y = totalRoofPositioning;
        //     }
        // }
        // }
        //ColorMesh(mesh);
      }
      else if (mesh.name === 'container_left' || mesh.name === 'cantileverLeft') {
        if (leanToLeftPos > 0) {
          mesh.position.x = leanToLeftPos;
        }
        if (leftscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(2.5, 0, 0));
          mesh.scaling.x = leftscalingFactor;
        }
        if (TotalHeightScaling != 0) {
          mesh.scaling.y += TotalHeightScaling;
        }
      }else if (mesh.name === 'leftAwningGroundTile'){
        if(leanToLeftPos > 0){
          console.log("pushing leantoleft pos: ", mesh.position.x, "is now +: ", leanToLeftPos)
          mesh.position.x += leanToLeftPos;
        }
        if (leftscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(-1.25, 0, 0));
          mesh.scaling.x = leftscalingFactor;
        }
      }else if (mesh.name === 'rightAwningGroundTile'){
        if(leanToRightPos < 0){
          mesh.position.x += leanToRightPos;
        }
        if (rightscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(1.25, 0, 0));
          mesh.scaling.x = rightscalingFactor;
        }
      }
      else if (mesh.name === 'altruss') {
        if (TotalHeightScaling != 0) {
          mesh.position.y += totalAwningTrussHeight;
        }
        if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
        }
        else {
          mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
        }
      }
      else if (mesh.name === 'ratruss') {
        if (TotalHeightScaling != 0) {
          mesh.position.y += totalAwningTrussHeight;
        }
        if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
        }
        else {
          mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) + (-parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")))
        }
      }
      else if (mesh.name === 'container_right' || mesh.name === 'cantileverRight') {
        if (leanToRightPos < 0) {
          mesh.position.x = leanToRightPos;
        }
        if (rightscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(-2.5, 0, 0));
          mesh.scaling.x = rightscalingFactor;
        }
        if (TotalHeightScaling != 0) {
          mesh.scaling.y += TotalHeightScaling;
        }
        // if(mesh.name === 'cantileverRight'){
        //   mesh.position.y = 0;
        // }
      } else if (mesh.name === "leantoleftcols" || mesh.name === "leantoleftcolfront" || mesh.name === "leantoleftcolback") {
        if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
        }
        else {
          mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
        }
        mesh.scaling.y += TotalHeightScaling - 0.1;
        // if(parseInt(localStorage.getItem("height")) >=6){
        //   if(parseInt(localStorage.getItem('height')) == 6){
        //       mesh.scaling.y += 0.1;
        //   }else if(parseInt(localStorage.getItem('height')) == 7){
        //       mesh.scaling.y += 0.2;
        //   }else if(parseInt(localStorage.getItem('height')) == 8){
        //       mesh.scaling.y += 0.3;
        //   }else if(parseInt(localStorage.getItem('height')) == 9){
        //       mesh.scaling.y += 0.4;
        //   }else if(parseInt(localStorage.getItem('height')) == 10){
        //       mesh.scaling.y += 0.5;
        //   }
        // }
      } else if (mesh.name === "leantorightcols" || mesh.name === "leantorightcolfront" || mesh.name === "leantorightcolback") {
        if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
        }
        else {
          mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
        }
        mesh.scaling.y += TotalHeightScaling - 0.1;
        // if(parseInt(localStorage.getItem("height")) >=6){
        //   if(parseInt(localStorage.getItem('height')) == 6){
        //       mesh.scaling.y += 0.1;
        //   }else if(parseInt(localStorage.getItem('height')) == 7){
        //       mesh.scaling.y += 0.2;
        //   }else if(parseInt(localStorage.getItem('height')) == 8){
        //       mesh.scaling.y += 0.3;
        //   }else if(parseInt(localStorage.getItem('height')) == 9){
        //       mesh.scaling.y += 0.4;
        //   }else if(parseInt(localStorage.getItem('height')) == 10){
        //       mesh.scaling.y += 0.5;
        //   }
        // }
      }
      else if (mesh.name !== 'LHarrow' && mesh.name !== 'RHarrow' && mesh.name !== 'leanToLeft' && mesh.name !== 'leanToRight' && mesh.name !== 'cantileverLeft' && mesh.name !== 'cantileverRight'
        && mesh.name !== 'leanToLeftWalls' && mesh.name !== 'leanToLeftRoofs' && mesh.name !== 'leantoleftcols' && mesh.name !== 'leantoleftcolfront' && mesh.name !== 'leantoleftcolback'
        && mesh.name !== 'leanToRightRoofs' && mesh.name !== 'leantorightcols' && mesh.name !== "leantorightcolfront" && mesh.name !== "leantorightcolback" && mesh.name !== 'leanToRightWalls'
        && mesh.name !== 'container_left' && mesh.name !== 'container_right' && mesh.name !== 'leanToLeftPartWall' && mesh.name !== 'leanToLeftTriangle'
        && mesh.name !== 'leanToRightPartWall' && mesh.name !== 'leanToRightTriangle' && mesh.name !== 'col1' && mesh.name !== 'col2' && mesh.name !== 'col3' && mesh.name !== 'col4' && mesh.name !== 'colfront1' && mesh.name !== 'colfront2'
        && mesh.name !== 'colCenter1' && mesh.name !== 'colCenter2'
      ) {
        if (mesh.name === 'ltruss' || mesh.name === 'rtruss') {
          if (TotalHeightScaling > 0) {
            mesh.position.y += totalRoofPositioning;
          }
          if (mesh.name === 'ltruss') {
            if (leanToLeftPos > 0) {
              mesh.position.x += leanToLeftPos;
            }
          } else {
            if (leanToRightPos < 0) {
              mesh.position.x += leanToRightPos;
            }
          }
        }
        if (mesh.name === 'container_left_bracing' || mesh.name === 'container_right_bracing') {
          if (mesh.name === 'container_left_bracing') {
            if (leanToLeftPos > 0) {
              console.log("set left")
              mesh.position.x = leanToLeftPos;
            }
          }
          if (mesh.name === 'container_right_bracing') {
            if (leanToRightPos < 0) {
              mesh.position.x = leanToRightPos;
            }
          }
        } else if (mesh.name !== 'ltruss' && mesh.name !== 'rtruss') {
          mesh.scaling.x += TotalWidthScaling;
        }
        if (mesh.name !== 'ltruss' && mesh.name !== 'rtruss' && mesh.name !== 'groundTile' && mesh.name !== 'container_left_mezzanine' && mesh.name !== 'container_right_mezzanine') {
          console.log("hitting here: ", mesh.name)
          mesh.scaling.y += TotalHeightScaling;
          ColorMesh(mesh);
        }
      }
    }
    if(mesh.name === 'leanToLeft' || mesh.name === 'cantileverLeft' || mesh.name === 'leanToLeftWalls' || mesh.name === 'leanToLeftRoofs' 
      || mesh.name === 'leanToRight' || mesh.name === 'cantileverRight' || mesh.name === 'leanToRightWalls' || mesh.name === 'leanToRightRoofs' 
    ){
      ColorMesh(mesh);
    }
  });
  // Apply scaling to front mesh
  if (loadedMeshesRef.current[1]) {
    loadedMeshesRef.current[1].forEach((mesh) => {
      if (mesh) {
        if(mesh.name === 'Larrow'){

        }else if (mesh.name === 'arrow' || mesh.name === 'fGround' || mesh.name === 'fLogo') {
            var frontBayOffset = gable.recieveFrontBayOffset();
            if (mesh.name === 'arrow') {
              if (sessionStorage.getItem("frontArrowPosition_") > 0) {
                console.log("this is running")
                mesh.position.z = parseFloat(sessionStorage.getItem("frontArrowPosition_"))
                // console.log("set: ", mesh.position.z)
              } else {
                if (frontBayOffset > 0) {
                  mesh.position.z = 6;
                } else {
                  if(localStorage.getItem("frontAwning") === 'true'){
                    mesh.position.z = 6;
                  }
                }
              }
              if(TotalWidthScaling > 0){
                mesh.scaling.x += TotalWidthScaling;
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
            ColorMesh(mesh);
          }
          else if (mesh.name === 'container_left' || mesh.name === 'cantileverLeft') {
          if (leanToLeftPos > 0) {
            mesh.position.x = leanToLeftPos;
          }
          if (leftscalingFactor != 0) {
            mesh.setPivotPoint(new Vector3(2.5, 0, 0));
            mesh.scaling.x = leftscalingFactor;
          }
          if (TotalHeightScaling != 0) {
            mesh.scaling.y += TotalHeightScaling;
          }
          // if(mesh.name === 'cantileverLeft'){
          //   mesh.position.y = 0;
          // }
        }else if (mesh.name === 'leftAwningGroundTile'){
          if(leanToLeftPos > 0){
            mesh.position.x += leanToLeftPos;
          }
          if (leftscalingFactor != 0) {
            mesh.setPivotPoint(new Vector3(-1.25, 0, 0));
            mesh.scaling.x = leftscalingFactor;
          }
        }else if (mesh.name === 'rightAwningGroundTile'){
          if(leanToRightPos < 0){
            mesh.position.x += leanToRightPos;
          }
          if (rightscalingFactor != 0) {
            mesh.setPivotPoint(new Vector3(1.25, 0, 0));
            mesh.scaling.x = rightscalingFactor;
          }
        }
        else if (mesh.name === 'afltruss') {
          if (TotalHeightScaling != 0) {
            mesh.position.y += totalAwningTrussHeight;
          }
          if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
            mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
          }
          else {
            mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
          }
        }
        else if (mesh.name === 'afrtruss') {
          if (TotalHeightScaling != 0) {
            mesh.position.y += totalAwningTrussHeight;
          }
          if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
            mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
          }
          else {
            mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) + (-parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")))
          }
        }

        else if (mesh.name === 'container_right' || mesh.name === 'cantileverRight') {
          if (leanToRightPos < 0) {
            mesh.position.x = leanToRightPos;
          }
          if (rightscalingFactor != 0) {
            mesh.setPivotPoint(new Vector3(-2.5, 0, 0));
            mesh.scaling.x = rightscalingFactor;
          }
          if (TotalHeightScaling != 0) {
            mesh.scaling.y += TotalHeightScaling;
          }
          // if(mesh.name === 'cantileverRight'){
          //   //mesh.position.y = 0;
          // }
        } else if (mesh.name === 'container_front') {
          if (frontscalingFactor != 0) {
            mesh.setPivotPoint(new Vector3(-1.2, 0, 0));
            mesh.scaling.z = frontscalingFactor;
          }
        }

        else if (mesh.name === 'fRoof' || mesh.name === ' topCenter' || mesh.name === 'FTop' || mesh.name === 'BTop' || mesh.name === 'leanToFrontRoof') {
          mesh.scaling.x += TotalWidthScaling;
          if(mesh.name === 'fRoof'){
            RoofPitchUtility(mesh)
            mesh.scaling.y += totalRoofUpscaling;
            const children = mesh.getChildMeshes(); // Gets all child meshes of the container
            children.forEach(child => {
                if (child.material) {
                    ColorMesh(child)
                }
            });
          }else{
            mesh.setPivotPoint(new Vector3(0, 2.45, 0));
            mesh.scaling.y += totalRoofUpscaling;
            // if(mesh.name === 'leanToFrontRoof' ){
            //   console.log("hittttttt successfully")
            //   AwningRoofUtility(mesh)
            // }
          }
        if(TotalHeightScaling != 0){
          //mesh.setPivotPoint(new Vector3(0, 0, 0));
          if(mesh.name === 'fRoof' || mesh.name === 'leanToFrontRoof') {
            console.log("mesh position y = ", mesh.position.y, " totoa pos y: ", totalRoofPositioning)
            mesh.position.y += totalRoofPositioning;
            console.log("after: pos: ", mesh.position.y)
          }else if(mesh.name === 'FTop' || mesh.name === 'BTop'){
            if(localStorage.getItem('slab') !== 'Disable'){
              if(parseInt(localStorage.getItem('slabSize')) < 50){
                mesh.position.y = totalRoofPositioning;
              }else if(parseInt(localStorage.getItem('slabSize')) >= 50 && parseInt(localStorage.getItem('slabSize')) < 100){
                mesh.position.y = totalRoofPositioning + 0.1;
              }else if(parseInt(localStorage.getItem('slabSize')) >= 100 && parseInt(localStorage.getItem('slabSize')) < 150){
                mesh.position.y = totalRoofPositioning + 0.2;
              }else if(parseInt(localStorage.getItem('slabSize')) >= 150){
                mesh.position.y = totalRoofPositioning + 0.4;
              }
            }else{
              mesh.position.y = totalRoofPositioning;
            }
          }else{
            mesh.position.y = totalRoofPositioning;
          }
        }
        ColorMesh(mesh);
          //keep redudndant code until no longer required
          // mesh.scaling.x += TotalWidthScaling;
          // if(mesh.name === 'fRoof'){
          //   if (localStorage.getItem("slab") === "Enable"){ 
          //     if (parseInt(localStorage.getItem("slabSize")) > 150) {
          //       mesh.setPivotPoint(new Vector3(0, 2.35, 0));
          //       mesh.position.y = totalRoofPositioning + 0.48;
          //     } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100) {
          //       mesh.setPivotPoint(new Vector3(0, 2.35, 0));
          //       mesh.position.y = totalRoofPositioning + 0.47;
          //     } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50) {
          //       mesh.setPivotPoint(new Vector3(0, 2.35, 0));
          //       mesh.position.y = totalRoofPositioning + 0.46;
          //     } else if (parseInt(localStorage.getItem("slabSize")) < 50) {
          //       mesh.setPivotPoint(new Vector3(0, 2.00, 0));
          //       mesh.position.y = totalRoofPositioning + 0.45;
          //     }else{
          //       mesh.position.y = totalRoofPositioning + 0.45;
          //     } 
          //   }else{
          //     mesh.setPivotPoint(new Vector3(0, 2.00, 0));
          //   }
          //   mesh.scaling.y += totalRoofUpscaling;
          // }else{
          //   mesh.setPivotPoint(new Vector3(0, 2.45, 0));
          //   mesh.scaling.y += totalRoofUpscaling;
          // }
          // if (TotalHeightScaling != 0) {
          //   if (totalRoofPositioning > 0) {
          //     if (localStorage.getItem("slab") === "Enable") {            
          //     if (parseInt(localStorage.getItem("slabSize")) > 150) {
          //       mesh.position.y = totalRoofPositioning + 0.4;
          //     } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100) {
          //       mesh.position.y = totalRoofPositioning + 0.2;
          //     } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50) {
          //       mesh.position.y = totalRoofPositioning + 0.1;
          //     } else if (parseInt(localStorage.getItem("slabSize")) < 50) {
          //       mesh.position.y = totalRoofPositioning;
          //     }else{
          //       mesh.position.y = totalRoofPositioning + 0.3;
          //     }
          //       // mesh.position.y = totalRoofPositioning +;
          //     } else {
          //       console.log("total roof positioning: ", totalRoofPositioning)
          //       mesh.position.y = totalRoofPositioning;
          //     }
          // }
          // }
          // ColorMesh(mesh);
        } else if (mesh.name === "leantoleftcols" || mesh.name === 'leantoleftcolfront' || mesh.name === 'leantoleftcolback') {
          if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
            mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
          }
          else {
            mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
          }
          mesh.scaling.y += TotalHeightScaling - 0.1
          // mesh.scaling.y += TotalHeightScaling;
          // if(parseInt(localStorage.getItem("height")) >=6){
          //   if(parseInt(localStorage.getItem('height')) == 6){
          //       mesh.scaling.y += 0.1;
          //   }else if(parseInt(localStorage.getItem('height')) == 7){
          //       mesh.scaling.y += 0.2;
          //   }else if(parseInt(localStorage.getItem('height')) == 8){
          //       mesh.scaling.y += 0.3;
          //   }else if(parseInt(localStorage.getItem('height')) == 9){
          //       mesh.scaling.y += 0.4;
          //   }else if(parseInt(localStorage.getItem('height')) == 10){
          //       mesh.scaling.y += 0.5;
          //   }
          // }
        } else if (mesh.name === "leantorightcols" || mesh.name === "leantorightcolfront" || mesh.name === "leantorightcolback") {
          if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
            mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
          }
          else {
            mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
          }
          mesh.scaling.y += TotalHeightScaling - 0.1;
          // if(parseInt(localStorage.getItem("height")) >=6){
          //   if(parseInt(localStorage.getItem('height')) == 6){
          //       mesh.scaling.y += 0.1;
          //   }else if(parseInt(localStorage.getItem('height')) == 7){
          //       mesh.scaling.y += 0.2;
          //   }else if(parseInt(localStorage.getItem('height')) == 8){
          //       mesh.scaling.y += 0.3;
          //   }else if(parseInt(localStorage.getItem('height')) == 9){
          //       mesh.scaling.y += 0.4;
          //   }else if(parseInt(localStorage.getItem('height')) == 10){
          //       mesh.scaling.y += 0.5;
          //   }
          // }
        } else if (mesh.name !== 'LHarrow' && mesh.name !== 'RHarrow' && mesh.name !== 'leanToLeft' && mesh.name !== 'leanToRight' && mesh.name !== 'cantileverLeft' && mesh.name !== 'cantileverRight'
          && mesh.name !== 'leanToLeftWalls' && mesh.name !== 'leanToLeftRoofs' && mesh.name !== 'leantoleftcols' && mesh.name !== 'leantoleftcolfront' && mesh.name !== 'leantoleftcolback'
          && mesh.name !== 'leanToRightRoofs' && mesh.name !== 'leantorightcols' && mesh.name !== "leantorightcolfront" && mesh.name !== "leantorightcolback" && mesh.name !== 'leanToRightWalls'
          && mesh.name !== 'container_left' && mesh.name !== 'container_right' && mesh.name !== 'leanToLeftPartWall' && mesh.name !== 'leanToLeftTriangle'
          && mesh.name !== 'leanToRightPartWall' && mesh.name !== 'leanToRightTriangle' && mesh.name !== 'col1' && mesh.name !== 'col2' && mesh.name !== 'col3' && mesh.name !== 'col4' && mesh.name !== 'colfront1' && mesh.name !== 'colfront2'
          && mesh.name !== 'colCenter1' && mesh.name !== 'colCenter2'
        ) {
          if (mesh.name === 'fltruss' || mesh.name === 'frtruss') {
            if (TotalHeightScaling > 0) {
              mesh.position.y += totalRoofPositioning;
            }
            if (mesh.name === 'fltruss') {
              if (leanToLeftPos > 0) {
                mesh.position.x += leanToLeftPos;
              }
            } else {
              if (leanToRightPos < 0) {
                mesh.position.x += leanToRightPos;
              }
            }
          }
          if (mesh.name === 'container_left_bracing' || mesh.name === 'container_right_bracing') {
            if (mesh.name === 'container_left_bracing') {
              if (leanToLeftPos > 0) {
                console.log("set left")
                mesh.position.x += leanToLeftPos;
              }
            }
            if (mesh.name === 'container_right_bracing') {
              if (leanToRightPos < 0) {
                console.log("set right")
                mesh.position.x += leanToRightPos;
              }
            }
          } else if (mesh.name !== 'frtruss' && mesh.name !== 'fltruss') {
            mesh.scaling.x += TotalWidthScaling;
          }
          if (mesh.name !== 'frtruss' && mesh.name !== 'fltruss' && mesh.name !== 'groundTile' && mesh.name !== 'container_left_mezzanine' && mesh.name !== 'container_right_mezzanine') {
            mesh.scaling.y += TotalHeightScaling;
            ColorMesh(mesh);
          }
        }
      }
      if(mesh.name === 'leanToLeft' || mesh.name === 'cantileverLeft' || mesh.name === 'leanToLeftWalls' || mesh.name === 'leanToLeftRoofs' 
        || mesh.name === 'leanToRight' || mesh.name === 'cantileverRight' || mesh.name === 'leanToRightWalls' || mesh.name === 'leanToRightRoofs' 
      ){
        ColorMesh(mesh);
      }
    });
  }
  loadedMeshesRef.current[0].forEach((mesh) => {
    if (mesh) {
      if(mesh.name === 'Larrow'){

      }else if (mesh.name === 'Barrow' || mesh.name === 'bGround' || mesh.name === 'bLogo') {
        if(sessionStorage.getItem(`${mesh.name}_position_z`)){
          var position = parseFloat(sessionStorage.getItem(`${mesh.name}_position_z`));
          mesh.position.z = position;
        }else{
          if(localStorage.getItem('backAwning') == 'true'){
            mesh.position.z -= 4;
          }
        }
        if(mesh.name === 'Barrow'){
          if(TotalWidthScaling > 0){
            mesh.scaling.x += TotalWidthScaling;
          }
        }
      }else if (mesh.name === 'container_left') {
        if (leanToLeftPos > 0) {
          mesh.position.x = leanToLeftPos;
        }
        if (leftscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(2.5, 0, 0));
          mesh.scaling.x = leftscalingFactor;
        }
        if (TotalHeightScaling != 0) {
          mesh.scaling.y += TotalHeightScaling;
        }
        // if(mesh.name === 'cantileverLeft'){
        //   mesh.position.y = 0;
        // }
      }else if (mesh.name === 'leftAwningGroundTile'){
        if(leanToLeftPos > 0){
          mesh.position.x += leanToLeftPos;
        }
        if (leftscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(-1.25, 0, 0));
          mesh.scaling.x = leftscalingFactor;
        }
      }else if (mesh.name === 'rightAwningGroundTile'){
        if(leanToRightPos < 0){
          mesh.position.x += leanToRightPos;
        }
        if (rightscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(1.25, 0, 0));
          mesh.scaling.x = rightscalingFactor;
        }
      }
      else if (mesh.name === 'abltruss') {
        if (TotalHeightScaling != 0) {
          mesh.position.y += totalAwningTrussHeight;
        }
        if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
        }
        else {
          mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
        }
      }
      else if (mesh.name === 'abrtruss') {
        if (TotalHeightScaling != 0) {
          mesh.position.y += totalAwningTrussHeight;
        }
        if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
        }
        else {
          mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) + (-parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")))
        }
      } else if (mesh.name === 'container_right') {
        if (leanToRightPos < 0) {
          mesh.position.x = leanToRightPos;
        }
        if (rightscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(-2.5, 0, 0));
          mesh.scaling.x = rightscalingFactor;
        }
        if (TotalHeightScaling != 0) {
          mesh.scaling.y += TotalHeightScaling;
        }
        // if(mesh.name === 'cantileverRight'){
        //   mesh.position.y = 0;
        // }
      } else if (mesh.name === 'container_back') {
        if (backscalingFactor != 0) {
          mesh.setPivotPoint(new Vector3(1.2, 0, 0));
          mesh.scaling.z = backscalingFactor;
        }
      }
      else if(mesh.name === 'leanToLeft' || mesh.name === 'cantileverLeft' || mesh.name === 'leanToLeftWalls' || mesh.name === 'leanToLeftRoofs' 
        || mesh.name === 'leanToRight' || mesh.name === 'cantileverRight' || mesh.name === 'leanToRightWalls' || mesh.name === 'leanToRightRoofs' 
      ){
        ColorMesh(mesh);
      }
      else if (mesh.name === 'fRoof' || mesh.name === ' topCenter' || mesh.name === 'FTop' || mesh.name === 'BTop' || mesh.name === 'leanToBackRoof'
        || mesh.name === 'leanToBack' || mesh.name === 'cantileverFront' || mesh.name === 'cantileverBack') {
          mesh.scaling.x += TotalWidthScaling;
          if(mesh.name === 'fRoof'){
            RoofPitchUtility(mesh)
            mesh.scaling.y += totalRoofUpscaling;
            const children = mesh.getChildMeshes(); // Gets all child meshes of the container
            children.forEach(child => {
                if (child.material) {
                    ColorMesh(child)
                }
            });
          }else{
            mesh.setPivotPoint(new Vector3(0, 2.45, 0));
            mesh.scaling.y += totalRoofUpscaling;
          }
        if(TotalHeightScaling != 0){
          //mesh.setPivotPoint(new Vector3(0, 0, 0));
          if(mesh.name === 'fRoof' || mesh.name === 'leanToFrontRoof') {
            console.log("mesh position y = ", mesh.position.y, " totoa pos y: ", totalRoofPositioning)
            mesh.position.y += totalRoofPositioning;
            console.log("after: pos: ", mesh.position.y)
          }else if(mesh.name === 'FTop' || mesh.name === 'BTop'){
            if(localStorage.getItem('slab') !== 'Disable'){
              if(parseInt(localStorage.getItem('slabSize')) < 50){
                mesh.position.y = totalRoofPositioning;
              }else if(parseInt(localStorage.getItem('slabSize')) >= 50 && parseInt(localStorage.getItem('slabSize')) < 100){
                mesh.position.y = totalRoofPositioning + 0.1;
              }else if(parseInt(localStorage.getItem('slabSize')) >= 100 && parseInt(localStorage.getItem('slabSize')) < 150){
                mesh.position.y = totalRoofPositioning + 0.2;
              }else if(parseInt(localStorage.getItem('slabSize')) >= 150){
                mesh.position.y = totalRoofPositioning + 0.4;
              }
            }else{
              mesh.position.y = totalRoofPositioning;
            }
          }else{
            mesh.position.y = totalRoofPositioning;
          }
        }
      ColorMesh(mesh);
      } else if (mesh.name === "leantoleftcols" || mesh.name === 'leantoleftcolfront' || mesh.name === 'leantoleftcolback') {
        if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
        }
        else {
          console.log("in else of pitch")
          mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
        }
        mesh.scaling.y += TotalHeightScaling - 0.1;
        // if(parseInt(localStorage.getItem("height")) >=6){
        //   if(parseInt(localStorage.getItem('height')) == 6){
        //       mesh.scaling.y += 0.1;
        //   }else if(parseInt(localStorage.getItem('height')) == 7){
        //       mesh.scaling.y += 0.2;
        //   }else if(parseInt(localStorage.getItem('height')) == 8){
        //       mesh.scaling.y += 0.3;
        //   }else if(parseInt(localStorage.getItem('height')) == 9){
        //       mesh.scaling.y += 0.4;
        //   }else if(parseInt(localStorage.getItem('height')) == 10){
        //       mesh.scaling.y += 0.5;
        //   }
        // }
      } else if (mesh.name === "leantorightcols" || mesh.name === "leantorightcolfront" || mesh.name === "leantorightcolback") {
        if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
          mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
        }
        else {
          mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) - parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_"))
        }
        mesh.scaling.y += TotalHeightScaling - 0.1;
        // if(parseInt(localStorage.getItem("height")) >=6){
        //   if(parseInt(localStorage.getItem('height')) == 6){
        //       mesh.scaling.y += 0.1;
        //   }else if(parseInt(localStorage.getItem('height')) == 7){
        //       mesh.scaling.y += 0.2;
        //   }else if(parseInt(localStorage.getItem('height')) == 8){
        //       mesh.scaling.y += 0.3;
        //   }else if(parseInt(localStorage.getItem('height')) == 9){
        //       mesh.scaling.y += 0.4;
        //   }else if(parseInt(localStorage.getItem('height')) == 10){
        //       mesh.scaling.y += 0.5;
        //   }
        // }
      } else if (mesh.name === 'backAwning') {
      } else if (mesh.name !== 'LHarrow' && mesh.name !== 'RHarrow' && mesh.name !== 'leanToLeft' && mesh.name !== 'leanToRight' && mesh.name !== 'cantileverLeft' && mesh.name !== 'cantileverRight'
        && mesh.name !== 'leanToLeftWalls' && mesh.name !== 'leanToLeftRoofs' && mesh.name !== 'leantoleftcols' && mesh.name !== 'leantoleftcolfront' && mesh.name !== 'leantoleftcolback'
        && mesh.name !== 'leanToRightRoofs' && mesh.name !== 'leantorightcols' && mesh.name !== "leantorightcolfront" && mesh.name !== "leantorightcolback" && mesh.name !== 'leanToRightWalls'
        && mesh.name !== 'container_left' && mesh.name !== 'container_right' && mesh.name !== 'container_back' && mesh.name !== 'leanToLeftPartWall' && mesh.name !== 'leanToLeftTriangle'
        && mesh.name !== 'leanToRightPartWall' && mesh.name !== 'leanToRightTriangle' && mesh.name !== 'leanToRightTriangleBack' && mesh.name !== 'leanToRightPartWallBack'
        && mesh.name !== 'leanToLeftTriangleBack' && mesh.name !== 'leanToLeftPartWallBack' && mesh.name !== 'leanToBackRoof' && mesh.name !== 'col1' && mesh.name !== 'col2' && mesh.name !== 'col3' && mesh.name !== 'col4' && mesh.name !== 'colfront1' && mesh.name !== 'colfront2'
        && mesh.name !== 'colCenter1' && mesh.name !== 'colCenter2'
      ) {
        if (mesh.name === 'bltruss' || mesh.name === 'brtruss') {
          if (TotalHeightScaling > 0) {
            mesh.position.y += totalRoofPositioning;
          }
          if (mesh.name === 'bltruss') {
            if (leanToLeftPos > 0) {
              mesh.position.x += leanToLeftPos;
            }
          } else {
            if (leanToRightPos < 0) {
              mesh.position.x += leanToRightPos;
            }
          }
        }
        if (mesh.name === 'container_left_bracing' || mesh.name === 'container_right_bracing') {
          if (mesh.name === 'container_left_bracing') {
            if (leanToLeftPos > 0)
              mesh.position.x += leanToLeftPos;
          }
          if (mesh.name === 'container_right_bracing') {
            if (leanToRightPos < 0)
              mesh.position.x += leanToRightPos;
          }
        } else if (mesh.name !== 'bltruss' && mesh.name !== 'brtruss') {
          mesh.scaling.x += TotalWidthScaling;
        }
        if (mesh.name !== 'bltruss' && mesh.name !== 'brtruss' && mesh.name !== 'groundTile' && mesh.name !== 'container_left_mezzanine' && mesh.name !== 'container_right_mezzanine') {
          mesh.scaling.y += TotalHeightScaling;
          ColorMesh(mesh);
        }
      }
    }
  });
  frontCount = 1;
  var awningHeight = updateAwningHeight(parseFloat(localStorage.getItem("height")), parseFloat(localStorage.getItem("leftAwningPitch")), parseFloat(localStorage.getItem("leftAwningLength")));
  heightArrow = gable.checkHeightChangeLeft(awningHeight, loadedMeshesRef.current, sceneRef.current, parseFloat(localStorage.getItem("leftAwningPitch")))
  prevLeftAwningPitch = parseFloat(localStorage.getItem("leftAwningPitch"));
  var rightAwningHeight = updateAwningHeight(parseFloat(localStorage.getItem("height")), parseFloat(localStorage.getItem("rightAwningPitch")), parseFloat(localStorage.getItem("rightAwningLength")));
  rightHeightArrow = gable.checkHeightChangeRight(rightAwningHeight, loadedMeshesRef.current, sceneRef.current, parseFloat(localStorage.getItem("rightAwningPitch")));
  prevRightAwningPitch = parseFloat(localStorage.getItem("rightAwningPitch"));
  for (var i = 0; i < totalLength - 3; i++) {
    loadedMeshesRef.current = appendToFront(loadedMeshesRef.current, centerBayDimensionsRef, centerBayPositionRef, sceneRef.current)
  }

  loadedMeshesRef.current.forEach((mesh, index) => {
    mesh.forEach((element, elem_index) => {
      if(element.name !== 'groundTile' && element.name !== 'leftAwningGroundTile' && element.name !== 'rightAwningGroundTile'){
        if (element.name === 'container_left_mezzanine' || element.name === 'container_right_mezzanine') {
          if (copy[index][elem_index].isEnabled() == true) {
            element.setEnabled(true);
            console.log("hit true")
          } else {
            element.setEnabled(false);
          }
        }
        element.isVisible = copy[index][elem_index].isVisible;
      }
    })
  })
}
//<========================================= Width Handler ===========================================>//

var prevWidthValue = 5.0;
var widthIntervalId;
var TotalWidthScaling = 0;
var totalRoofUpscaling = 0;
var finalPosition;
var leanToLeftPos = 0;
var leanToRightPos = 0;
var heightarrowleftpos = 0;
var heightarrowrightpos = 0;
var leftHeightAfterWidthTracker = 0;
var depthLeftArrow;
var depthRightArrow;
export function updateMeshesScaling(value, axis, loadedMeshes, scene, text, leftText) {
  if (!heightArrow) {
    heightArrow = getLeftAwningArrow();
  }
  if (!rightHeightArrow) {
    rightHeightArrow = getRightAwningArrow();
  }
  if (!depthLeftArrow) {
    depthLeftArrow = gable.createAwningDepthMeasurementsLeft(parseInt(localStorage.getItem("leftAwningLength")), scene)
  } else {
    depthLeftArrow = gable.createAwningDepthMeasurementsLeft(parseInt(localStorage.getItem("leftAwningLength")), scene)
  }
  if (!depthRightArrow) {
    depthRightArrow = gable.createAwningDepthMeasurementsRight(parseInt(localStorage.getItem("rightAwningLength")), scene)
  } else {
    depthRightArrow = gable.createAwningDepthMeasurementsRight(parseInt(localStorage.getItem("rightAwningLength")), scene)
  }
  function scaleUp() {

    if (prevWidthValue >= value) {
      clearInterval(widthIntervalId);
      return true;
    }
    loadedMeshes.forEach((meshes) => {
      if (Array.isArray(meshes)) {
        const lastIndex = meshes.length - 1;
        meshes.forEach((mesh, index) => {
          if (mesh && mesh.name !== "fGround" && mesh.name !== "bGround" && mesh.name !== 'cantileverLeft' && mesh.name !== 'cantileverRight'
            && mesh.name !== 'Larrow' && mesh.name !== 'fLogo' && mesh.name !== 'container_left' && mesh.name !== 'container_right'
            && mesh.name !== 'leanToLeftRoofs' && mesh.name !== 'leanToLeftWalls' && mesh.name !== 'leantoleftcols' && mesh.name !== 'leantoleftcolfront' && mesh.name !== 'leantoleftcolback'
            && mesh.name !== 'leanToRightRoofs' && mesh.name !== 'leanToRightWalls' && mesh.name !== 'leantorightcols' && mesh.name !== "leantorightcolfront" && mesh.name !== "leantorightcolback"
            && mesh.name !== 'container_left' && mesh.name !== 'container_right' && mesh.name !== 'container_front' && mesh.name !== 'container_back' && mesh.name !== 'leanToLeftPartWall' && mesh.name !== 'leanToLeftTriangle'
            && mesh.name !== 'leanToRightPartWall' && mesh.name !== 'leanToRightTriangle' && mesh.name !== 'leanToRightTriangleBack' && mesh.name !== 'leanToRightPartWallBack'
            && mesh.name !== 'leanToLeftTriangleBack' && mesh.name !== 'leanToLeftPartWallBack' && mesh.name !== 'leanToLeftPurlins' && mesh.name !== 'leanToRightPurlins' && mesh.name !== 'container_left_bracing' && mesh.name !== 'container_right_bracing'
            && mesh.name !== 'col1' && mesh.name !== 'col2' && mesh.name !== 'col3' && mesh.name !== 'col4' && mesh.name !== 'colfront1' && mesh.name !== 'colfront2'
            && mesh.name !== 'colCenter1' && mesh.name !== 'colCenter2' && mesh.name !== 'bltruss' && mesh.name !== 'brtruss' && mesh.name !== 'fltruss' && mesh.name !== 'frtruss' && mesh.name !== 'ltruss' && mesh.name !== 'rtruss'
            && mesh.name !== 'abltruss' && mesh.name !== 'abrtruss' && mesh.name !== 'afltruss' && mesh.name !== 'afrtruss' && mesh.name !== 'altruss' && mesh.name !== 'ratruss' && mesh.name !== 'leftAwningGroundTile' && index < lastIndex) {
            console.log("meshes hit: ", mesh.name)
            mesh.scaling[axis] += 0.02;
          } else if (mesh.name === "groundTile") {
            mesh.scaling[axis] += 0.02;
          }
          if (mesh.name === 'fRoof' || mesh.name === 'topCenter' || mesh.name === 'FTop' || mesh.name === 'BTop' || mesh.name === 'leanToFrontRoof'
            || mesh.name === 'leanToBackRoof' || mesh.name === 'cantileverFront' || mesh.name === 'cantileverBack') {
            // if (totalRoofPositioning > 0) {
            //     if (localStorage.getItem("slab") === "Enable") {            
            //     if (parseInt(localStorage.getItem("slabSize")) > 150) {
            //       mesh.position.y = totalRoofPositioning + 0.4;
            //     } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100) {
            //       mesh.position.y = totalRoofPositioning + 0.2;
            //     } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50) {
            //       mesh.position.y = totalRoofPositioning + 0.1;
            //     } else if (parseInt(localStorage.getItem("slabSize")) < 50) {
            //       mesh.position.y = totalRoofPositioning;
            //     }else{
            //       mesh.position.y = totalRoofPositioning + 0.3;
            //     }
            //       // mesh.position.y = totalRoofPositioning +;
            //     } else {
            //       console.log("total roof positioning: ", totalRoofPositioning)
            //       if(mesh.name === 'fRoof'){
            //         if (localStorage.getItem("slab") === "Enable") {            
            //           if (parseInt(localStorage.getItem("slabSize")) > 150) {
            //             mesh.position.y = 0.4;
            //           } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100) {
            //             mesh.position.y = totalRoofPositioning + 0.2;
            //           } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50) {
            //             mesh.position.y = totalRoofPositioning + 0.1;
            //           } else if (parseInt(localStorage.getItem("slabSize")) < 50) {
            //             mesh.position.y = totalRoofPositioning;
            //           }else{
            //             mesh.position.y = totalRoofPositioning + 0.45;
            //           }
            //         }
            //       }else{
            //         mesh.position.y = totalRoofPositioning ;
            //       } 
            //     }
            // }
            if(mesh.name === 'fRoof'){
              RoofPitchUtility(mesh)
              mesh.scaling.y += 0.01;
            }else{
              mesh.setPivotPoint(new Vector3(0, 2.45, 0));
              mesh.scaling.y += 0.01;
            }
          }
        });
      }
    });
    for (var i = 0; i <= 28; i++) {
      loadedMeshes.forEach((meshes) => {
        meshes.forEach((mesh) => {
          if (mesh.name === 'cantileverLeft' || mesh.name === 'container_left' || mesh.name === 'container_left_bracing'
            || mesh.name === 'bltruss' || mesh.name === 'fltruss' || mesh.name === 'ltruss'
            || mesh.name === 'abltruss' || mesh.name === 'afltruss' || mesh.name === 'altruss' || mesh.name === 'leftAwningGroundTile'
          ) {
            mesh.position.x += 0.02 / 11.5;
          }
          if (mesh.name === 'cantileverRight' || mesh.name === 'container_right' || mesh.name === 'container_right_bracing'
            || mesh.name === 'brtruss' || mesh.name === 'frtruss' || mesh.name === 'rtruss'
            || mesh.name === 'abrtruss' || mesh.name === 'afrtruss' || mesh.name === 'ratruss' || mesh.name === 'rightAwningGroundTile'
          ) {
            mesh.position.x -= 0.02 / 11.5;
          }
          if (mesh.name === "leantoleftcols" || mesh.name === 'leantoleftcolfront' || mesh.name === 'leantoleftcolback') {
            mesh.position.x += 0.02 / 11.5;
          }
          if (mesh.name === "leantorightcols" || mesh.name === "leantorightcolfront" || mesh.name === "leantorightcolback") {
            mesh.position.x -= 0.02 / 11.5;
          }
        });
      });
      if (heightArrow) {
        //sessionStorage.setItem("leftHeightArrowPositionAfterWidth_", 0)
        heightArrow.forEach((mesh) => {
          if (mesh.name === 'container_arrow_left' || mesh.name === 'textContainer') {
            console.log("height arrow found in if: ", mesh.name)
            mesh.position.x += 0.02 / 11.5
            sessionStorage.setItem("leftHeightArrowPositionAfterWidth_", mesh.position.x)
            var newValue = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) - parseFloat(sessionStorage.getItem("leftHeightArrowPosition_"));
            sessionStorage.setItem("leftHeightArrowPositionAfterWidth_", newValue);
          }
          // var newValue = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 0.02/11.5;
          // sessionStorage.setItem("leftHeightArrowPositionAfterWidth_", newValue)
        });
      } else {
        console.log("height arrow found in else: ")
        if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) > 2.7739130434783346) {
          sessionStorage.setItem("leftHeightArrowPositionAfterWidth_", 0);
        } else {
          var newValue = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) + 0.02 / 11.5;
          sessionStorage.setItem("leftHeightArrowPositionAfterWidth_", newValue);
        }
      }
      if (rightHeightArrow) {
        var newValue;
        rightHeightArrow.forEach((mesh) => {
          if (mesh.name === 'container_arrow_right' || mesh.name === 'textContainer') {
            mesh.position.x -= 0.02 / 11.5
            sessionStorage.setItem("rightHeightArrowPositionAfterWidth_", mesh.position.x)
          }
          var newValue = -(parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) - parseFloat(sessionStorage.getItem("rightHeightArrowPosition_")));
          sessionStorage.setItem("rightHeightArrowPositionAfterWidth_", newValue);
        });
      } else {
        if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) > 2.7739130434783346) {
          sessionStorage.setItem("rightHeightArrowPositionAfterWidth_", 0);
        } else {
          var newValue = parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) + 0.02 / 11.5;
          sessionStorage.setItem("rightHeightArrowPositionAfterWidth_", newValue);
        }
        // var newValue = parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) + 0.02/11.5;
        // sessionStorage.setItem("rightHeightArrowPositionAfterWidth_", newValue);
      }
      if (depthLeftArrow) {
        //depthLeftArrow = gable.createAwningDepthMeasurementsLeft(parseInt(localStorage.getItem("leftAwningLength")),scene)
        depthLeftArrow.forEach((mesh) => {
          if (mesh.name === 'container_depth_arrow_left' || mesh.name === 'textContainer') {
            mesh.position.x += 0.02 / 11.5
            sessionStorage.setItem("leftDepthArrowAfterWidth_", mesh.position.x)
          }
        })
      } else {
        var newValue = parseFloat(sessionStorage.getItem("leftDepthArrowAfterWidth_")) + 0.02 / 11.5;
        sessionStorage.setItem("leftDepthArrowAfterWidth_", newValue);
      }
      if (depthRightArrow) {
        //depthRightArrow = gable.createAwningDepthMeasurementsRight(parseInt(localStorage.getItem("rightAwningLength")),scene)
        depthRightArrow.forEach((mesh) => {
          if (mesh.name === 'container_depth_arrow_right' || mesh.name === 'textContainer') {
            mesh.position.x -= 0.02 / 11.5
            sessionStorage.setItem("rightDepthArrowAfterWidth_", mesh.position.x)
          }
        })
      } else {
        var newValue = parseFloat(sessionStorage.getItem("rightDepthArrowAfterWidth_")) + 0.02 / 11.5;
        sessionStorage.setItem("rightDepthArrowAfterWidth_", newValue);
      }
      //positioning calculation for leanTo frames
      leanToLeftPos += 0.02 / 11.5;
      leanToRightPos -= 0.02 / 11.5;
      //positioning for left measurement arrows.
      loadedMeshes[1][21].position.x += 0.02 / 10.5;
      loadedMeshes[0][21].position.x += 0.02 / 10.5;
      leftText.forEach((text) => {
        text.position.x += 0.02 / 10.5
      })
      //loadedMeshes[1][23].position.x += 0.02 / 10.5;
      //loadedMeshes[1][24].position.x -= 0.02 / 10.5;
      heightarrowleftpos += 0.02 / 10.5;
      heightarrowrightpos -= 0.02 / 10.5;
      //positioning for left and right text
      text[0].position.x += 0.02 / 10.5;
      text[1].position.x -= 0.02 / 10.5;
      text[2].position.x += 0.02 / 10.5;
      text[3].position.x -= 0.02 / 10.5;
      for (var j = 2; j <= loadedMeshes.length - 1; j++) {
        loadedMeshes[j][16].position.x += 0.02 / 10.5;
      }
    }
    // for (var i = 2; i <= loadedMeshes.length; i++){
    //  loadedMeshes[i][1].position.x += position 
    // }
    finalPosition = loadedMeshes[2][16].position.x;
    // sessionStorage.setItem("ArrowPosition_",(finalPosition + 2));
    gable.updateLeftArrowPosition(finalPosition);
    TotalWidthScaling += 0.02;
    prevWidthValue += 1;
    totalRoofUpscaling += 0.01;
  }

  function scaleDown() {
    if (prevWidthValue <= value) {
      if (widthIntervalId)
        clearInterval(widthIntervalId);
      return true;
    }
    loadedMeshes.forEach((meshes) => {
      if (Array.isArray(meshes)) {
        const lastIndex = meshes.length - 1;
        meshes.forEach((mesh, index) => {
          if (mesh && mesh.name !== "fGround" && mesh.name !== "bGround" && mesh.name !== 'cantileverLeft' && mesh.name !== 'cantileverRight'
            && mesh.name !== 'Larrow' && mesh.name !== 'fLogo' && mesh.name !== 'container_left' && mesh.name !== 'container_right' && mesh.name !== 'container_front'
            && mesh.name !== 'container_back' && mesh.name !== 'leanToLeftRoofs' && mesh.name !== 'leanToLeftWalls' && mesh.name !== 'leantoleftcols' && mesh.name !== 'leantoleftcolfront' && mesh.name !== 'leantoleftcolback'
            && mesh.name !== 'leanToRightRoofs' && mesh.name !== 'leanToRightWalls' && mesh.name !== 'leantorightcols' && mesh.name !== "leantorightcolfront" && mesh.name !== "leantorightcolback"
            && mesh.name !== 'leanToLeftPartWall' && mesh.name !== 'leanToLeftTriangle' && mesh.name !== 'leanToLeftPurlins' && mesh.name !== 'leanToRightPurlins'
            && mesh.name !== 'leanToRightPartWall' && mesh.name !== 'leanToRightTriangle' && mesh.name !== 'leanToRightTriangleBack' && mesh.name !== 'leanToRightPartWallBack'
            && mesh.name !== 'leanToLeftTriangleBack' && mesh.name !== 'leanToLeftPartWallBack' && mesh.name !== 'container_left_bracing' && mesh.name !== 'container_right_bracing'
            && mesh.name !== 'col1' && mesh.name !== 'col2' && mesh.name !== 'col3' && mesh.name !== 'col4' && mesh.name !== 'colfront1' && mesh.name !== 'colfront2'
            && mesh.name !== 'colCenter1' && mesh.name !== 'colCenter2' && mesh.name !== 'bltruss' && mesh.name !== 'brtruss' && mesh.name !== 'fltruss' && mesh.name !== 'frtruss' && mesh.name !== 'ltruss' && mesh.name !== 'rtruss'
            && mesh.name !== 'abltruss' && mesh.name !== 'abrtruss' && mesh.name !== 'afltruss' && mesh.name !== 'afrtruss' && mesh.name !== 'altruss' && mesh.name !== 'ratruss' && mesh.name !== 'leftAwningGroundTile' && index < lastIndex) {

            mesh.scaling[axis] -= 0.02;
          } else if (mesh.name === "groundTile") {
            mesh.scaling[axis] -= 0.02;
          }
          if (mesh.name === 'fRoof' || mesh.name === 'topCenter' || mesh.name === 'FTop' || mesh.name === 'BTop' || mesh.name === 'leanToFrontRoof'
            || mesh.name === 'leanToBackRoof' || mesh.name === 'cantileverFront' || mesh.name === 'cantileverBack') {
            // if (totalRoofPositioning > 0) {
            //   if (localStorage.getItem("slab") === "Enable") {            
            //     if (parseInt(localStorage.getItem("slabSize")) > 150) {
            //       mesh.position.y = totalRoofPositioning + 0.35;
            //     } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100) {
            //       mesh.position.y = totalRoofPositioning + 0.2;
            //     } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50) {
            //       mesh.position.y = totalRoofPositioning + 0.1;
            //     } else if (parseInt(localStorage.getItem("slabSize")) < 50) {
            //       mesh.position.y = totalRoofPositioning;
            //     }else{
            //       mesh.position.y = totalRoofPositioning + 0.3;
            //     }
            //   } else {
            //     if(mesh.name === 'fRoof'){
            //       if (localStorage.getItem("slab") === "Enable") {            
            //         if (parseInt(localStorage.getItem("slabSize")) > 150) {
            //           mesh.position.y = totalRoofPositioning + 0.4;
            //         } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100) {
            //           mesh.position.y = totalRoofPositioning + 0.2;
            //         } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50) {
            //           mesh.position.y = totalRoofPositioning + 0.1;
            //         } else if (parseInt(localStorage.getItem("slabSize")) < 50) {
            //           mesh.position.y = totalRoofPositioning;
            //         }else{
            //           mesh.position.y = totalRoofPositioning + 0.45;
            //         }
            //       }
            //     }else{
            //       mesh.position.y = totalRoofPositioning ;
            //     } 
            //   }
            // }
            // if(mesh.name === 'fRoof'){
            //   if (localStorage.getItem("slab") === "Enable"){ 
            //     if (parseInt(localStorage.getItem("slabSize")) > 150) {
            //       mesh.setPivotPoint(new Vector3(0, 2.35, 0));
            //       mesh.position.y = totalRoofPositioning + 0.48;
            //     } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100) {
            //       mesh.setPivotPoint(new Vector3(0, 2.35, 0));
            //       mesh.position.y = totalRoofPositioning + 0.47;
            //     } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50) {
            //       mesh.setPivotPoint(new Vector3(0, 2.35, 0));
            //       mesh.position.y = totalRoofPositioning + 0.46;
            //     } else if (parseInt(localStorage.getItem("slabSize")) < 50) {
            //       mesh.setPivotPoint(new Vector3(0, 2.00, 0));
            //       mesh.position.y = totalRoofPositioning + 0.45;
            //     }else{
            //       mesh.position.y = totalRoofPositioning + 0.45;
            //     } 
            //     mesh.scaling.y -= 0.01;
            //   }else{
            //     mesh.setPivotPoint(new Vector3(0, 2.00, 0));
            //     mesh.scaling.y -= 0.01;
            //   }
            // }else{
            //   mesh.setPivotPoint(new Vector3(0, 2.45, 0));
            //   mesh.scaling.y -= 0.01;
            // }
            if(mesh.name === 'fRoof'){
              RoofPitchUtility(mesh)
              mesh.scaling.y -= 0.01;
            }else{
              mesh.setPivotPoint(new Vector3(0, 2.45, 0));
              mesh.scaling.y -= 0.01;
            }
          }
        });
      }
    });
    //var leftHeightAfterWidthTracker = 0;
    for (var i = 0; i <= 28; i++) {
      loadedMeshes.forEach((meshes) => {
        meshes.forEach((mesh) => {
          if (mesh.name === 'cantileverLeft' || mesh.name === 'container_left' || mesh.name === 'container_left_bracing'
            || mesh.name === 'bltruss' || mesh.name === 'fltruss' || mesh.name === 'ltruss' || mesh.name === 'abltruss' 
            || mesh.name === 'afltruss' || mesh.name === 'altruss' || mesh.name === 'leftAwningGroundTile'
          ) {
            mesh.position.x -= 0.02 / 11.5;
          }
          if (mesh.name === 'cantileverRight' || mesh.name === 'container_right' || mesh.name === 'container_right_bracing'
            || mesh.name === 'brtruss' || mesh.name === 'frtruss' || mesh.name === 'rtruss' || mesh.name === 'abrtruss' 
            || mesh.name === 'afrtruss' || mesh.name === 'ratruss' || mesh.name === 'rightAwningGroundTile'
          ) {
            mesh.position.x += 0.02 / 11.5;
          }
          if (mesh.name === "leantoleftcols" || mesh.name === 'leantoleftcolfront' || mesh.name === 'leantoleftcolback') {
            mesh.position.x -= 0.02 / 11.5;
          }
          if (mesh.name === "leantorightcols" || mesh.name === "leantorightcolfront" || mesh.name === "leantorightcolback") {
            mesh.position.x += 0.02 / 11.5;
          }
        });
      });
      if (heightArrow) {
        heightArrow.forEach((mesh) => {
          if (mesh.name === 'container_arrow_left' || mesh.name === 'textContainer') {
            mesh.position.x -= 0.02 / 11.5
            sessionStorage.setItem("leftHeightArrowPositionAfterWidth_", mesh.position.x)
            var newValue = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) - parseFloat(sessionStorage.getItem("leftHeightArrowPosition_"));
            sessionStorage.setItem("leftHeightArrowPositionAfterWidth_", newValue);
          }
        });
      } else {
        var newValue = parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) - 0.02 / 11.5;
        sessionStorage.setItem("leftHeightArrowPositionAfterWidth_", newValue);
      }
      if (rightHeightArrow) {
        rightHeightArrow.forEach((mesh) => {
          if (mesh.name === 'container_arrow_right' || mesh.name === 'textContainer') {
            mesh.position.x += 0.02 / 11.5
            sessionStorage.setItem("rightHeightArrowPositionAfterWidth_", mesh.position.x)
          }
          var newValue = -(parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) - parseFloat(sessionStorage.getItem("rightHeightArrowPosition_")));
          sessionStorage.setItem("rightHeightArrowPositionAfterWidth_", newValue);
        });
      } else {
        var newValue = parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) - 0.02 / 11.5;
        sessionStorage.setItem("rightHeightArrowPositionAfterWidth_", newValue);
      }
      if (depthLeftArrow) {
        depthLeftArrow.forEach((mesh) => {
          if (mesh.name === 'container_depth_arrow_left' || mesh.name === 'textContainer') {
            mesh.position.x -= 0.02 / 11.5
            sessionStorage.setItem("leftDepthArrowAfterWidth_", mesh.position.x)
          }
        })
        //depthLeftArrow = null;
      } else {
        var newValue = parseFloat(sessionStorage.getItem("leftDepthArrowAfterWidth_")) - 0.02 / 11.5;
        sessionStorage.setItem("leftDepthArrowAfterWidth_", newValue);
      }
      if (depthRightArrow) {
        depthRightArrow.forEach((mesh) => {
          if (mesh.name === 'container_depth_arrow_right' || mesh.name === 'textContainer') {
            mesh.position.x += 0.02 / 11.5
            sessionStorage.setItem("rightDepthArrowAfterWidth_", mesh.position.x)
          }
        })
        //depthRightArrow = null;
      } else {
        var newValue = parseFloat(sessionStorage.getItem("rightDepthArrowAfterWidth_")) - 0.02 / 11.5;
        sessionStorage.setItem("rightDepthArrowAfterWidth_", newValue);
      }
      leanToLeftPos -= 0.02 / 11.5;
      leanToRightPos += 0.02 / 11.5;
      loadedMeshes[1][21].position.x -= 0.02 / 10.5;
      loadedMeshes[0][21].position.x -= 0.02 / 10.5;
      leftText.forEach((text) => {
        text.position.x -= 0.02 / 10.5
      })
      loadedMeshes[1][23].position.x -= 0.02 / 10.5;
      loadedMeshes[1][24].position.x += 0.02 / 10.5;
      heightarrowleftpos -= 0.02 / 10.5;
      heightarrowrightpos += 0.02 / 10.5;
      text[0].position.x -= 0.02 / 10.5;
      text[1].position.x += 0.02 / 10.5;
      text[2].position.x -= 0.02 / 10.5;
      text[3].position.x += 0.02 / 10.5;
      for (var j = 2; j <= loadedMeshes.length - 1; j++) {
        loadedMeshes[j][16].position.x -= 0.02 / 10.5;
      }
    }
    finalPosition = loadedMeshes[2][16].position.x;
    gable.updateLeftArrowPosition(finalPosition);
    TotalWidthScaling -= 0.02;
    prevWidthValue -= 1;
    totalRoofUpscaling -= 0.01;
  }

  if (value > prevWidthValue) {
    widthIntervalId = setInterval(scaleUp, 25);
  } else if (value < prevWidthValue) {
    widthIntervalId = setInterval(scaleDown, 25);
  }
}

//<========================================= Height Handler ===========================================>//

var prevHeightValue = 5.0;
var heightIntervalId;
var TotalHeightScaling = 0;
var totalRoofPositioning = 0;
var heightArrow;
var rightHeightArrow;
var totalAwningTrussHeight = 0;
export function updateMeshesHeightScaling(value, axis, loadedMeshes) {
  if (!heightArrow) {
    heightArrow = getLeftAwningArrow();
  }else{
    heightArrow = getLeftAwningArrow();
  }
  if (!rightHeightArrow) {
    rightHeightArrow = getRightAwningArrow();
  }else{
    heightArrow = getLeftAwningArrow();
  }
  var awningHeight = updateAwningHeight(parseFloat(localStorage.getItem("height")), parseFloat(localStorage.getItem("leftAwningPitch")), parseFloat(localStorage.getItem("leftAwningLength")));
  var awningHeightRight = updateAwningHeight(parseFloat(localStorage.getItem("height")), parseFloat(localStorage.getItem("rightAwningPitch")), parseFloat(localStorage.getItem("rightAwningLength")));
  function scaleUp() {
    if (heightArrow) {
      heightArrow.forEach((mesh) => {
        if (mesh.name === 'container_arrow_left') {
          mesh.scaling[axis] += 0.1
        }
        if (mesh.name === 'textContainer') {
          mesh.position[axis] += 0.1
        }
        if (mesh.name === 'textrect') {
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
      console.log("not found bruhhhhhhh")
    }
    if (rightHeightArrow) {
      rightHeightArrow.forEach((mesh) => {
        if (mesh.name === 'container_arrow_right') {
          mesh.scaling[axis] += 0.1
        }
        if (mesh.name === 'textContainer') {
          mesh.position[axis] += 0.1
        }
        if (mesh.name === 'textrect') {
          // Create and set the dynamic texture
          var materialRect = new StandardMaterial("Material", sceneRef.current);
          var textureRect = new DynamicTexture("new rect", { width: 512, height: 256 }, sceneRef.current, false, Texture.TRILINEAR_SAMPLINGMODE);
          var textureContext = textureRect.getContext();
          textureContext.clearRect(0, 0, textureRect.getSize().width, textureRect.getSize().height);
          var font = "bold 200px monospace";
          textureRect.drawText(awningHeightRight, 50, 170, font, "white", "transparent");
          textureRect.hasAlpha = true;
          materialRect.emissiveTexture = textureRect;
          materialRect.diffuseColor = new Color3(1, 1, 1);
          materialRect.opacityTexture = textureRect;
          materialRect.backFaceCulling = false;
          mesh.material = materialRect;
        }
      })
    }else{
      console.log("not found bruhhhhhhh")
    }
    loadedMeshes.forEach((meshes) => {
      if (meshes) {
        meshes.forEach((mesh) => {
          if (mesh) {
            if (mesh.name === 'arrow' || mesh.name === 'Larrow' || mesh.name === 'Barrow' || mesh.name === 'fLogo') {
            }
            else if (mesh.name === 'fRoof' || mesh.name === ' topCenter' || mesh.name === 'FTop' || mesh.name === 'BTop' || mesh.name === 'leanToFrontRoof' || mesh.name === 'leanToBackRoof'
              || mesh.name === 'bltruss' || mesh.name === 'brtruss' || mesh.name === 'fltruss' || mesh.name === 'frtruss' || mesh.name === 'ltruss' || mesh.name === 'rtruss'
              || mesh.name === 'abltruss' || mesh.name === 'abrtruss' || mesh.name === 'afltruss' || mesh.name === 'afrtruss' || mesh.name === 'altruss' || mesh.name === 'ratruss'
            ) {
              if (totalRoofUpscaling > 0) {
                if(mesh.name === 'abltruss' || mesh.name === 'abrtruss' || mesh.name === 'afltruss' || mesh.name === 'afrtruss' || mesh.name === 'altruss' || mesh.name === 'ratruss'){
                  mesh.position.y += 0.18;
                }else{
                  mesh.position.y += 0.24;
                }
              } else {
                //mesh.setPivotPoint(new Vector3(0, 0, 0));
                if(mesh.name === 'abltruss' || mesh.name === 'abrtruss' || mesh.name === 'afltruss' || mesh.name === 'afrtruss' || mesh.name === 'altruss' || mesh.name === 'ratruss'){
                  mesh.position.y += 0.18;
                }else{
                  mesh.position.y += 0.24;
                }
              }
            }
            else if (mesh.name !== 'leanToLeftRoofs'
              && mesh.name !== 'leanToRightRoofs'
              && mesh.name !== 'leanToLeftPartWall' && mesh.name !== 'leanToLeftTriangle'
              && mesh.name !== 'leanToRightPartWall' && mesh.name !== 'leanToRightTriangle' && mesh.name !== 'leanToRightTriangleBack' && mesh.name !== 'leanToRightPartWallBack'
              && mesh.name !== 'leanToLeftTriangleBack' && mesh.name !== 'leanToLeftPartWallBack' && mesh.name !== 'leanToFrontRoof' && mesh.name !== 'container_front' && mesh.name !== 'container_back' && mesh.name !== 'container_right_mezzanine' && mesh.name !== 'container_left_mezzanine'
              && mesh.name !== 'col1' && mesh.name !== 'col2' && mesh.name !== 'col3' && mesh.name !== 'col4' && mesh.name !== 'colfront1' && mesh.name !== 'colfront2'
              && mesh.name !== 'colCenter1' && mesh.name !== 'colCenter2' && mesh.name !== 'bltruss' && mesh.name !== 'brtruss' && mesh.name !== 'fltruss' && mesh.name !== 'frtruss' && mesh.name !== 'ltruss' && mesh.name !== 'rtruss'
              && mesh.name !== 'abltruss' && mesh.name !== 'abrtruss' && mesh.name !== 'afltruss' && mesh.name !== 'afrtruss' && mesh.name !== 'altruss' && mesh.name !== 'ratruss' && mesh.name !== 'groundTile' && mesh.name !== 'leftAwningGroundTile'
              && mesh.name !== 'rightAwningGroundTile' && mesh.name !== 'leanToLeftPurlins' && mesh.name !== 'leanToRightPurlins') {
              if (mesh.name === "leanToLeftWalls" || mesh.name === "leanToRightWalls") {
                // mesh.scaling[axis] += 0.1
              } else {
                // console.log("meshes hit: ", mesh.name)
                mesh.scaling[axis] += 0.1;
              }
            }
          }
        });
      }
    });
    TotalHeightScaling += 0.1;
    prevHeightValue += 1;
    totalRoofPositioning += 0.24;
    totalAwningTrussHeight += 0.18
    if (prevHeightValue >= value) {
      clearInterval(heightIntervalId);
      return true;
    }
  }

  function scaleDown() {
    if (heightArrow) {
      heightArrow.forEach((mesh) => {
        if (mesh.name === 'container_arrow_left') {
          mesh.scaling[axis] -= 0.1
        }
        if (mesh.name === 'textContainer') {
          mesh.position[axis] -= 0.1
        }
        if (mesh.name === 'textrect') {
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
    if (rightHeightArrow) {
      rightHeightArrow.forEach((mesh) => {
        if (mesh.name === 'container_arrow_right') {
          mesh.scaling[axis] -= 0.1
        }
        if (mesh.name === 'textContainer') {
          mesh.position[axis] -= 0.1
        }
        if (mesh.name === 'textrect') {
          // Create and set the dynamic texture
          var materialRect = new StandardMaterial("Material", sceneRef.current);
          var textureRect = new DynamicTexture("new rect", { width: 512, height: 256 }, sceneRef.current, false, Texture.TRILINEAR_SAMPLINGMODE);
          var textureContext = textureRect.getContext();
          textureContext.clearRect(0, 0, textureRect.getSize().width, textureRect.getSize().height);
          var font = "bold 200px monospace";
          textureRect.drawText(awningHeightRight, 50, 170, font, "white", "transparent");
          textureRect.hasAlpha = true;
          materialRect.emissiveTexture = textureRect;
          materialRect.diffuseColor = new Color3(1, 1, 1);
          materialRect.opacityTexture = textureRect;
          materialRect.backFaceCulling = false;
          mesh.material = materialRect;
        }
      })
    }
    loadedMeshes.forEach((meshes) => {
      if (meshes) {
        meshes.forEach((mesh) => {
          if (mesh) {
            if (mesh.name == 'arrow' || mesh.name == 'Larrow' || mesh.name === 'Barrow' || mesh.name === 'fLogo') {
            }
            else if (mesh.name === 'fRoof' || mesh.name === ' topCenter' || mesh.name === 'FTop' || mesh.name === 'BTop' || mesh.name === 'leanToFrontRoof' || mesh.name === 'leanToBackRoof'
              || mesh.name === 'bltruss' || mesh.name === 'brtruss' || mesh.name === 'fltruss' || mesh.name === 'frtruss' || mesh.name === 'ltruss' || mesh.name === 'rtruss'
              || mesh.name === 'abltruss' || mesh.name === 'abrtruss' || mesh.name === 'afltruss' || mesh.name === 'afrtruss' || mesh.name === 'altruss' || mesh.name === 'ratruss'
            ) {
              if (totalRoofUpscaling > 0) {
                if(mesh.name === 'abltruss' || mesh.name === 'abrtruss' || mesh.name === 'afltruss' || mesh.name === 'afrtruss' || mesh.name === 'altruss' || mesh.name === 'ratruss'){
                  mesh.position.y -= 0.20;
                }else{
                  mesh.position.y -= 0.24;
                }
              } else {
                if(mesh.name === 'abltruss' || mesh.name === 'abrtruss' || mesh.name === 'afltruss' || mesh.name === 'afrtruss' || mesh.name === 'altruss' || mesh.name === 'ratruss'){
                  mesh.position.y -= 0.20;
                }else{
                  mesh.position.y -= 0.24;
                }
              }
            }
            else if (mesh.name !== 'leanToLeftRoofs'
              && mesh.name !== 'leanToRightRoofs'
              && mesh.name !== 'leanToLeftPartWall' && mesh.name !== 'leanToLeftTriangle'
              && mesh.name !== 'leanToRightPartWall' && mesh.name !== 'leanToRightTriangle' && mesh.name !== 'leanToRightTriangleBack' && mesh.name !== 'leanToRightPartWallBack'
              && mesh.name !== 'leanToLeftTriangleBack' && mesh.name !== 'leanToLeftPartWallBack' && mesh.name !== 'leanToFrontRoof' && mesh.name !== 'container_front' && mesh.name !== 'container_back' && mesh.name !== 'container_right_mezzanine' && mesh.name !== 'container_left_mezzanine'
              && mesh.name !== 'col1' && mesh.name !== 'col2' && mesh.name !== 'col3' && mesh.name !== 'col4' && mesh.name !== 'colfront1' && mesh.name !== 'colfront2'
              && mesh.name !== 'colCenter1' && mesh.name !== 'colCenter2' && mesh.name !== 'bltruss' && mesh.name !== 'brtruss' && mesh.name !== 'fltruss' && mesh.name !== 'frtruss' && mesh.name !== 'ltruss' && mesh.name !== 'rtruss'
              && mesh.name !== 'abltruss' && mesh.name !== 'abrtruss' && mesh.name !== 'afltruss' && mesh.name !== 'afrtruss' && mesh.name !== 'altruss' && mesh.name !== 'ratruss' && mesh.name !== 'groundTile' && mesh.name !== 'leftAwningGroundTile'
              && mesh.name !== 'rightAwningGroundTile' && mesh.name !== 'leanToLeftPurlins' && mesh.name !== 'leanToRightPurlins') {
              if (mesh.name === "leanToLeftWalls" || mesh.name === "leanToRightWalls") {
                // mesh.scaling[axis] -= 0.1
              } else {
                mesh.scaling[axis] -= 0.1;
              }
            }
          }
        });
      }
    });
    prevHeightValue -= 1;
    TotalHeightScaling -= 0.1;
    totalRoofPositioning -= 0.24;
    totalAwningTrussHeight -= 0.20;
    if (prevHeightValue <= value) {
      clearInterval(heightIntervalId);
      return true;
    }
  }

  if (value > prevHeightValue) {
    heightIntervalId = setInterval(scaleUp, 50);
  } else if (value < prevHeightValue) {
    heightIntervalId = setInterval(scaleDown, 50);
  }
}

//<========================================= Length Handler ===========================================>//

//variable to keep track of front side
var bayQuantityDynamic = 30;
var maxLength = 300;
let frontCount = 1;
export function appendToFront(loadedMeshes, centerBayDimensions, centerBayPosition, scene) {
  var isLeftAwning = localStorage.getItem('leftAwning');
  var isLeftCantilever = localStorage.getItem('leftCantilever');
  getAllChecksForEnablingShedTrusses(loadedMeshes);
  if(localStorage.getItem('leftAwning') == 'true' || localStorage.getItem('rightAwning') == 'true'){
    getAllChecksForEnablingAwningTrusses(loadedMeshes);
  }
  var copy = [...loadedMeshes[1]]
  if (loadedMeshes) {
    if (loadedMeshes.length < bayQuantityDynamic) {
      loadedMeshes[1].forEach((meshes) => {
        if (meshes) {
          meshes.dispose();
        }
      });
      loadedMeshes[1] = gable.createFrontBay(5.1, frontCount, scene, degree, 10);
      var newCenterBayMeshes = gable.createCenterBay(centerBayDimensions, centerBayPosition, -(frontCount - 1), scene, degree, 10);
      //apply scaling to newly created center mesh
      newCenterBayMeshes.forEach((mesh) => {
        if (mesh) {
          if (mesh.name == 'Larrow') {
            // if(finalPosition){
            //   mesh.position.x = finalPosition;
            //   if(isLeftAwning === 'true' || isLeftCantilever === 'true'){
            //     mesh.position.x += 2.5;
            //     mesh.position.x = loadedMeshes[0][21].position.x;
            //   }
            //   if(larrowPos != 0){
            //     // mesh.position.x = larrowPos;
            //     // mesh.position.x = loadedMeshes[0][21].position.x;
            //   }
            //   if(lTextPos != 0){
            //     leftText.current.forEach((mesh) => {
            //       mesh.position.x = lTextPos;
            //     })
            //   }
            //   ColorMesh(mesh);
            // } else{
            //   if(isLeftAwning === 'true' || isLeftCantilever === 'true'){
            //     mesh.position.x += 2.5;
            //     mesh.position.x = loadedMeshes[0][21].position.x;
            //   }
            //   if(larrowPos != 0){
            //     mesh.position.x = larrowPos;
            //   }
            //   if(lTextPos != 0){
            //     leftText.current.forEach((mesh) => {
            //       mesh.position.x = lTextPos;
            //     })
            //   }
            // }
          } else if (mesh.name === 'fRoof' || mesh.name === ' topCenter' || mesh.name === 'FTop' || mesh.name === 'BTop' || mesh.name === 'rtruss' || mesh.name === 'ltruss') {
            if (mesh.name === 'rtruss' || mesh.name === 'ltruss') {
              mesh.position.y += totalRoofPositioning;
              if (mesh.name === 'rtruss') {
                if (leanToRightPos < 0) {
                  console.log("mesh: ", mesh.name)
                  mesh.position.x += leanToRightPos;

                }
              } else {
                if (leanToLeftPos > 0) {
                  mesh.position.x += leanToLeftPos;
                }
              }
            } else {
              mesh.scaling.x += TotalWidthScaling;
              if(mesh.name === 'fRoof'){
                RoofPitchUtility(mesh)
                mesh.scaling.y += totalRoofUpscaling;
                const children = mesh.getChildMeshes(); // Gets all child meshes of the container
                children.forEach(child => {
                    if (child.material) {
                        ColorMesh(child)
                    }
                });
              }else{
                mesh.setPivotPoint(new Vector3(0, 2.45, 0));
                mesh.scaling.y += totalRoofUpscaling;
              }
            if(TotalHeightScaling != 0){
              //mesh.setPivotPoint(new Vector3(0, 0, 0));
              if(mesh.name === 'fRoof' || mesh.name === 'leanToFrontRoof') {
                console.log("mesh position y = ", mesh.position.y, " totoa pos y: ", totalRoofPositioning)
                mesh.position.y += totalRoofPositioning;
                console.log("after: pos: ", mesh.position.y)
              }else if(mesh.name === 'FTop' || mesh.name === 'BTop'){
                if(localStorage.getItem('slab') !== 'Disable'){
                  if(parseInt(localStorage.getItem('slabSize')) < 50){
                    mesh.position.y = totalRoofPositioning;
                  }else if(parseInt(localStorage.getItem('slabSize')) >= 50 && parseInt(localStorage.getItem('slabSize')) < 100){
                    mesh.position.y = totalRoofPositioning + 0.1;
                  }else if(parseInt(localStorage.getItem('slabSize')) >= 100 && parseInt(localStorage.getItem('slabSize')) < 150){
                    mesh.position.y = totalRoofPositioning + 0.2;
                  }else if(parseInt(localStorage.getItem('slabSize')) >= 150){
                    mesh.position.y = totalRoofPositioning + 0.4;
                  }
                }else{
                  mesh.position.y = totalRoofPositioning;
                }
              }else{
                mesh.position.y = totalRoofPositioning;
              }
            }
            ColorMesh(mesh);
            //keep redundant code.
              //console.log("is ltruss here: ", mesh.name)
              //mesh.scaling.x += TotalWidthScaling;
              // if(mesh.name === 'fRoof'){
              //   if (localStorage.getItem("slab") === "Enable"){ 
              //     if (parseInt(localStorage.getItem("slabSize")) > 150) {
              //       mesh.setPivotPoint(new Vector3(0, 2.35, 0));
              //       mesh.position.y = totalRoofPositioning + 0.48;
              //     } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100) {
              //       mesh.setPivotPoint(new Vector3(0, 2.35, 0));
              //       mesh.position.y = totalRoofPositioning + 0.47;
              //     } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50) {
              //       mesh.setPivotPoint(new Vector3(0, 2.35, 0));
              //       mesh.position.y = totalRoofPositioning + 0.46;
              //     } else if (parseInt(localStorage.getItem("slabSize")) < 50) {
              //       mesh.setPivotPoint(new Vector3(0, 2.00, 0));
              //       mesh.position.y = totalRoofPositioning + 0.45;
              //     }else{
              //       mesh.position.y = totalRoofPositioning + 0.45;
              //     } 
              //   }else{
              //     mesh.setPivotPoint(new Vector3(0, 2.00, 0));
              //   }
              //   mesh.scaling.y += totalRoofUpscaling;
              // }else{
              //   mesh.setPivotPoint(new Vector3(0, 2.45, 0));
              //   mesh.scaling.y += totalRoofUpscaling;
              // }

              //ColorMesh(mesh);
              // if(mesh.name === 'fRoof'){
              //   if (localStorage.getItem("slab") === "Enable"){ 
              //     if (parseInt(localStorage.getItem("slabSize")) > 150) {
              //       mesh.setPivotPoint(new Vector3(0, 2.35, 0));
              //       mesh.position.y = totalRoofPositioning + 0.48;
              //     } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100) {
              //       mesh.setPivotPoint(new Vector3(0, 2.35, 0));
              //       mesh.position.y = totalRoofPositioning + 0.47;
              //     } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50) {
              //       mesh.setPivotPoint(new Vector3(0, 2.35, 0));
              //       mesh.position.y = totalRoofPositioning + 0.46;
              //     } else if (parseInt(localStorage.getItem("slabSize")) < 50) {
              //       mesh.setPivotPoint(new Vector3(0, 2.00, 0));
              //       mesh.position.y = totalRoofPositioning + 0.45;
              //     }else{
              //       mesh.position.y = totalRoofPositioning + 0.45;
              //     } 
              //   }else{
              //     mesh.setPivotPoint(new Vector3(0, 2.00, 0));
              //     mesh.position.y = totalRoofPositioning + 0.45;
              //   }
              //   mesh.scaling.y += totalRoofUpscaling;
              // }else{
              //   mesh.setPivotPoint(new Vector3(0, 2.45, 0));
              //   mesh.scaling.y += totalRoofUpscaling;
              // }
            }
          } else if (mesh.name === 'container_left' || mesh.name === 'cantileverLeft') {
            if (leanToLeftPos > 0) {
              mesh.position.x = leanToLeftPos;
            }
            if (leftscalingFactor != 0) {
              mesh.setPivotPoint(new Vector3(2.5, 0, 0));
              mesh.scaling.x = leftscalingFactor;
            }
            if (TotalHeightScaling != 0) {
              mesh.scaling.y += TotalHeightScaling;
            }
            // if(mesh.name === 'cantileverLeft'){
            //   mesh.position.y = 0;
            // }
          }else if (mesh.name === 'leftAwningGroundTile'){
            if(leanToLeftPos > 0){
              mesh.position.x += leanToLeftPos;
            }
            if (leftscalingFactor != 0) {
              mesh.setPivotPoint(new Vector3(-1.25, 0, 0));
              mesh.scaling.x = leftscalingFactor;
            }
          }else if (mesh.name === 'rightAwningGroundTile'){
            if(leanToRightPos < 0){
              mesh.position.x += leanToRightPos;
            }
            if (rightscalingFactor != 0) {
              mesh.setPivotPoint(new Vector3(1.25, 0, 0));
              mesh.scaling.x = rightscalingFactor;
            }
          }
          else if (mesh.name === 'altruss') {
            if (TotalHeightScaling != 0) {
              mesh.position.y += totalAwningTrussHeight;
            }
            if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
              mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
            }
            else {
              mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
            }
          }
          else if (mesh.name === 'ratruss') {
            if (TotalHeightScaling != 0) {
              mesh.position.y += totalAwningTrussHeight;;
            }
            if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
              mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
            }
            else {
              mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) + (-parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")))
            }
          }
          else if (mesh.name === 'container_right' || mesh.name === 'cantileverRight') {
            if (leanToRightPos < 0) {
              mesh.position.x = leanToRightPos;
            }
            if (rightscalingFactor != 0) {
              mesh.setPivotPoint(new Vector3(-2.5, 0, 0));
              mesh.scaling.x = rightscalingFactor;
            }
            if (TotalHeightScaling != 0) {
              mesh.scaling.y += TotalHeightScaling;
            }
            // if(mesh.name === 'cantileverRight'){
            //   mesh.position.y = 0;
            // }
          } else if (mesh.name === "leantoleftcols" || mesh.name === 'leantoleftcolfront' || mesh.name === 'leantoleftcolback') {
            if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
              mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
            }
            else {
              mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
            }
            mesh.scaling.y += TotalHeightScaling - 0.1;
            // if(parseInt(localStorage.getItem("height")) >=6){
            //   if(parseInt(localStorage.getItem('height')) == 6){
            //       mesh.scaling.y += 0.1;
            //   }else if(parseInt(localStorage.getItem('height')) == 7){
            //       mesh.scaling.y += 0.2;
            //   }else if(parseInt(localStorage.getItem('height')) == 8){
            //       mesh.scaling.y += 0.3;
            //   }else if(parseInt(localStorage.getItem('height')) == 9){
            //       mesh.scaling.y += 0.4;
            //   }else if(parseInt(localStorage.getItem('height')) == 10){
            //       mesh.scaling.y += 0.5;
            //   }
            // }
          } else if (mesh.name === "leantorightcols" || mesh.name === "leantorightcolfront" || mesh.name === "leantorightcolback") {
            if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
              mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
            }
            else {
              mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) + (-parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")))
            }
            mesh.scaling.y += TotalHeightScaling - 0.1;
            // if(parseInt(localStorage.getItem("height")) >=6){
            //   if(parseInt(localStorage.getItem('height')) == 6){
            //       mesh.scaling.y += 0.1;
            //   }else if(parseInt(localStorage.getItem('height')) == 7){
            //       mesh.scaling.y += 0.2;
            //   }else if(parseInt(localStorage.getItem('height')) == 8){
            //       mesh.scaling.y += 0.3;
            //   }else if(parseInt(localStorage.getItem('height')) == 9){
            //       mesh.scaling.y += 0.4;
            //   }else if(parseInt(localStorage.getItem('height')) == 10){
            //       mesh.scaling.y += 0.5;
            //   }
            // }
          } else if (mesh.name !== 'LHarrow' && mesh.name !== 'RHarrow' && mesh.name !== 'leanToLeft' && mesh.name !== 'leanToRight' && mesh.name !== 'cantileverLeft' && mesh.name !== 'cantileverRight'
            && mesh.name !== 'leanToLeftWalls' && mesh.name !== 'leanToLeftRoofs' && mesh.name !== 'leantoleftcols' && mesh.name !== 'leantoleftcolfront' && mesh.name !== 'leantoleftcolback'
            && mesh.name !== 'leanToRightRoofs' && mesh.name !== 'leantorightcols' && mesh.name !== "leantorightcolfront" && mesh.name !== "leantorightcolback" && mesh.name !== 'leanToRightWalls'
            && mesh.name !== 'container_left' && mesh.name !== 'container_right' && mesh.name !== 'leanToLeftPartWall' && mesh.name !== 'leanToLeftTriangle'
            && mesh.name !== 'leanToRightPartWall' && mesh.name !== 'leanToRightTriangle' && mesh.name !== 'col1' && mesh.name !== 'col2' && mesh.name !== 'col3' && mesh.name !== 'col4' && mesh.name !== 'colfront1' && mesh.name !== 'colfront2'
            && mesh.name !== 'colCenter1' && mesh.name !== 'colCenter2' && mesh.name !== 'bltruss' && mesh.name !== 'brtruss' && mesh.name !== 'fltruss' && mesh.name !== 'frtruss' && mesh.name !== 'ltruss' && mesh.name !== 'rtruss'
          ) {
            console.log("meshes hit: ", mesh.name)
            mesh.scaling.x += TotalWidthScaling;
            if(mesh.name !== 'container_right_mezzanine' && mesh.name !== 'container_left_mezzanine' && mesh.name !== 'groundTile'){
              mesh.scaling.y += TotalHeightScaling;
            }
            ColorMesh(mesh);
          }
        }
        if(mesh.name === 'leanToLeft' || mesh.name === 'cantileverLeft' || mesh.name === 'leanToLeftWalls' || mesh.name === 'leanToLeftRoofs' || mesh.name === 'leantoleftcols'
          || mesh.name === 'leanToRight' || mesh.name === 'cantileverRight' || mesh.name === 'leanToRightWalls' || mesh.name === 'leanToRightRoofs' || mesh.name === 'leantorightcols' 
        ){
          ColorMesh(mesh);
        }
      });
      // Add the new meshes to the container
      loadedMeshes = loadedMeshes.concat([newCenterBayMeshes]);
      // Apply scaling to front mesh
      if (loadedMeshes.length > 1 && loadedMeshes[1]) {
        loadedMeshes[1].forEach((mesh, index) => {
          if (mesh) {
            if (mesh.name == 'Larrow') {
              // if(finalPosition){
              //   mesh.position.x = finalPosition;
              //   if(isLeftAwning === 'true' || isLeftCantilever === 'true'){
              //     // mesh.position.x += 2.5;
              //     mesh.position.x = loadedMeshes[0][21].position.x;
              //   }
              //   if(larrowPos != 0){
              //     // mesh.position.x = larrowPos;
              //   }
              //   ColorMesh(mesh);
              // }else{
              //   if(isLeftAwning === 'true' || isLeftCantilever === 'true'){
              //     // mesh.position.x += 2.5;

              //     mesh.position.x = loadedMeshes[0][21].position.x;
              //   }
              //   if(larrowPos != 0){
              //     mesh.position.x = larrowPos;
              //   }
              //   if(lTextPos != 0){
              //     leftText.current.forEach((mesh) => {
              //       mesh.position.x = lTextPos;
              //     })
              //   }
              // }
            }
            else if (mesh.name == 'fGround' || mesh.name === 'fLogo') {
              if (parseFloat(localStorage.getItem("frontAwningLength")) < 7) {
                mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 0.6;
              } else if (parseFloat(localStorage.getItem("frontAwningLength")) < 11) {
                mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 2;
              } else if (parseFloat(localStorage.getItem("frontAwningLength")) < 13) {
                mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 4;
              } else {
                mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 5;


              }
            }
            else if (mesh.name === 'container_front' || mesh.name === 'cantileverFront') {
              if (frontscalingFactor != 0) {
                mesh.setPivotPoint(new Vector3(-1.2, 0, 0));
                mesh.scaling.z += frontscalingFactor;
              }
            }
            else if (mesh.name === 'container_left' || mesh.name === 'cantileverLeft') {
              if (leanToLeftPos > 0) {
                mesh.position.x = leanToLeftPos;
              }
              if (leftscalingFactor != 0) {
                mesh.setPivotPoint(new Vector3(2.5, 0, 0));
                mesh.scaling.x = leftscalingFactor;
              }
              if (TotalHeightScaling != 0) {
                mesh.scaling.y += TotalHeightScaling;
              }
              // if(mesh.name === 'cantileverLeft'){
              //   mesh.position.y = 0;
              // }
            }else if (mesh.name === 'leftAwningGroundTile'){
              if(leanToLeftPos > 0){
                mesh.position.x += leanToLeftPos;
              }
              if (leftscalingFactor != 0) {
                mesh.setPivotPoint(new Vector3(-1.25, 0, 0));
                mesh.scaling.x = leftscalingFactor;
              }
            }else if (mesh.name === 'rightAwningGroundTile'){
              if(leanToRightPos < 0){
                mesh.position.x += leanToRightPos;
              }
              if (rightscalingFactor != 0) {
                mesh.setPivotPoint(new Vector3(1.25, 0, 0));
                mesh.scaling.x = rightscalingFactor;
              }
            }
            else if (mesh.name === 'afltruss') {
              if (TotalHeightScaling != 0) {
                mesh.position.y += totalAwningTrussHeight;
              }
                // if (leanToLeftPos > 0) {
                //   mesh.position.x += leanToLeftPos;
                // }
              if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
              }
              else {
                mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
              }
            }
            else if (mesh.name === 'afrtruss') {
              if (TotalHeightScaling != 0) {
                mesh.position.y += totalAwningTrussHeight;
              }
              if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
              }
              else {
                mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) + (-parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")))
              }
            }
            else if (mesh.name === 'container_right' || mesh.name === 'cantileverRight') {
              if (leanToRightPos < 0) {
                mesh.position.x = leanToRightPos;
              }
              if (rightscalingFactor != 0) {
                mesh.setPivotPoint(new Vector3(-2.5, 0, 0));
                mesh.scaling.x = rightscalingFactor;
              }
              if (TotalHeightScaling != 0) {
                mesh.scaling.y += TotalHeightScaling;
              }
              // if(mesh.name === 'cantileverRight'){
              //   mesh.position.y = 0;
              // }
            }
            else if (mesh.name === 'fRoof' || mesh.name === ' topCenter' || mesh.name === 'FTop' || mesh.name === 'BTop' || mesh.name === 'leanToFrontRoof' || mesh.name === 'frtruss' || mesh.name === 'fltruss' || mesh.name === 'container_left_bracing' || mesh.name === 'container_right_bracing') {
              if (mesh.name === 'frtruss' || mesh.name === 'fltruss' || mesh.name === 'container_left_bracing' || mesh.name === 'container_right_bracing') {
                if (mesh.name === 'container_left_bracing' || mesh.name === 'container_right_bracing') {
                  if (TotalHeightScaling != 0) {
                    mesh.scaling.y += TotalHeightScaling;
                  }
                  if (mesh.name === 'container_right_bracing') {
                    if (leanToRightPos < 0) {
                      mesh.position.x += leanToRightPos;
                    }
                  } else {
                    if (leanToLeftPos > 0) {
                      mesh.position.x += leanToLeftPos;
                    }
                  }
                } else {
                  if (TotalHeightScaling != 0) {
                    mesh.position.y += totalRoofPositioning;
                  }
                  if (mesh.name === 'frtruss') {
                    if (leanToRightPos < 0) {
                      mesh.position.x += leanToRightPos;
                    }
                  } else {
                    if (leanToLeftPos > 0) {
                      mesh.position.x += leanToLeftPos;
                    }
                  }
                }
              } else {
                //console.log("all here: ", mesh.name)
                // mesh.scaling.x += TotalWidthScaling;
                // if(mesh.name === 'fRoof'){
                //   mesh.setPivotPoint(new Vector3(0, 2.40, 0));
                //   mesh.scaling.y += totalRoofUpscaling;
                // }else{
                //   mesh.setPivotPoint(new Vector3(0, 2.45, 0));
                //   mesh.scaling.y += totalRoofUpscaling;
                // }
                // if (TotalHeightScaling != 0) {
                //   if (totalRoofPositioning > 0) {
                //     if (localStorage.getItem("slab") === "Enable") { 
                //       if(mesh.name === 'fRoof'){
                //         if (parseInt(localStorage.getItem("slabSize")) > 150) {
                //           mesh.position.y = totalRoofPositioning + 0.50;
                //         } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100) {
                //           mesh.position.y = totalRoofPositioning + 0.49;
                //         } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50) {
                //           mesh.position.y = totalRoofPositioning + 0.48;
                //         } else if (parseInt(localStorage.getItem("slabSize")) < 50) {
                //           mesh.position.y = totalRoofPositioning + 0.47;
                //         }else{
                //           mesh.position.y = totalRoofPositioning + 0.47;
                //         }
                //       }else{
                //         mesh.position.y = totalRoofPositioning + 0.4;
                //       }           
                //       // mesh.position.y = totalRoofPositioning +;
                //     } else {
                //       if(mesh.name === 'fRoof'){
                //         mesh.position.y = totalRoofPositioning + 0.45;
                //       }else{
                //         mesh.position.y = totalRoofPositioning
                //       }
                //       console.log("total roof positioning: ", totalRoofPositioning)
                //     }
                // }
                // }
                mesh.scaling.x += TotalWidthScaling;
                if(mesh.name === 'fRoof'){
                  RoofPitchUtility(mesh)
                  mesh.scaling.y += totalRoofUpscaling;
                  const children = mesh.getChildMeshes(); // Gets all child meshes of the container
                  children.forEach(child => {
                      if (child.material) {
                          ColorMesh(child)
                      }
                  });
                }else{
                  mesh.setPivotPoint(new Vector3(0, 2.45, 0));
                  mesh.scaling.y += totalRoofUpscaling;
                }
              if(TotalHeightScaling != 0){
                //mesh.setPivotPoint(new Vector3(0, 0, 0));
                if(mesh.name === 'fRoof' || mesh.name === 'leanToFrontRoof') {
                  console.log("mesh position y = ", mesh.position.y, " totoa pos y: ", totalRoofPositioning)
                  mesh.position.y += totalRoofPositioning;
                  console.log("after: pos: ", mesh.position.y)
                }else if(mesh.name === 'FTop' || mesh.name === 'BTop'){
                  if(localStorage.getItem('slab') !== 'Disable'){
                    if(parseInt(localStorage.getItem('slabSize')) < 50){
                      mesh.position.y = totalRoofPositioning;
                    }else if(parseInt(localStorage.getItem('slabSize')) >= 50 && parseInt(localStorage.getItem('slabSize')) < 100){
                      mesh.position.y = totalRoofPositioning + 0.1;
                    }else if(parseInt(localStorage.getItem('slabSize')) >= 100 && parseInt(localStorage.getItem('slabSize')) < 150){
                      mesh.position.y = totalRoofPositioning + 0.2;
                    }else if(parseInt(localStorage.getItem('slabSize')) >= 150){
                      mesh.position.y = totalRoofPositioning + 0.4;
                    }
                  }else{
                    mesh.position.y = totalRoofPositioning;
                  }
                }else{
                  mesh.position.y = totalRoofPositioning;
                }
              }
            ColorMesh(mesh);
                if (mesh.name === 'FTop' || mesh.name === 'BTop') {
                  mesh.isVisible = copy[index].isVisible;
                }
                ColorMesh(mesh);
                if (mesh.name === 'leanToFrontRoof') {
                  mesh.isVisible = copy[index].isVisible;

                }
              }
            } else if (mesh.name === "leantoleftcols" || mesh.name === 'leantoleftcolfront' || mesh.name === 'leantoleftcolback') {
              if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
              }
              else {
                mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
              }
              mesh.scaling.y += TotalHeightScaling - 0.1;
              // if(parseInt(localStorage.getItem("height")) >=6){
              //   if(parseInt(localStorage.getItem('height')) == 6){
              //       mesh.scaling.y += 0.1;
              //   }else if(parseInt(localStorage.getItem('height')) == 7){
              //       mesh.scaling.y += 0.2;
              //   }else if(parseInt(localStorage.getItem('height')) == 8){
              //       mesh.scaling.y += 0.3;
              //   }else if(parseInt(localStorage.getItem('height')) == 9){
              //       mesh.scaling.y += 0.4;
              //   }else if(parseInt(localStorage.getItem('height')) == 10){
              //       mesh.scaling.y += 0.5;
              //   }
              // }
            } else if (mesh.name === "leantorightcols" || mesh.name === "leantorightcolfront" || mesh.name === "leantorightcolback") {
              if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
                console.log("if cond")
              }
              else {
                mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) + (-parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")))
                console.log("else cond")
              }
              mesh.scaling.y += TotalHeightScaling - 0.1;
              // if(parseInt(localStorage.getItem("height")) >=6){
              //   if(parseInt(localStorage.getItem('height')) == 6){
              //       mesh.scaling.y += 0.1;
              //   }else if(parseInt(localStorage.getItem('height')) == 7){
              //       mesh.scaling.y += 0.2;
              //   }else if(parseInt(localStorage.getItem('height')) == 8){
              //       mesh.scaling.y += 0.3;
              //   }else if(parseInt(localStorage.getItem('height')) == 9){
              //       mesh.scaling.y += 0.4;
              //   }else if(parseInt(localStorage.getItem('height')) == 10){
              //       mesh.scaling.y += 0.5;
              //   }
              // }
            } else if (mesh.name !== 'LHarrow' && mesh.name !== 'RHarrow' && mesh.name !== 'cantileverLeft' && mesh.name !== 'cantileverRight' && mesh.name !== 'container_front' && mesh.name !== 'leanToFrontRoof') {
              if (mesh.name !== 'leanToLeftPartWall' && mesh.name !== 'leanToLeftTriangle' && mesh.name !== 'leanToRightPartWall' && mesh.name !== 'leanToRightTriangle'
                && mesh.name !== 'leanToRightTriangleBack' && mesh.name !== 'leanToRightPartWallBack' && mesh.name !== 'leanToLeftTriangleBack' && mesh.name !== 'leanToLeftPartWallBack'
                && mesh.name !== 'leanToLeftWalls' && mesh.name !== 'leanToRightWalls' && mesh.name !== 'leanToLeftRoofs' && mesh.name !== 'leanToRightRoofs' && mesh.name !== 'leantoleftcols' && mesh.name !== 'leantoleftcolfront' && mesh.name !== 'leantoleftcolback' && mesh.name !== 'leantorightcols'
                & mesh.name !== "leantorightcolfront" && mesh.name !== "leantorightcolback" && mesh.name !== 'col1' && mesh.name !== 'col2' && mesh.name !== 'col3' && mesh.name !== 'col4' && mesh.name !== 'colfront1' && mesh.name !== 'colfront2'
                && mesh.name !== 'colCenter1' && mesh.name !== 'colCenter2' && mesh.name !== 'bltruss' && mesh.name !== 'brtruss' && mesh.name !== 'fltruss' && mesh.name !== 'frtruss' && mesh.name !== 'ltruss' && mesh.name !== 'rtruss'
                && mesh.name !== 'container_left_bracing' && mesh.name !== 'container_right_bracing') {
                mesh.scaling.x += TotalWidthScaling;
                if (mesh.name !== 'arrow' && mesh.name !== 'container_right_mezzanine' && mesh.name !== 'container_left_mezzanine' && mesh.name !== 'groundTile') {
                  mesh.scaling.y += TotalHeightScaling;
                }
              }
              ColorMesh(mesh);
              if (mesh.name === 'FWall' || mesh.name === 'BWall' || mesh.name === 'Lwall' || mesh.name === 'Rwall' || mesh.name === 'cantileverFront' || mesh.name === 'leanToFront'
                || mesh.name === 'leanToLeftPartWall' || mesh.name === 'leanToLeftTriangle' || mesh.name === 'leanToRightPartWall' || mesh.name === 'leanToRightTriangle'
                || mesh.name === 'leanToRightTriangleBack' || mesh.name === 'leanToRightPartWallBack' || mesh.name === 'leanToLeftTriangleBack' || mesh.name === 'leanToLeftPartWallBack'
                || mesh.name === 'leanToLeftWalls' || mesh.name === 'leanToRightWalls' || mesh.name === 'leanToFrontCols'
              ) {
                mesh.isVisible = copy[index].isVisible;
              }
              if (mesh.name === 'arrow' || mesh.name === 'fGround' || mesh.name === 'fLogo') {
                if (localStorage.getItem("frontAwning") === 'true') {
                  if (parseFloat(localStorage.getItem("frontAwningLength")) < 7) {
                    mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 0.6;
                  } else if (parseFloat(localStorage.getItem("frontAwningLength")) < 10) {
                    mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 1;
                  } else if (parseFloat(localStorage.getItem("frontAwningLength")) < 13) {
                    mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 4;
                  } else {
                    mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 5;
                  }
                }
              }
            }
          }
        });
      }
      frontCount++;
      // Remove null values from container
      loadedMeshes = loadedMeshes.filter(function (mesh) {
        return mesh !== null;
      });
      if (lTextPos != 0) {
        leftText.current.forEach((mesh) => {
          sessionStorage.setItem("ArrowPosition_", mesh.position.x + 1);
          // mesh.position.x = lTextPos + 1.5;
          // mesh.position.x = loadedMeshes[0][21].position.x + 3.5;
        })
      }
      gable.checkBaySize(baySizeRef, loadedMeshes, sceneRef.current, finalPosition)
      if (localStorage.getItem("leftAwning") == "true") {
        var awningHeight = updateAwningHeight(parseFloat(localStorage.getItem("height")), parseFloat(localStorage.getItem("leftAwningPitch")), parseFloat(localStorage.getItem("leftAwningLength")));
        heightArrow = gable.checkHeightChangeLeft(awningHeight, loadedMeshes, scene, parseFloat(localStorage.getItem("leftAwningPitch")))
        depthLeftArrow = gable.createAwningDepthMeasurementsLeft(parseInt(localStorage.getItem("leftAwningLength")), scene);
      }
      if (localStorage.getItem("rightAwning") == "true") {
        var rightAwningHeight = updateAwningHeight(parseFloat(localStorage.getItem("height")), parseFloat(localStorage.getItem("rightAwningPitch")), parseFloat(localStorage.getItem("rightAwningLength")));
        rightHeightArrow = gable.checkHeightChangeRight(rightAwningHeight, loadedMeshes, scene, parseFloat(localStorage.getItem("rightAwningPitch")))
        depthRightArrow = gable.createAwningDepthMeasurementsRight(parseInt(localStorage.getItem("rightAwningLength")), scene);
      }
      loadedMeshes.forEach((meshes) =>{
        meshes.forEach((mesh) =>{
          if(mesh.name === 'container_right_mezzanine' || mesh.name === 'container_left_mezzanine'){
            mezzanineHeightFixer(mesh);
          }
        })
      })
      enableTrussesForNewBays(loadedMeshes);
      if(localStorage.getItem('leftAwning') == 'true' || localStorage.getItem('rightAwning') == 'true'){
        enableTrussesForNewAwningBays(loadedMeshes);
      }
      return loadedMeshes;
    }
    else {
      window.alert("No more bays allowed, total bays: ", loadedMeshes.length);
      return loadedMeshes;
    }
  }
}

export function sendHeightArrow() {
  if (heightArrow != null) {
    return heightArrow;
  } else {
    return null
  }
}

export function sendRightHeightArrow() {
  if (rightHeightArrow != null) {
    return rightHeightArrow;
  } else {
    return null
  }
}
// export function recieveHeightArrowCore(heightArrowRec){
//   heightArrow = heightArrowRec;
// }
//<=================== deleting length Handler ===========================>//

//delete bays with decrease in length broken
export function deleteFromFront(loadedMeshes, scene) {
  var isLeftAwning = localStorage.getItem('leftAwning');
  var isLeftCantilever = localStorage.getItem('leftCantilever');
  var copy = [...loadedMeshes[1]]
  if (loadedMeshes) {
    if (loadedMeshes.length >= 4) {
      //disposal logic
      var zPosition = loadedMeshes[1][0].position.z;
      loadedMeshes[1].forEach((meshes, index) => {
        if (meshes) {
          meshes.dispose();
        }
      });
      loadedMeshes[1] = gable.createFrontBay(zPosition - 5.1, 1, scene, degree, 10);
      // Apply scaling to front mesh
      if (loadedMeshes.length > 1 && loadedMeshes[1]) {
        loadedMeshes[1].forEach((mesh, index) => {
          if (mesh) {
            if (mesh.name == 'Larrow') {
              // if(finalPosition){
              //   mesh.position.x = finalPosition;
              //   if(isLeftAwning === 'true' || isLeftCantilever === 'true'){
              //     // mesh.position.x += 2.5;
              //     mesh.position.x = loadedMeshes[0][21].position.x;
              //   }
              //   if(larrowPos != 0){
              //     // mesh.position.x = larrowPos;
              //   }
              //   ColorMesh(mesh);
              // }else{
              //   if(isLeftAwning === 'true' || isLeftCantilever === 'true'){
              //     // mesh.position.x += 2.5;

              //     mesh.position.x = loadedMeshes[0][21].position.x;
              //   }
              //   if(larrowPos != 0){
              //     mesh.position.x = larrowPos;
              //   }
              //   if(lTextPos != 0){
              //     leftText.current.forEach((mesh) => {
              //       mesh.position.x = lTextPos;
              //     })
              //   }
              // }
            }
            else if (mesh.name == 'fGround' || mesh.name === 'fLogo') {
              if (parseFloat(localStorage.getItem("frontAwningLength")) < 7) {
                mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 0.6;
              } else if (parseFloat(localStorage.getItem("frontAwningLength")) < 11) {
                mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 2;
              } else if (parseFloat(localStorage.getItem("frontAwningLength")) < 13) {
                mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 4;
              } else {
                mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 5;


              }
            }
            else if (mesh.name === 'container_front' || mesh.name === 'cantileverFront') {
              if (frontscalingFactor != 0) {
                mesh.setPivotPoint(new Vector3(-1.2, 0, 0));
                mesh.scaling.z += frontscalingFactor;
              }
            }
            else if (mesh.name === 'container_left' || mesh.name === 'cantileverLeft') {
              if (leanToLeftPos > 0) {
                mesh.position.x = leanToLeftPos;
              }
              if (leftscalingFactor != 0) {
                mesh.setPivotPoint(new Vector3(2.5, 0, 0));
                mesh.scaling.x = leftscalingFactor;
              }
              if (TotalHeightScaling != 0) {
                mesh.scaling.y += TotalHeightScaling;
              }
              // if(mesh.name === 'cantileverLeft'){
              //   mesh.position.y = 0;
              // }
            }else if (mesh.name === 'leftAwningGroundTile'){
              if(leanToLeftPos > 0){
                mesh.position.x += leanToLeftPos;
              }
              if (leftscalingFactor != 0) {
                mesh.setPivotPoint(new Vector3(-1.25, 0, 0));
                mesh.scaling.x = leftscalingFactor;
              }
            }else if (mesh.name === 'rightAwningGroundTile'){
              if(leanToRightPos < 0){
                mesh.position.x += leanToRightPos;
              }
              if (rightscalingFactor != 0) {
                mesh.setPivotPoint(new Vector3(1.25, 0, 0));
                mesh.scaling.x = rightscalingFactor;
              }
            }
            else if (mesh.name === 'afltruss') {
              if (TotalHeightScaling != 0) {
                mesh.position.y += totalAwningTrussHeight;
              }
              if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
              }
              else {
                mesh.position.x += parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
              }
            }
            else if (mesh.name === 'afrtruss') {
              if (TotalHeightScaling != 0) {
                mesh.position.y += totalAwningTrussHeight;
              }
              if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
              }
              else {
                mesh.position.x += parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) + (-parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")))
              }
            }
            else if (mesh.name === 'container_right' || mesh.name === 'cantileverRight') {
              if (leanToRightPos < 0) {
                mesh.position.x = leanToRightPos;
              }
              if (rightscalingFactor != 0) {
                mesh.setPivotPoint(new Vector3(-2.5, 0, 0));
                mesh.scaling.x = rightscalingFactor;
              }
              if (TotalHeightScaling != 0) {
                mesh.scaling.y += TotalHeightScaling;
              }
              // if(mesh.name === 'cantileverRight'){
              //   mesh.position.y = 0;
              // }
            }
            else if (mesh.name === 'fRoof' || mesh.name === ' topCenter' || mesh.name === 'FTop' || mesh.name === 'BTop' || mesh.name === 'leanToFrontRoof' || mesh.name === 'frtruss' || mesh.name === 'fltruss' || mesh.name === 'container_left_bracing' || mesh.name === 'container_right_bracing') {
              if (mesh.name === 'frtruss' || mesh.name === 'fltruss' || mesh.name === 'container_left_bracing' || mesh.name === 'container_right_bracing') {
                if (mesh.name === 'container_left_bracing' || mesh.name === 'container_right_bracing') {
                  if (TotalHeightScaling != 0) {
                    mesh.scaling.y += TotalHeightScaling;
                  }
                  if (mesh.name === 'container_right_bracing') {
                    if (leanToRightPos < 0) {
                      mesh.position.x += leanToRightPos;
                    }
                  } else {
                    if (leanToLeftPos > 0) {
                      mesh.position.x += leanToLeftPos;
                    }
                  }
                } else {
                  if (TotalHeightScaling != 0) {
                    if(mesh.name === 'leanToFrontRoof'){
                      mesh.position.y += totalRoofPositioning - 0.45;
                    }else{
                      mesh.position.y += totalRoofPositioning;
                    }
                  }
                  if (mesh.name === 'frtruss') {
                    if (leanToRightPos < 0) {
                      mesh.position.x += leanToRightPos;
                    }
                  } else {
                    if (leanToLeftPos > 0) {
                      mesh.position.x += leanToLeftPos;
                    }
                  }
                }
              } else {
                // console.log("all here: ", mesh.name)
                // mesh.scaling.x += TotalWidthScaling;
                // if(mesh.name === 'fRoof'){
                //   mesh.setPivotPoint(new Vector3(0, 2.40, 0));
                //   mesh.scaling.y += totalRoofUpscaling;
                // }else{
                //   mesh.setPivotPoint(new Vector3(0, 2.45, 0));
                //   mesh.scaling.y += totalRoofUpscaling;
                // }
                // if (TotalHeightScaling != 0) {
                //   if (totalRoofPositioning > 0) {
                //     if (localStorage.getItem("slab") === "Enable") {            
                //     if (parseInt(localStorage.getItem("slabSize")) > 150) {
                //       mesh.position.y = totalRoofPositioning + 0.50;
                //     } else if (parseInt(localStorage.getItem("slabSize")) < 150 && parseInt(localStorage.getItem("slabSize")) > 100) {
                //       mesh.position.y = totalRoofPositioning + 0.49;
                //     } else if (parseInt(localStorage.getItem("slabSize")) < 100 && parseInt(localStorage.getItem("slabSize")) > 50) {
                //       mesh.position.y = totalRoofPositioning + 0.48;
                //     } else if (parseInt(localStorage.getItem("slabSize")) < 50) {
                //       mesh.position.y = totalRoofPositioning + 0.47;
                //     }else{
                //       mesh.position.y = totalRoofPositioning + 0.47;
                //     }
                //       // mesh.position.y = totalRoofPositioning +;
                //     } else {
                //       console.log("total roof positioning: ", totalRoofPositioning)
                //       if(mesh.name === 'fRoof'){
                //         mesh.position.y = totalRoofPositioning + 0.47;
                //       }else{
                //         mesh.position.y = totalRoofPositioning + 0.47;
                //       }
                //     }
                // }
                // }
                mesh.scaling.x += TotalWidthScaling;
                if(mesh.name === 'fRoof'){
                  RoofPitchUtility(mesh)
                  mesh.scaling.y += totalRoofUpscaling;
                  const children = mesh.getChildMeshes(); // Gets all child meshes of the container
                  children.forEach(child => {
                      if (child.material) {
                          ColorMesh(child)
                      }
                  });
                }else{
                  mesh.setPivotPoint(new Vector3(0, 2.45, 0));
                  mesh.scaling.y += totalRoofUpscaling;
                }
              if(TotalHeightScaling != 0){
                //mesh.setPivotPoint(new Vector3(0, 0, 0));
                if(mesh.name === 'fRoof' || mesh.name === 'leanToFrontRoof') {
                  console.log("mesh position y = ", mesh.position.y, " totoa pos y: ", totalRoofPositioning)
                  mesh.position.y += totalRoofPositioning;
                  console.log("after: pos: ", mesh.position.y)
                }else if(mesh.name === 'FTop' || mesh.name === 'BTop'){
                  if(localStorage.getItem('slab') !== 'Disable'){
                    if(parseInt(localStorage.getItem('slabSize')) < 50){
                      mesh.position.y = totalRoofPositioning;
                    }else if(parseInt(localStorage.getItem('slabSize')) >= 50 && parseInt(localStorage.getItem('slabSize')) < 100){
                      mesh.position.y = totalRoofPositioning + 0.1;
                    }else if(parseInt(localStorage.getItem('slabSize')) >= 100 && parseInt(localStorage.getItem('slabSize')) < 150){
                      mesh.position.y = totalRoofPositioning + 0.2;
                    }else if(parseInt(localStorage.getItem('slabSize')) >= 150){
                      mesh.position.y = totalRoofPositioning + 0.4;
                    }
                  }else{
                    mesh.position.y = totalRoofPositioning;
                  }
                }else{
                  mesh.position.y = totalRoofPositioning;
                }
              }
                if (mesh.name === 'FTop' || mesh.name === 'BTop') {
                  mesh.isVisible = copy[index].isVisible;
                }
                if (mesh.name === 'leanToFrontRoof') {
                  mesh.isVisible = copy[index].isVisible;
                }
                ColorMesh(mesh);
              }
            } else if (mesh.name === "leantoleftcols" || mesh.name === 'leantoleftcolfront' || mesh.name === 'leantoleftcolback') {
              if (parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_")) <= 0) {
                mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_"))
              }
              else {
                mesh.position.x = parseFloat(sessionStorage.getItem("leftAwningWallPosition_")) + parseFloat(sessionStorage.getItem("leftHeightArrowPositionAfterWidth_"))
              }
              mesh.scaling.y += TotalHeightScaling - 0.1;
              // if(parseInt(localStorage.getItem("height")) >=6){
              //   if(parseInt(localStorage.getItem('height')) == 6){
              //       mesh.scaling.y += 0.1;
              //   }else if(parseInt(localStorage.getItem('height')) == 7){
              //       mesh.scaling.y += 0.2;
              //   }else if(parseInt(localStorage.getItem('height')) == 8){
              //       mesh.scaling.y += 0.3;
              //   }else if(parseInt(localStorage.getItem('height')) == 9){
              //       mesh.scaling.y += 0.4;
              //   }else if(parseInt(localStorage.getItem('height')) == 10){
              //       mesh.scaling.y += 0.5;
              //   }
              // }
            } else if (mesh.name === "leantorightcols" || mesh.name === "leantorightcolfront" || mesh.name === "leantorightcolback") {
              if (parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")) <= 0) {
                mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_"))
                console.log("if cond")
              }
              else {
                mesh.position.x = parseFloat(sessionStorage.getItem("rightAwningWallPosition_")) + (-parseFloat(sessionStorage.getItem("rightHeightArrowPositionAfterWidth_")))
                console.log("else cond")
              }
              mesh.scaling.y += TotalHeightScaling - 0.1;
              // if(parseInt(localStorage.getItem("height")) >=6){
              //   if(parseInt(localStorage.getItem('height')) == 6){
              //       mesh.scaling.y += 0.1;
              //   }else if(parseInt(localStorage.getItem('height')) == 7){
              //       mesh.scaling.y += 0.2;
              //   }else if(parseInt(localStorage.getItem('height')) == 8){
              //       mesh.scaling.y += 0.3;
              //   }else if(parseInt(localStorage.getItem('height')) == 9){
              //       mesh.scaling.y += 0.4;
              //   }else if(parseInt(localStorage.getItem('height')) == 10){
              //       mesh.scaling.y += 0.5;
              //   }
              // }
            } else if (mesh.name !== 'LHarrow' && mesh.name !== 'RHarrow' && mesh.name !== 'cantileverLeft' && mesh.name !== 'cantileverRight' && mesh.name !== 'container_front' && mesh.name !== 'leanToFrontRoof') {
              if (mesh.name !== 'leanToLeftPartWall' && mesh.name !== 'leanToLeftTriangle' && mesh.name !== 'leanToRightPartWall' && mesh.name !== 'leanToRightTriangle'
                && mesh.name !== 'leanToRightTriangleBack' && mesh.name !== 'leanToRightPartWallBack' && mesh.name !== 'leanToLeftTriangleBack' && mesh.name !== 'leanToLeftPartWallBack'
                && mesh.name !== 'leanToLeftWalls' && mesh.name !== 'leanToRightWalls' && mesh.name !== 'leanToLeftRoofs' && mesh.name !== 'leanToRightRoofs' && mesh.name !== 'leantoleftcols' && mesh.name !== 'leantoleftcolfront' && mesh.name !== 'leantoleftcolback' && mesh.name !== 'leantorightcols'
                & mesh.name !== "leantorightcolfront" && mesh.name !== "leantorightcolback" && mesh.name !== 'col1' && mesh.name !== 'col2' && mesh.name !== 'col3' && mesh.name !== 'col4' && mesh.name !== 'colfront1' && mesh.name !== 'colfront2'
                && mesh.name !== 'colCenter1' && mesh.name !== 'colCenter2' && mesh.name !== 'bltruss' && mesh.name !== 'brtruss' && mesh.name !== 'fltruss' && mesh.name !== 'frtruss' && mesh.name !== 'ltruss' && mesh.name !== 'rtruss'
                && mesh.name !== 'container_left_bracing' && mesh.name !== 'container_right_bracing') {
                mesh.scaling.x += TotalWidthScaling;
                if (mesh.name !== 'arrow' && mesh.name !== 'groundTile'  && mesh.name !== 'container_right_mezzanine' && mesh.name !== 'container_left_mezzanine') {
                  mesh.scaling.y += TotalHeightScaling;
                }
              }
              ColorMesh(mesh);
              if (mesh.name === 'FWall' || mesh.name === 'BWall' || mesh.name === 'Lwall' || mesh.name === 'Rwall' || mesh.name === 'cantileverFront' || mesh.name === 'leanToFront'
                || mesh.name === 'leanToLeftPartWall' || mesh.name === 'leanToLeftTriangle' || mesh.name === 'leanToRightPartWall' || mesh.name === 'leanToRightTriangle'
                || mesh.name === 'leanToRightTriangleBack' || mesh.name === 'leanToRightPartWallBack' || mesh.name === 'leanToLeftTriangleBack' || mesh.name === 'leanToLeftPartWallBack'
                || mesh.name === 'leanToLeftWalls' || mesh.name === 'leanToRightWalls' || mesh.name === 'leanToFrontCols'
              ) {
                mesh.isVisible = copy[index].isVisible;
              }
              if (mesh.name === 'arrow' || mesh.name === 'fGround' || mesh.name === 'fLogo') {
                if (localStorage.getItem("frontAwning") === 'true') {
                  if (parseFloat(localStorage.getItem("frontAwningLength")) < 7) {
                    mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 0.6;
                  } else if (parseFloat(localStorage.getItem("frontAwningLength")) < 10) {
                    mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 1;
                  } else if (parseFloat(localStorage.getItem("frontAwningLength")) < 13) {
                    mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 4;
                  } else {
                    mesh.position.z += parseFloat(localStorage.getItem("frontAwningLength")) - 5;
                  }
                }
              }
            }
            ColorMesh(mesh);
          }
          if(mesh.name === 'leanToLeft' || mesh.name === 'cantileverLeft' || mesh.name === 'leanToLeftWalls' || mesh.name === 'leanToLeftRoofs' || mesh.name === 'leantoleftcols'
            || mesh.name === 'leanToRight' || mesh.name === 'cantileverRight' || mesh.name === 'leanToRightWalls' || mesh.name === 'leanToRightRoofs' || mesh.name === 'leantorightcols' 
          ){
            ColorMesh(mesh);
          }
        });
      }
      //disposal logic for center mesh
      if (loadedMeshes[frontCount]) {
        loadedMeshes[frontCount + 1].forEach(mesh => {
          mesh.dispose();
        });
        loadedMeshes[frontCount + 1] = null;
        loadedMeshes = loadedMeshes.filter(function (mesh) {
          return mesh !== null;
        });
      }
      frontCount--;
    }
    if (localStorage.getItem("leftAwning") == 'true') {
      var awningHeight = updateAwningHeight(parseFloat(localStorage.getItem("height")), parseFloat(localStorage.getItem("leftAwningPitch")), parseFloat(localStorage.getItem("leftAwningLength")));
      heightArrow = gable.checkHeightChangeLeft(awningHeight, loadedMeshes, scene, parseFloat(localStorage.getItem("leftAwningPitch")))
      depthLeftArrow = gable.createAwningDepthMeasurementsLeft(parseInt(localStorage.getItem("leftAwningLength")), scene);
    }
    if (localStorage.getItem("rightAwning") == 'true') {
      var rightAwningHeight = updateAwningHeight(parseFloat(localStorage.getItem("height")), parseFloat(localStorage.getItem("rightAwningPitch")), parseFloat(localStorage.getItem("rightAwningLength")));
      rightHeightArrow = gable.checkHeightChangeRight(rightAwningHeight, loadedMeshes, scene, parseFloat(localStorage.getItem("rightAwningPitch")))
      depthRightArrow = gable.createAwningDepthMeasurementsRight(parseInt(localStorage.getItem("rightAwningLength")), scene);
    }
    // if(localStorage.getItem("frontAwning") == "true"){
    //   console.log("inererere")
    //   var current = parseInt(localStorage.getItem("frontAwningLength"));
    //   if(current > 1 && current < 15){
    //     localStorage.setItem("frontAwningLength", current + 1)
    //   }else if(current == 1){
    //     localStorage.setItem("frontAwningLength", current + 1)
    //   }else if(current == 15){
    //     localStorage.setItem("frontAwningLength", current + 1)
    //   }
    // }
    loadedMeshes[1].forEach((mesh) =>{
        if(mesh.name === 'container_right_mezzanine' || mesh.name === 'container_left_mezzanine'){
          mezzanineHeightFixer(mesh);
        }
    })
    getAllChecksForEnablingBayTrussesDeletion(loadedMeshes);
    enableTrussesForDeletingBays(loadedMeshes);
    if(localStorage.getItem('leftAwning') == 'true' || localStorage.getItem('rightAwning') == 'true'){
      getAllChecksForEnablingAwningTrussesDeletion(loadedMeshes);
      enableTrussesForDeletingAwningBays(loadedMeshes);
    }
    return loadedMeshes;
  }
}

//<============================================= BaySize Handler =========================================>//
export function handleBaySize(loadedMeshes, scene, centerBayDimensions, centerBayPosition, frontBayDimensions, frontBayPosition) {
  //disposal logic
  loadedMeshes.forEach((meshes) => {
    if (meshes) {
      meshes.forEach((mesh) => {
        if (mesh) {
          mesh.dispose();
        }
      });
    }
  });
  loadedMeshes = [[], [], []];
  //creation logic
  loadedMeshes[0] = gable.createBackBay(
    centerBayDimensions,
    centerBayPosition,
    2,
    scene,
    degree
  );
  loadedMeshes[1] = gable.createFrontBay(1, 0, scene, degree);
  loadedMeshes[2] = gable.createCenterBay(
    frontBayDimensions,
    frontBayPosition,
    0.976,
    scene,
    degree
  );
  loadedMeshes[2].forEach((mesh) => {
    if (mesh) {
      if (mesh.name == 'arrow' || mesh.name == 'Larrow') {
        if (finalPosition) {
          mesh.position.x = finalPosition;
          ColorMesh(mesh);
        }
      }
      else {
        mesh.scaling.x += TotalWidthScaling;
        mesh.scaling.y += TotalHeightScaling;
        ColorMesh(mesh);
      }
    }
  });
  loadedMeshes[1].forEach((mesh) => {
    if (mesh) {
      if (mesh.name == 'Larrow') {
        if (finalPosition) {
          mesh.position.x = finalPosition;
        }
      }
      else if (mesh.name == 'ground') {
        //do nothing
      }
      else {
        mesh.scaling.x += TotalWidthScaling;
        mesh.scaling.y += TotalHeightScaling;
        ColorMesh(mesh);
      }
    }
  });
  loadedMeshes[0].forEach((mesh) => {
    if (mesh) {
      if (mesh.name == 'Larrow') {
        if (finalPosition) {
          mesh.position.x = finalPosition;
        }
      }
      else if (mesh.name == 'ground') {
        //do nothing
      }
      else {
        mesh.scaling.x += TotalWidthScaling;
        mesh.scaling.y += TotalHeightScaling;
        ColorMesh(mesh);
      }
    }
  });
  frontCount = 1;
  // return new loadedMeshes Array
  return loadedMeshes;
}